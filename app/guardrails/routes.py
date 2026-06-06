from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def guardrails_placeholder() -> dict[str, str]:
    """Placeholder route — safety guardrails will be added later."""
    return {"message": "Guardrails module ready"}
