import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from database import get_database
from agent.tools.booking import create_booking as tool_create_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])
IN_MEMORY_BOOKINGS = []

@router.get("")
def list_bookings():
    db = get_database()
    if db is not None:
        try:
            return list(db["bookings"].find({}, {"_id": 0}))
        except Exception:
            pass
    return IN_MEMORY_BOOKINGS

@router.post("")
def create_booking(booking_req: dict):
    user_id = booking_req.get("user_id", "usr_demo")
    vehicle_id = booking_req.get("vehicle_id")
    
    if not vehicle_id:
        raise HTTPException(status_code=400, detail="vehicle_id is required")

    result = tool_create_booking(user_id, vehicle_id, booking_req)
    if "booking" in result:
        IN_MEMORY_BOOKINGS.append(result["booking"])
    return result

@router.get("/{booking_id}")
def get_booking(booking_id: str):
    db = get_database()
    if db is not None:
        b = db["bookings"].find_one({"id": booking_id}, {"_id": 0})
        if b:
            return b
    for b in IN_MEMORY_BOOKINGS:
        if b["id"] == booking_id:
            return b
    raise HTTPException(status_code=404, detail="Booking not found")

@router.delete("/{booking_id}")
def cancel_booking(booking_id: str):
    db = get_database()
    if db is not None:
        db["bookings"].update_one({"id": booking_id}, {"$set": {"status": "Cancelled"}})
    
    for b in IN_MEMORY_BOOKINGS:
        if b["id"] == booking_id:
            b["status"] = "Cancelled"
            break

    return {"message": f"Booking {booking_id} has been cancelled."}
