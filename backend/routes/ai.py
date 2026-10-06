from fastapi import APIRouter, HTTPException
from agent.agent import agent_instance

router = APIRouter(prefix="/ai", tags=["AI Agent"])

@router.post("/recommend")
def recommend_vehicle(requirements: dict):
    """
    AI Agent endpoint receiving user trip requirements,
    invoking the 6-tool workflow and Gemini LLM.
    """
    if not requirements:
        raise HTTPException(status_code=400, detail="Trip requirements are required")

    result = agent_instance.run_agent_workflow(requirements)
    return result

@router.post("/chat")
def chat_agent(chat_payload: dict):
    """
    Interactive AI Agent chat support endpoint.
    """
    message = chat_payload.get("message", "")
    response = (
        f"I am the AI Vehicle Rental Agent. I can analyze your travel needs, "
        f"calculate deterministic vehicle compatibility scores across 8 factors, "
        f"estimate exact rental costs, and reserve your vehicle automatically!"
    )
    return {"reply": response, "agent": agent_instance.agent_name}
