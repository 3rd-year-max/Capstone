from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo.errors import ServerSelectionTimeoutError

from app.database import get_db
from app.schemas import (
    AddStudentToClassRequest,
    BatchAddStudentsRequest,
    ClassCreate,
    ClassResponse,
    UpdateEnrollmentRequest,
)

router = APIRouter()


def _doc_to_class_response(doc, student_count: int = 0, at_risk_count: int = 0) -> dict:
    return {
        "id": str(doc["_id"]),
        "subject_code": doc["subject_code"],
        "subject_name": doc["subject_name"],
        "instructor_id": doc["instructor_id"],
        "student_count": student_count,
        "at_risk_count": at_risk_count,
    }


@router.get("/risk-alerts")
def list_instructor_risk_alerts(instructor_id: str):
    """List all medium/high risk students across the instructor's classes (for Risk Alerts page)."""
    try:
        db = get_db()
        classes_cursor = db.classes.find({"instructor_id": instructor_id}).sort("subject_code", 1)
        alerts = []
        for c in classes_cursor:
            class_id = str(c["_id"])
            subject_code = c.get("subject_code", "")
            subject_name = c.get("subject_name", "")
            cursor = db.enrollments.find(
                {"class_id": class_id, "risk": {"$in": ["High", "Medium"]}}
            ).sort("student_email", 1)
            for doc in cursor:
                alerts.append({
                    "student_email": doc["student_email"],
                    "risk": doc.get("risk"),
                    "class_id": class_id,
                    "subject_code": subject_code,
                    "subject_name": subject_name,
                })
        return alerts
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.get("/instructor-students")
def list_instructor_students(instructor_id: str):
    """List all students (enrollments) across the instructor's classes for the Student List page."""
    try:
        db = get_db()
        classes_cursor = db.classes.find({"instructor_id": instructor_id}).sort("subject_code", 1)
        rows = []
        for c in classes_cursor:
            class_id = str(c["_id"])
            subject_code = c.get("subject_code", "")
            subject_name = c.get("subject_name", "")
            cursor = db.enrollments.find({"class_id": class_id}).sort("student_email", 1)
            for doc in cursor:
                row = {
                    "student_email": doc["student_email"],
                    "class_id": class_id,
                    "subject_code": subject_code,
                    "subject_name": subject_name,
                }
                if doc.get("risk") is not None:
                    row["risk"] = doc["risk"]
                if doc.get("gpa") is not None:
                    row["gpa"] = doc["gpa"]
                if doc.get("attendance") is not None:
                    row["attendance"] = doc["attendance"]
                if doc.get("lms_activity") is not None:
                    row["lms_activity"] = doc["lms_activity"]
                rows.append(row)
        return rows
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.get("", response_model=list[ClassResponse])
def list_classes(instructor_id: str):
    """List all classes for an instructor."""
    try:
        db = get_db()
        cursor = db.classes.find({"instructor_id": instructor_id}).sort("subject_code", 1)
        classes = []
        for doc in cursor:
            class_id = str(doc["_id"])
            count = db.enrollments.count_documents({"class_id": class_id})
            at_risk = db.enrollments.count_documents(
                {"class_id": class_id, "risk": {"$in": ["High", "Medium"]}}
            )
            classes.append(_doc_to_class_response(doc, count, at_risk))
        return classes
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: str):
    """Get a single class by id."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        doc = db.classes.find_one({"_id": ObjectId(class_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Class not found")
        count = db.enrollments.count_documents({"class_id": class_id})
        at_risk = db.enrollments.count_documents(
            {"class_id": class_id, "risk": {"$in": ["High", "Medium"]}}
        )
        return _doc_to_class_response(doc, count, at_risk)
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.post("", response_model=ClassResponse, status_code=201)
def create_class(body: ClassCreate):
    """Create a new class (subject)."""
    try:
        db = get_db()
        doc = {
            "subject_code": body.subject_code.strip(),
            "subject_name": body.subject_name.strip(),
            "instructor_id": body.instructor_id.strip(),
        }
        result = db.classes.insert_one(doc)
        doc["_id"] = result.inserted_id
        return _doc_to_class_response(doc, 0)
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.get("/{class_id}/students")
def list_class_students(class_id: str):
    """List students enrolled in a class with optional academic/risk/flag data."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        if not db.classes.find_one({"_id": ObjectId(class_id)}):
            raise HTTPException(status_code=404, detail="Class not found")
        cursor = db.enrollments.find({"class_id": class_id}).sort("student_email", 1)
        out = []
        for doc in cursor:
            row = {"student_email": doc["student_email"]}
            if doc.get("risk") is not None:
                row["risk"] = doc["risk"]
            if doc.get("gpa") is not None:
                row["gpa"] = doc["gpa"]
            if doc.get("attendance") is not None:
                row["attendance"] = doc["attendance"]
            if doc.get("lms_activity") is not None:
                row["lms_activity"] = doc["lms_activity"]
            if doc.get("flagged_for_mentoring") is not None:
                row["flagged_for_mentoring"] = doc["flagged_for_mentoring"]
            out.append(row)
        return out
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.get("/{class_id}/risk-summary")
def get_class_risk_summary(class_id: str):
    """Class-level risk summary: counts by risk level and list of at-risk students."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        if not db.classes.find_one({"_id": ObjectId(class_id)}):
            raise HTTPException(status_code=404, detail="Class not found")
        cursor = list(db.enrollments.find({"class_id": class_id}))
        total = len(cursor)
        high_risk = sum(1 for d in cursor if d.get("risk") == "High")
        medium_risk = sum(1 for d in cursor if d.get("risk") == "Medium")
        low_risk = sum(1 for d in cursor if d.get("risk") == "Low")
        at_risk_list = [
            {"student_email": d["student_email"], "risk": d.get("risk")}
            for d in cursor
            if d.get("risk") in ("High", "Medium", "Low")
        ]
        return {
            "total": total,
            "high_risk": high_risk,
            "medium_risk": medium_risk,
            "low_risk": low_risk,
            "at_risk_list": at_risk_list,
        }
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.post("/{class_id}/students", status_code=201)
def add_student_to_class(class_id: str, body: AddStudentToClassRequest):
    """Add a student to a class by email."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        doc = db.classes.find_one({"_id": ObjectId(class_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Class not found")
        email = body.email.strip().lower()
        existing = db.enrollments.find_one({"class_id": class_id, "student_email": email})
        if existing:
            raise HTTPException(status_code=400, detail="Student is already in this class.")
        db.enrollments.insert_one({"class_id": class_id, "student_email": email})
        return {"message": "Student added to class.", "email": body.email}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.post("/{class_id}/students/batch", status_code=201)
