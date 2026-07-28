import httpx
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from config import settings
import logging

security = HTTPBearer()

logger = logging.getLogger(__name__)

async def get_clerk_public_key() -> str:
    if not settings.CLERK_ISSUER:
        return ""
    try:
        async with httpx.AsyncClient() as client:
            jwks_url = f"{settings.CLERK_ISSUER}/.well-known/jwks.json"
            response = await client.get(jwks_url)
            response.raise_for_status()
            jwks = response.json()
            return jwks
    except Exception as e:
        logger.error(f"Error fetching Clerk JWKS: {e}")
        return ""

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    if not settings.CLERK_SECRET_KEY or not settings.CLERK_ISSUER:
        # Mock auth for local dev if not configured
        if token == "mock-token":
            return "mock-clerk-id"
        # If no settings, but token isn't mock, we still might just mock it or throw error.
        # Let's mock it for local dev without env setup.
        return "mock-clerk-id"

    jwks = await get_clerk_public_key()
    if not jwks:
        raise HTTPException(status_code=401, detail="Unable to fetch public keys")

    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Invalid token")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=settings.CLERK_ISSUER,
            issuer=settings.CLERK_ISSUER
        )
        return payload["sub"] # This is the clerk_id
    except JWTError as e:
        logger.error(f"JWT decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user_clerk_id(clerk_id: str = Depends(verify_token)) -> str:
    return clerk_id
