from fastapi import FastAPI

from app.auth import router as auth_router
from app.agent import router as agent_router
from app.guardrails import router as guardrails_router
from app.tools import router as tools_router

app = FastAPI(
    title="AI Agent Hackathon API",
    description="Secure production-style AI agent backend",
    version="0.1.0",
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(agent_router, prefix="/agent", tags=["agent"])
app.include_router(guardrails_router, prefix="/guardrails", tags=["guardrails"])
app.include_router(tools_router, prefix="/tools", tags=["tools"])


@app.get("/health")
def health_check() -> dict[str, str]:
    """Simple health check for load balancers and monitoring."""
    return {"status": "ok"}
