from app.llm.llm_client import generate_response
from app.models.agent_run import AgentRunRequest, AgentRunResponse
from app.tools.tool_registry import get_allowed_tools


def run_agent(request: AgentRunRequest) -> AgentRunResponse:
    """Route the validated request to the correct mock flow based on task_type."""
    tools_used = get_allowed_tools(request.role, request.task_type)

    if request.task_type == "tutor":
        return AgentRunResponse(
            status="completed",
            task_type="tutor",
            selected_flow="tutor_flow",
            answer=generate_response(request.query, "tutor"),
            tools_used=tools_used,
        )

    if request.task_type == "summary":
        return AgentRunResponse(
            status="completed",
            task_type="summary",
            selected_flow="summary_flow",
            answer=generate_response(request.query, "summary"),
            tools_used=tools_used,
        )

    # document_search stays as a mock tool response (no LLM call)
    return AgentRunResponse(
        status="completed",
        task_type="document_search",
        selected_flow="document_search_flow",
        answer=(
            f"Document search mock: Found 2 matching documents for "
            f"'{request.query}' — doc_a.pdf, doc_b.pdf."
        ),
        tools_used=tools_used,
    )
