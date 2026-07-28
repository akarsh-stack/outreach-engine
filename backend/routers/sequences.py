from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models.sequence import Sequence
from schemas.sequence import SequenceCreate, SequenceUpdate, SequenceResponse
from middleware.auth import get_current_user_clerk_id

router = APIRouter(prefix="/sequences", tags=["sequences"])

@router.post("/", response_model=SequenceResponse)
async def create_sequence(
    sequence: SequenceCreate, 
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    db_sequence = Sequence(**sequence.model_dump())
    db.add(db_sequence)
    await db.commit()
    await db.refresh(db_sequence)
    return db_sequence

@router.get("/campaign/{campaign_id}", response_model=List[SequenceResponse])
async def list_sequences(
    campaign_id: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Sequence).where(Sequence.campaign_id == campaign_id).order_by(Sequence.step_number))
    return result.scalars().all()
