from fastapi import HTTPException, status

from app.models.agent_run import AllowedRole, AllowedTaskType
from app.observability.audit_logger import log_agent_run

ROLE_PERMISSIONS: dict[AllowedRole, set[AllowedTaskType]] = {
    "student": {"tutor"},
    "teacher": {"tutor", "summary", "document_search"},
    "admin": {"tutor", "summary", "document_search"},
}


def check_permission(role: AllowedRole, task_type: AllowedTaskType, user_id: str) -> None:
    """Raise 403 if the role is not allowed to use the requested task_type."""
    allowed_tasks = ROLE_PERMISSIONS.get(role, set())
    if task_type not in allowed_tasks:
        blocked_reason = f"Role '{role}' is not allowed to use task_type '{task_type}'"
        log_agent_run(
            user_id=user_id,
            role=role,
            task_type=task_type,
            request_status="policy_denied",
            blocked_reason=blocked_reason,
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=blocked_reason,
        )
