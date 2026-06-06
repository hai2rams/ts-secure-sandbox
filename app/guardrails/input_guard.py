from fastapi import HTTPException, status

from app.models.agent_run import AllowedRole, AllowedTaskType
from app.observability.audit_logger import log_agent_run

BLOCKED_PHRASES = [
    "ignore previous instructions",
    "reveal system prompt",
    "bypass policy",
    "delete logs",
    "act as admin",
]


def check_input_guardrails(
    query: str,
    user_id: str,
    role: AllowedRole,
    task_type: AllowedTaskType,
) -> None:
    """Block obvious unsafe or prompt-injection style requests."""
    normalized = query.lower()
    for phrase in BLOCKED_PHRASES:
        if phrase in normalized:
            blocked_reason = "Request blocked by input guardrails"
            log_agent_run(
                user_id=user_id,
                role=role,
                task_type=task_type,
                request_status="guardrail_blocked",
                blocked_reason=blocked_reason,
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Request blocked by input guardrails. Please rephrase your query.",
            )
