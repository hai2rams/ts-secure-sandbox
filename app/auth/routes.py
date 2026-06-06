from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def auth_placeholder() -> dict[str, str]:
    """Placeholder route — authentication will be added later."""
    return {"message": "Auth module ready"}
