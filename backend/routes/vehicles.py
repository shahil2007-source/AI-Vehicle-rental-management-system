from fastapi import APIRouter, HTTPException
from typing import List, Optional
from database import REALISTIC_INDIAN_VEHICLES, get_database
from models.vehicle import VehicleCreate, VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

def _get_all_vehicles():
    db = get_database()
    if db is not None:
        try:
            db_vehicles = list(db["vehicles"].find({}, {"_id": 0}))
            if db_vehicles and len(db_vehicles) > 0:
                return db_vehicles
        except Exception:
            pass
    return REALISTIC_INDIAN_VEHICLES

@router.get("", response_model=List[dict])
def list_vehicles(
    category: Optional[str] = None,
    fuel_type: Optional[str] = None,
    seats: Optional[int] = None,
    search: Optional[str] = None
):
    vehicles = _get_all_vehicles()
    
    filtered = vehicles
    if category and category != "All":
        filtered = [v for v in filtered if v.get("category", "").lower() == category.lower()]
    
    if fuel_type and fuel_type != "All":
        filtered = [v for v in filtered if v.get("fuel_type", "").lower() == fuel_type.lower()]

    if seats:
        filtered = [v for v in filtered if v.get("seats", 0) >= seats]

    if search:
        s = search.lower()
        filtered = [
            v for v in filtered 
            if s in v.get("brand", "").lower() 
            or s in v.get("model", "").lower() 
            or s in v.get("category", "").lower()
        ]

    return filtered

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    vehicles = _get_all_vehicles()
    for v in vehicles:
        if v["id"] == vehicle_id:
            return v
    raise HTTPException(status_code=404, detail="Vehicle not found")

@router.post("")
def create_vehicle(vehicle: VehicleCreate):
    db = get_database()
    v_dict = vehicle.dict()
    v_dict["id"] = f"veh_{v_dict['brand'].lower()}_{v_dict['model'].lower().replace(' ', '_')}"
    
    if db is not None:
        db["vehicles"].insert_one(v_dict.copy())
    else:
        REALISTIC_INDIAN_VEHICLES.append(v_dict)
    
    return v_dict

@router.put("/{vehicle_id}")
def update_vehicle(vehicle_id: str, vehicle: VehicleCreate):
    db = get_database()
    v_dict = vehicle.dict()
    v_dict["id"] = vehicle_id
    
    if db is not None:
        db["vehicles"].update_one({"id": vehicle_id}, {"$set": v_dict})
    else:
        for idx, v in enumerate(REALISTIC_INDIAN_VEHICLES):
            if v["id"] == vehicle_id:
                REALISTIC_INDIAN_VEHICLES[idx] = v_dict
                break
    return v_dict

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str):
    db = get_database()
    if db is not None:
        db["vehicles"].delete_one({"id": vehicle_id})
    else:
        global REALISTIC_INDIAN_VEHICLES
        REALISTIC_INDIAN_VEHICLES = [v for v in REALISTIC_INDIAN_VEHICLES if v["id"] != vehicle_id]
    return {"message": f"Vehicle {vehicle_id} deleted successfully"}
