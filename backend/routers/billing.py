from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from middleware.auth import get_current_user_clerk_id

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/subscribe")
async def subscribe(
    plan: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    # Integration with Stripe would go here
    return {"status": "success", "message": f"Subscribed to {plan} plan"}
