from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field


# ----- User -----
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Literal["instructor", "admin", "amu-staff"]
    department: str
    contact_number: str = ""
    status: Literal["active", "inactive", "pending"] = "active"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["instructor", "admin", "amu-staff"]] = None
    department: Optional[str] = None
    contact_number: Optional[str] = None
    status: Optional[Literal["active", "inactive", "pending"]] = None


class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True


# ----- Student -----
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    course: str
    risk: Literal["High", "Medium", "Low"]
    instructor: str


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    course: Optional[str] = None
    risk: Optional[Literal["High", "Medium", "Low"]] = None
    instructor: Optional[str] = None


class StudentResponse(StudentBase):
    id: str

    class Config:
        from_attributes = True


# ----- Intervention -----
class InterventionBase(BaseModel):
    student: str
    department: str
    course: str
    type: str
    status: Literal["pending", "in-progress", "completed"]
    instructor: str
    due: Optional[str] = None
    completed: Optional[str] = None


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(BaseModel):
    student: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    type: Optional[str] = None
    status: Optional[Literal["pending", "in-progress", "completed"]] = None
    instructor: Optional[str] = None
    due: Optional[str] = None
    completed: Optional[str] = None


class InterventionResponse(InterventionBase):
    id: str

    class Config:
        from_attributes = True


# ----- Notification -----
class NotificationBase(BaseModel):
    title: str
    body: str
    type: str
    time: str
    read: bool = False


class NotificationCreate(NotificationBase):
    role: Literal["instructor", "admin", "amu-staff"]


class NotificationUpdate(BaseModel):
    read: Optional[bool] = None


class NotificationResponse(NotificationBase):
    id: str
    role: str

    class Config:
        from_attributes = True


# ----- Auth -----
class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Full name")
    email: EmailStr
    password: str = Field(..., min_length=1, description="Password")
    contact_number: str = Field("", description="Contact/phone number")
    department: str = Field("", description="Department (e.g. Information Technology)")
    role: Literal["instructor", "admin", "amu-staff"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["instructor", "admin", "amu-staff"]


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=1)


# ----- Class (instructor courses) -----
class ClassCreate(BaseModel):
    subject_code: str = Field(..., min_length=1)
    subject_name: str = Field(..., min_length=1)
    instructor_id: str = Field(..., min_length=1)


class ClassResponse(BaseModel):
    id: str
    subject_code: str
    subject_name: str
    instructor_id: str
    student_count: int = 0
    at_risk_count: int = 0


class AddStudentToClassRequest(BaseModel):
    email: EmailStr


class BatchAddStudentsRequest(BaseModel):
    emails: list[EmailStr] = Field(..., min_length=1, max_length=500)


class UpdateEnrollmentRequest(BaseModel):
    """Academic indicators and risk for a student in a class."""
    gpa: Optional[float] = Field(None, ge=0, le=4)
    attendance: Optional[float] = Field(None, ge=0, le=100)
    lms_activity: Optional[float] = Field(None, ge=0, le=100)
    risk: Optional[Literal["High", "Medium", "Low"]] = None
    flagged_for_mentoring: Optional[bool] = None
