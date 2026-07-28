from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class EmailBase(BaseModel):
    subject: str
    body: str
    status: str = "draft"
    sequence_step: int = 0

class EmailCreate(EmailBase):
    lead_id: UUID

class EmailUpdate(BaseModel):
    subject: Optional[str] = None
    body: Optional[str] = None
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    replied_at: Optional[datetime] = None

class EmailResponse(EmailBase):
    id: UUID
    lead_id: UUID
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    replied_at: Optional[datetime] = None

    class Config:
        from_attributes = True
