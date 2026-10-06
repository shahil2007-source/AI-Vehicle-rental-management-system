from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard-stats")
def get_dashboard_stats():
    return {
        "total_vehicles": 15,
        "available_vehicles": 12,
        "booked_vehicles": 3,
        "total_bookings": 28,
        "revenue": 142500,
        "ai_recommendations_generated": 64
    }

@router.get("/agent-logs")
def get_agent_logs():
    return []
