from fastapi import APIRouter

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("")
def list_bookings():
    return []

@router.post("")
def create_booking(booking_data: dict):
    return {"message": "Booking route initialized for stage 1", "booking": booking_data}

@router.get("/{booking_id}")
def get_booking(booking_id: str):
    return {"id": booking_id, "status": "Confirmed"}

@router.delete("/{booking_id}")
def cancel_booking(booking_id: str):
    return {"message": f"Booking {booking_id} cancelled"}
