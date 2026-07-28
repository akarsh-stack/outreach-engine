from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models.email import Email
from schemas.email import EmailCreate, EmailUpdate, EmailResponse
from middleware.auth import get_current_user_clerk_id
from services.email_sender import send_email
from datetime import datetime, timezone

router = APIRouter(prefix="/emails", tags=["emails"])

@router.get("/lead/{lead_id}", response_model=List[EmailResponse])
async def list_emails_for_lead(
    lead_id: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Email).where(Email.lead_id == lead_id).order_by(Email.sequence_step))
    return result.scalars().all()

@router.post("/{email_id}/send")
async def send_draft_email(
    email_id: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    # Setup for sending email manually (usually it would be automatic)
    result = await db.execute(select(Email).where(Email.id == email_id))
    email = result.scalars().first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
        
    if email.status != "draft":
        raise HTTPException(status_code=400, detail="Email is not in draft status")
        
    # Assume lead is reachable via relationships or another query
    # Mocking recipient email for now
    recipient_email = "test@example.com"
    
    send_result = await send_email(recipient_email, email.subject, email.body)
    if send_result.get("status") == "sent":
        email.status = "sent"
        email.sent_at = datetime.now(timezone.utc)
        await db.commit()
        return {"status": "success", "message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")
