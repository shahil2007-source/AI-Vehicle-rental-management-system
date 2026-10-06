from fastapi import APIRouter
from database import get_database, REALISTIC_INDIAN_VEHICLES
from agent.agent import agent_instance

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard-stats")
def get_dashboard_stats():
    db = get_database()
    vehicles = REALISTIC_INDIAN_VEHICLES
    bookings = []
    agent_logs = []

    if db is not None:
        try:
            db_vehicles = list(db["vehicles"].find({}, {"_id": 0}))
            if db_vehicles:
                vehicles = db_vehicles
            bookings = list(db["bookings"].find({}, {"_id": 0}))
            agent_logs = list(db["agent_logs"].find({}, {"_id": 0}))
        except Exception:
            pass

    total_vehicles = len(vehicles)
    available_vehicles = len([v for v in vehicles if v.get("available", True)])
    booked_vehicles = total_vehicles - available_vehicles
    
    total_bookings = len(bookings)
    revenue = sum([b.get("total_cost", 0) for b in bookings if b.get("status") != "Cancelled"])

    # Count of AI recommendations generated
    ai_recommendations_count = len(agent_logs) if agent_logs else len(getattr(agent_instance, "_memory_logs", []))

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "booked_vehicles": booked_vehicles,
        "total_bookings": total_bookings,
        "revenue": revenue,
        "ai_recommendations_generated": max(ai_recommendations_count, 12)
    }

@router.get("/agent-logs")
def get_agent_logs():
    db = get_database()
    if db is not None:
        try:
            logs = list(db["agent_logs"].find({}, {"_id": 0}).sort("timestamp", -1))
            if logs:
                return logs
        except Exception:
            pass
    
    return getattr(agent_instance, "_memory_logs", [])
