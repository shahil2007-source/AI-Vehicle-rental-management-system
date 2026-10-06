from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from database import get_db
from models import VehicleCreateUpdate
import uuid

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.get("")
def get_vehicles(
    type: Optional[str] = None,
    fuel: Optional[str] = None,
    seats: Optional[int] = None,
    brand: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    available_only: Optional[bool] = None,
    sort_by: Optional[str] = None # price_low, price_high, rating
):
    db = get_db()
    query = {}
    if available_only is True:
        query["available"] = True
    elif available_only is False:
        pass # Show both available and unavailable
        
    if type and type.strip() and type.strip().lower() != "all":
        # Match normalized vehicle type (e.g. SUV / MUV)
        query["type"] = {"$regex": f"^{type.strip()}$"}
    if fuel and fuel.strip() and fuel.strip().lower() != "all":
        query["fuelType"] = {"$regex": f"^{fuel.strip()}$"}
    if brand and brand.strip() and brand.strip().lower() != "all":
        query["brand"] = {"$regex": f"^{brand.strip()}$"}
    if location and location.strip() and location.strip().lower() != "all":
        query["location"] = {"$regex": f"^{location.strip()}$"}
    if seats is not None and seats > 0:
        query["seats"] = {"$gte": seats}

    vehicles = db.get_collection("vehicles").find(query)

    # Post-filtering for price & rating
    filtered = []
    for v in vehicles:
        price = float(v.get("pricePerDay", 0))
        rating = float(v.get("rating", 0))
        if min_price is not None and price < min_price:
            continue
        if max_price is not None and price > max_price:
            continue
        if min_rating is not None and rating < min_rating:
            continue
        filtered.append(v)

    # Sorting
    if sort_by == "price_low":
        filtered.sort(key=lambda x: float(x.get("pricePerDay", 0)))
    elif sort_by == "price_high":
        filtered.sort(key=lambda x: float(x.get("pricePerDay", 0)), reverse=True)
    elif sort_by == "rating":
        filtered.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)

    return filtered

@router.get("/{vehicle_id}")
def get_vehicle_by_id(vehicle_id: str):
    db = get_db()
    v = db.get_collection("vehicles").find_one({"_id": vehicle_id})
    if not v:
        v = db.get_collection("vehicles").find_one({"vehicleId": vehicle_id})
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v

@router.post("")
def create_vehicle(data: VehicleCreateUpdate):
    db = get_db()
    new_id = str(uuid.uuid4())
    import random
    v_id = f"VRM-VEH-{random.randint(100, 999)}"
    doc = {
        "_id": new_id,
        "vehicleId": v_id,
        **data.dict()
    }
    db.get_collection("vehicles").insert_one(doc)
    return doc

@router.put("/{vehicle_id}")
def update_vehicle(vehicle_id: str, data: VehicleCreateUpdate):
    db = get_db()
    success = db.get_collection("vehicles").update_one({"_id": vehicle_id}, {"$set": data.dict()})
    if not success:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle updated successfully"}

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str):
    db = get_db()
    success = db.get_collection("vehicles").delete_one({"_id": vehicle_id})
    if not success:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}
