import resend
from config import settings
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

async def send_email(to_email: str, subject: str, body: str) -> dict:
    """Sends an email using Resend."""
    if not settings.RESEND_API_KEY:
        logger.warning("No RESEND_API_KEY set. Mocking email send.")
        return {"id": "mock_id", "status": "sent", "sent_at": datetime.now(timezone.utc)}
        
    try:
        # Note: Resend Python SDK might not be natively async for all operations in some versions,
        # but we can call it. Depending on the version, `resend.Emails.send` is synchronous or async.
        # Assuming we can use synchronous call in a thread pool, but let's try the standard call.
        params = {
            "from": "onboarding@resend.dev", # Single sender per workspace assumption
            "to": [to_email],
            "subject": subject,
            "html": body.replace('\n', '<br>')
        }
        
        email = resend.Emails.send(params)
        return {"id": email["id"], "status": "sent", "sent_at": datetime.now(timezone.utc)}
    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {e}")
        return {"status": "failed"}
