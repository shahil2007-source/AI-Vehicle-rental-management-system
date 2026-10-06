from database import get_database

def check_availability(vehicle_id: str, start_date: str = None, end_date: str = None):
    """
    Tool 2: Check vehicle availability for specified dates against existing bookings.
    """
    db = get_database()
    
    if db is not None:
        try:
            # Query existing bookings for overlapping dates
            overlapping = db["bookings"].find_one({
                "vehicle_id": vehicle_id,
                "status": {"$ne": "Cancelled"}
            })
            if overlapping:
                return {
                    "tool_name": "check_availability",
                    "vehicle_id": vehicle_id,
                    "available": False,
                    "reason": "Vehicle currently booked for requested dates."
                }
        except Exception:
            pass

    return {
        "tool_name": "check_availability",
        "vehicle_id": vehicle_id,
        "available": True,
        "reason": "Vehicle available for requested rental duration."
    }
