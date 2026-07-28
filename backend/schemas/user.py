from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    plan: str = "free"
    leads_used_this_month: int = 0
    stripe_customer_id: Optional[str] = None

class UserCreate(UserBase):
    clerk_id: str

class UserResponse(UserBase):
    id: UUID
    clerk_id: str
    created_at: datetime

    class Config:
        from_attributes = True
