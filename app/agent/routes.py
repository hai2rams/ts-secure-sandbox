from fastapi import APIRouter, Depends

from app.auth.auth_service import require_api_key
from app.agent.orchestrator import run_agent as orchestrate
from app.agent.policy import check_permission
from app.guardrails.input_guard import check_input_guardrails
from app.models.agent_run import AgentRunRequest, AgentRunResponse
from app.observability.audit_logger import log_agent_run

router = APIRouter()


@router.get("/")
def agent_placeholder() -> dict[str, str]:
    """Placeholder route — agent logic will be added later."""
    return {"message": "Agent module ready"}


@router.post("/run", response_model=AgentRunResponse)
def run_agent(
    request: AgentRunRequest,
    _api_key: str = Depends(require_api_key),
) -> AgentRunResponse:
    """Validate the request, check permissions and guardrails, then orchestrate."""
    check_permission(request.role, request.task_type, request.user_id)
    check_input_guardrails(request.query, request.user_id, request.role, request.task_type)
    response = orchestrate(request)
    log_agent_run(
        user_id=request.user_id,
        role=request.role,
        task_type=request.task_type,
        request_status="success",
        selected_flow=response.selected_flow,
        tools_used=response.tools_used,
    )
    return response
