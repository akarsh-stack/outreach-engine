from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped.")

# Example scheduled job function could be defined here or elsewhere
# async def check_follow_ups():
#     pass
# scheduler.add_job(check_follow_ups, 'interval', minutes=60)
