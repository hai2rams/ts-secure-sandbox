from dataclasses import dataclass

from app.models.agent_run import AllowedRole, AllowedTaskType


@dataclass(frozen=True)
class Tool:
    name: str
    description: str
    allowed_roles: frozenset[AllowedRole]
    supported_task_types: frozenset[AllowedTaskType]


TOOLS: list[Tool] = [
    Tool(
        name="calculator_tool",
        description="Performs basic math calculations for tutoring sessions.",
        allowed_roles=frozenset({"student", "teacher", "admin"}),
        supported_task_types=frozenset({"tutor"}),
    ),
    Tool(
        name="tutor_feedback_tool",
        description="Generates structured feedback for student tutoring responses.",
        allowed_roles=frozenset({"teacher", "admin"}),
        supported_task_types=frozenset({"tutor"}),
    ),
    Tool(
        name="document_search_tool",
        description="Searches indexed documents and returns matching files.",
        allowed_roles=frozenset({"teacher", "admin"}),
        supported_task_types=frozenset({"document_search"}),
    ),
]


def get_allowed_tools(role: AllowedRole, task_type: AllowedTaskType) -> list[str]:
    """Return tool names the given role may use for the requested task_type."""
    return [
        tool.name
        for tool in TOOLS
        if role in tool.allowed_roles and task_type in tool.supported_task_types
    ]
