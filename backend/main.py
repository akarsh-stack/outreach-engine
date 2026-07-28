from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
from services.scheduler import start_scheduler, stop_scheduler

from routers import (
    users_router,
    campaigns_router,
    leads_router,
    emails_router,
    sequences_router,
    billing_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()

app = FastAPI(title="AI Cold Outreach Engine API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router, prefix="/api")
app.include_router(campaigns_router, prefix="/api")
app.include_router(leads_router, prefix="/api")
app.include_router(emails_router, prefix="/api")
app.include_router(sequences_router, prefix="/api")
app.include_router(billing_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
