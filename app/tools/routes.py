from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def tools_placeholder() -> dict[str, str]:
    """Placeholder route — agent tools will be added later."""
    return {"message": "Tools module ready"}
