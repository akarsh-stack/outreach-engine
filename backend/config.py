from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/dbname"
    CLERK_SECRET_KEY: str = ""
    CLERK_ISSUER: str = ""
    OPENAI_API_KEY: str = ""
    RESEND_API_KEY: str = ""
    SERPAPI_API_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
