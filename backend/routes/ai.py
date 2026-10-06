from fastapi import APIRouter
from database import get_db
from models import RecommendationRequest, ChatRequest
from agent.agent import AIVehicleRentalAgent
from agent.chat_agent import AIVehicleChatAssistant

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])

@router.post("/recommend")
def find_recommendation(req: RecommendationRequest):
    db = get_db()
    agent = AIVehicleRentalAgent(db)
    result = agent.run_recommendation_pipeline(req.dict())
    return result

@router.post("/chat")
def ask_ai_chat(req: ChatRequest):
    db = get_db()
    chat_assistant = AIVehicleChatAssistant(db)
    reply = chat_assistant.chat(user_message=req.message, selected_vehicle_id=req.selectedVehicleId)
    return {"reply": reply}
