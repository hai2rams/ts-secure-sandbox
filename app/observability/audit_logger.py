import logging
from typing import Any

logger = logging.getLogger("audit.agent_run")

if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(_handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False


def log_agent_run(
    *,
    user_id: str,
    role: str,
    task_type: str,
    request_status: str,
    blocked_reason: str | None = None,
    selected_flow: str | None = None,
    tools_used: list[str] | None = None,
) -> None:
    """Write a structured audit entry to the console. Query content is never logged."""
    entry: dict[str, Any] = {
        "user_id": user_id,
        "role": role,
        "task_type": task_type,
        "request_status": request_status,
    }

    if blocked_reason is not None:
        entry["blocked_reason"] = blocked_reason
    if selected_flow is not None:
        entry["selected_flow"] = selected_flow
    if tools_used is not None:
        entry["tools_used"] = tools_used

    logger.info("AUDIT %s", entry)
