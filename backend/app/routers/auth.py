import os
import re
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, HTTPException
from pymongo.errors import ServerSelectionTimeoutError

from app.database import get_db, get_collection_for_role, ROLE_COLLECTIONS
from app.email_sender import is_smtp_configured, send_password_reset_email, send_test_email, send_verification_email
from app.schemas import ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, SignUpRequest

router = APIRouter()


@router.get("/email-status")
def email_status():
    """Check if SMTP from .env is connected for verification emails. No secrets returned."""
    return {"smtp_configured": is_smtp_configured()}


@router.get("/test-email")
def test_email(to: str | None = None):
    """Send a test verification email. Use ?to=your@email.com or it sends to SMTP_USER."""
    ok, message = send_test_email(to)
    if ok:
        return {"ok": True, "message": message}
    return {"ok": False, "error": message}


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


@router.post("/signup")
def signup(body: SignUpRequest):
    try:
        db = get_db()
        coll_name = get_collection_for_role(body.role)
        coll = db[coll_name]
        existing = coll.find_one({"email": body.email})
        if existing and existing.get("email_verified") is True:
            raise HTTPException(status_code=400, detail="Email already registered")
        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + timedelta(hours=24)
        doc = {
            "name": body.name,
            "email": body.email,
            "role": body.role,
            "department": (body.department or "").strip(),
            "status": "active",
            "contact_number": body.contact_number or "",
            "password_hash": _hash_password(body.password),
            "email_verified": False,
            "email_verification_token": token,
            "email_verification_expires": expires,
        }
        if existing:
            coll.update_one({"_id": existing["_id"]}, {"$set": doc})
            doc["_id"] = existing["_id"]
        else:
            result = coll.insert_one(doc)
            doc["_id"] = result.inserted_id
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        verification_link = f"{frontend_url}/verify-email?token={token}"
        sent, send_err = send_verification_email(body.email, verification_link, body.name)
        if not sent:
            import logging
            logging.getLogger(__name__).warning(
                "Verification email not sent: %s. Link (dev): %s", send_err or "unknown", verification_link
            )
        response = {
            "id": str(doc["_id"]),
            "name": doc["name"],
            "email": doc["email"],
            "role": doc["role"],
            "department": doc["department"],
            "status": doc["status"],
            "contact_number": doc.get("contact_number", ""),
            "email_verified": False,
        }
        if not sent:
            response["verification_link"] = verification_link
        return response
    except ServerSelectionTimeoutError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Set MONGODB_URI in backend .env to your Atlas connection string.",
        )


@router.get("/verify-email")
def verify_email(token: str):
    """Verify email using the token sent by email. Marks the account as active. Same link clicked again returns success (already verified)."""
    try:
        db = get_db()
        now = datetime.now(timezone.utc)
        for coll_name in ROLE_COLLECTIONS:
            coll = db[coll_name]
            doc = coll.find_one({"email_verification_token": token})
            if not doc:
                continue
            # Token found: already verified (e.g. link clicked twice) -> success
            if doc.get("email_verified") is True:
                return {"message": "Email already verified. You can sign in."}
            # Expired -> clear error (MongoDB may return naive datetime; normalize to UTC for comparison)
            expires = doc.get("email_verification_expires")
            if expires:
                if expires.tzinfo is None:
                    expires = expires.replace(tzinfo=timezone.utc)
                if expires < now:
                    raise HTTPException(status_code=400, detail="Verification link has expired.")
            # Valid and not yet verified -> mark verified (keep token so second hit still returns success)
            coll.update_one(
                {"_id": doc["_id"]},
                {"$set": {"email_verified": True}},
            )
            return {"message": "Email verified. You can now sign in."}
        raise HTTPException(status_code=400, detail="Invalid or expired verification link.")
    except ServerSelectionTimeoutError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest):
    """If the email is registered and verified, send a password reset link. Always returns 200 to avoid leaking existence."""
    try:
        db = get_db()
        email_lower = body.email.strip().lower()
        now = datetime.now(timezone.utc)
        expires = now + timedelta(hours=1)
        token = secrets.token_urlsafe(32)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        reset_link = f"{frontend_url}/reset-password?token={token}"

        for coll_name in ROLE_COLLECTIONS:
            coll = db[coll_name]
            doc = coll.find_one({"email": {"$regex": f"^{re.escape(email_lower)}$", "$options": "i"}})
            if not doc:
                continue
            if doc.get("email_verified") is not True:
                break  # don't send reset for unverified
            coll.update_one(
                {"_id": doc["_id"]},
                {"$set": {"password_reset_token": token, "password_reset_expires": expires}},
            )
            sent, _ = send_password_reset_email(body.email, reset_link, doc.get("name", "User"))
            if not sent:
                import logging
                logging.getLogger(__name__).warning("Password reset email not sent to %s", body.email)
            break
        return {"message": "If that email is registered, we sent a password reset link. Check your inbox and spam."}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest):
    """Set new password using the token from the email. Token expires in 1 hour."""
    try:
        db = get_db()
        now = datetime.now(timezone.utc)
        for coll_name in ROLE_COLLECTIONS:
            coll = db[coll_name]
            doc = coll.find_one({"password_reset_token": body.token})
            if not doc:
                continue
            exp = doc.get("password_reset_expires")
            if exp:
                if getattr(exp, "tzinfo", None) is None:
                    exp = exp.replace(tzinfo=timezone.utc)
                if exp < now:
                    raise HTTPException(status_code=400, detail="Reset link has expired. Request a new one.")
            coll.update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {"password_hash": _hash_password(body.new_password)},
                    "$unset": {"password_reset_token": "", "password_reset_expires": ""},
                },
            )
            return {"message": "Password updated. You can now sign in."}
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")
    except HTTPException:
        raise
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.post("/login")
def login(body: LoginRequest):
    try:
        db = get_db()
        coll_name = get_collection_for_role(body.role)
        coll = db[coll_name]
        user = coll.find_one({"email": body.email})
    except ServerSelectionTimeoutError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Set MONGODB_URI in backend .env to your Atlas connection string.",
        )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or role")
    if user.get("email_verified") is False:
        raise HTTPException(
            status_code=403,
            detail="You must click the confirmation link in the email we sent you before you can sign in. Check your inbox (and spam) for that email.",
        )
    password_hash = user.get("password_hash")
    if not password_hash or not _check_password(body.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "department": user.get("department", ""),
            "contact_number": user.get("contact_number", ""),
            "status": user.get("status", "active"),
        },
        "role": user["role"],
    }
