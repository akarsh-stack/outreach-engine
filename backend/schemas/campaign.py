from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class CampaignBase(BaseModel):
    name: str
    product_description: str
    tone: str = "professional"
    status: str = "draft"

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    product_description: Optional[str] = None
    tone: Optional[str] = None
    status: Optional[str] = None

class CampaignResponse(CampaignBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
