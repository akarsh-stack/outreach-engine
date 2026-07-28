from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models.campaign import Campaign
from models.user import User
from schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from middleware.auth import get_current_user_clerk_id

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

async def get_user_by_clerk_id(clerk_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=CampaignResponse)
async def create_campaign(
    campaign: CampaignCreate, 
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_by_clerk_id(clerk_id, db)
    
    db_campaign = Campaign(**campaign.model_dump(), user_id=user.id)
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
    return db_campaign

@router.get("/", response_model=List[CampaignResponse])
async def list_campaigns(
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_by_clerk_id(clerk_id, db)
    result = await db.execute(select(Campaign).where(Campaign.user_id == user.id))
    return result.scalars().all()

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_by_clerk_id(clerk_id, db)
    result = await db.execute(
        select(Campaign).where(Campaign.id == campaign_id, Campaign.user_id == user.id)
    )
    campaign = result.scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