def batch_add_students_to_class(class_id: str, body: BatchAddStudentsRequest):
    """Add multiple students to a class by email list."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        if not db.classes.find_one({"_id": ObjectId(class_id)}):
            raise HTTPException(status_code=404, detail="Class not found")
        added = 0
        skipped = 0
        for raw in body.emails:
            email = raw.strip().lower()
            if not email:
                continue
            existing = db.enrollments.find_one({"class_id": class_id, "student_email": email})
            if existing:
                skipped += 1
                continue
            db.enrollments.insert_one({"class_id": class_id, "student_email": email})
            added += 1
        return {"message": "Batch add complete.", "added": added, "skipped": skipped}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")


@router.patch("/{class_id}/students/{student_email:path}")
def update_enrollment(class_id: str, student_email: str, body: UpdateEnrollmentRequest):
    """Update academic indicators, risk, or flagged_for_mentoring for a student in the class."""
    try:
        db = get_db()
        if not ObjectId.is_valid(class_id):
            raise HTTPException(status_code=404, detail="Class not found")
        if not db.classes.find_one({"_id": ObjectId(class_id)}):
            raise HTTPException(status_code=404, detail="Class not found")
        email = student_email.strip().lower()
        doc = db.enrollments.find_one({"class_id": class_id, "student_email": email})
        if not doc:
            raise HTTPException(status_code=404, detail="Student not enrolled in this class.")
        payload = body.model_dump(exclude_unset=True)
        if not payload:
            return {"message": "No updates.", "student_email": email}
        db.enrollments.update_one(
            {"class_id": class_id, "student_email": email},
            {"$set": payload},
        )
        return {"message": "Enrollment updated.", "student_email": email}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Database unavailable.")
