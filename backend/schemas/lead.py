from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class LeadBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company_name: str
    website: Optional[str] = None
    status: str = "pending"
    research_data: Optional[str] = None

class LeadCreate(LeadBase):
    campaign_id: UUID

class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    status: Optional[str] = None
    research_data: Optional[str] = None

class LeadResponse(LeadBase):
    id: UUID
    campaign_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
