from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from models import BookingRequest
from agent.tools import budget_calculator_tool, create_booking_tool, availability_tool
from datetime import datetime

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("")
def create_new_booking(req: BookingRequest):
    db = get_db()
    
    # 1. Fetch vehicle details
    vehicle = db.get_collection("vehicles").find_one({"_id": req.vehicleId})
    if not vehicle:
        vehicle = db.get_collection("vehicles").find_one({"vehicleId": req.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Selected vehicle not found")

    # 2. Check availability
    avail = availability_tool(db, vehicle["_id"], req.pickupDate, req.returnDate)
    if not avail["isAvailable"]:
        raise HTTPException(
            status_code=400,
            detail=f"Vehicle is not available for requested dates ({req.pickupDate} to {req.returnDate}). Conflicting booking: {avail.get('conflictingBooking')}"
        )

    # 3. Calculate rental duration and price breakdown via Budget Calculator Tool
    try:
        d1 = datetime.strptime(req.pickupDate, "%Y-%m-%d")
        d2 = datetime.strptime(req.returnDate, "%Y-%m-%d")
        duration_days = max(1, (d2 - d1).days)
    except Exception:
        duration_days = 1

    cost = budget_calculator_tool(vehicle.get("pricePerDay", 3000), duration_days)

    # 4. Construct booking payload
    booking_payload = {
        "customerName": req.customerName,
        "customerEmail": req.customerEmail,
        "customerPhone": req.customerPhone,
        "licenseNumber": req.licenseNumber,
        "vehicleId": vehicle["_id"],
        "vehicleName": f"{vehicle.get('brand')} {vehicle.get('model')}",
        "vehicleImage": vehicle.get("image"),
        "pickupLocation": req.pickupLocation,
        "dropLocation": req.dropLocation,
        "pickupDate": req.pickupDate,
        "returnDate": req.returnDate,
        "passengers": req.passengers,
        "baseCost": cost["baseCost"],
        "insurance": cost["insurance"],
        "tax": cost["tax"],
        "additionalCharges": cost["additionalCharges"],
        "totalAmount": cost["totalAmount"]
    }

    # 5. Persist via Booking Tool
    created = create_booking_tool(db, booking_payload)
    return created

@router.get("")
def get_all_bookings(email: str = None):
    db = get_db()
    if email:
        return db.get_collection("bookings").find({"customerEmail": email})
    return db.get_collection("bookings").find()

@router.get("/{booking_id}")
def get_booking_by_id(booking_id: str):
    db = get_db()
    b = db.get_collection("bookings").find_one({"_id": booking_id})
    if not b:
        b = db.get_collection("bookings").find_one({"bookingId": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b

@router.put("/{booking_id}/status")
def update_booking_status(booking_id: str, status: str):
    db = get_db()
    valid_statuses = ["Confirmed", "Active", "Completed", "Cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
    
    success = db.get_collection("bookings").update_one(
        {"bookingId": booking_id},
        {"$set": {"status": status}}
    )
    if not success:
        success = db.get_collection("bookings").update_one(
            {"_id": booking_id},
            {"$set": {"status": status}}
        )
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": f"Booking status updated to {status}"}
