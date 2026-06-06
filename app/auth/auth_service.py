from fastapi import Header, HTTPException, status

# Demo key for hackathon — replace with env-based config in production.
DEMO_API_KEY = "hackathon-demo-key"


def require_api_key(x_api_key: str | None = Header(default=None, alias="x-api-key")) -> str:
    """Validate the x-api-key header. Raises 401 if missing or incorrect."""
    if x_api_key != DEMO_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return x_api_key
