from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class SequenceBase(BaseModel):
    step_number: int
    follow_up_days: int
    message_template: str

class SequenceCreate(SequenceBase):
    campaign_id: UUID

class SequenceUpdate(BaseModel):
    step_number: Optional[int] = None
    follow_up_days: Optional[int] = None
    message_template: Optional[str] = None

class SequenceResponse(SequenceBase):
    id: UUID
    campaign_id: UUID

    class Config:
        from_attributes = True
