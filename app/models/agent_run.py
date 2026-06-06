from typing import Literal

from pydantic import BaseModel, Field, field_validator

AllowedRole = Literal["student", "teacher", "admin"]
AllowedTaskType = Literal["tutor", "summary", "document_search"]


class AgentRunRequest(BaseModel):
    user_id: str
    role: AllowedRole
    query: str = Field(..., max_length=1000)
    task_type: AllowedTaskType

    @field_validator("query")
    @classmethod
    def query_must_not_be_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("query must not be empty")
        return stripped


class AgentRunResponse(BaseModel):
    status: str
    task_type: AllowedTaskType
    selected_flow: str
    answer: str
    tools_used: list[str]
