import uuid
from datetime import datetime
from database import get_database

def create_booking(user_id: str, vehicle_id: str, booking_details: dict):
    """
    Tool 6: Execute direct persistent booking reservation in MongoDB.
    """
    db = get_database()
    
    booking_doc = {
        "id": f"bk_{uuid.uuid4().hex[:8]}",
        "user_id": user_id,
        "vehicle_id": vehicle_id,
        "start_date": booking_details.get("start_date", datetime.utcnow().strftime("%Y-%m-%d")),
        "end_date": booking_details.get("end_date", datetime.utcnow().strftime("%Y-%m-%d")),
        "rental_days": int(booking_details.get("rental_days", 1)),
        "estimated_distance_km": float(booking_details.get("estimated_distance_km", 100)),
        "total_cost": float(booking_details.get("total_cost", 0.0)),
        "status": "Confirmed",
        "created_at": datetime.utcnow().isoformat()
    }
    
    if db is not None:
        try:
            db["bookings"].insert_one(booking_doc.copy())
        except Exception:
            pass

    return {
        "tool_name": "create_booking",
        "status": "Confirmed",
        "booking_id": booking_doc["id"],
        "booking": booking_doc
    }
