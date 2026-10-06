from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI Agent"])

@router.post("/recommend")
def recommend_vehicle(request_data: dict):
    # Stage 1 placeholder endpoint structure
    return {
        "status": "stage_1_initialized",
        "message": "AI Agent endpoint ready for Stage 2 implementation."
    }

@router.post("/chat")
def chat_agent(chat_data: dict):
    return {
        "status": "stage_1_initialized",
        "response": "AI Agent chat route ready."
    }
