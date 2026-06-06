from app.models.agent_run import AllowedTaskType


def generate_response(prompt: str, task_type: AllowedTaskType) -> str:
    """
    Mock LLM adapter.

    Replace this implementation later with OpenAI, Bedrock, Anthropic, or a local model.
    """
    if task_type == "tutor":
        return (
            f"LLM mock (tutor): Step-by-step explanation for '{prompt}'."
        )

    if task_type == "summary":
        return (
            f"LLM mock (summary): Key points from '{prompt}' — "
            "point one, point two, point three."
        )

    raise ValueError(f"task_type '{task_type}' is not supported by the LLM adapter")
