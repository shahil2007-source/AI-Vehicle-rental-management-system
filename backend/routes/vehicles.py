from fastapi import APIRouter
from typing import List, Optional

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

# Sample initial fleet data for stage 1
INITIAL_VEHICLES = [
    {
        "id": "veh_1",
        "brand": "Mahindra",
        "model": "XUV700",
        "category": "SUV",
        "vehicle_type": "7-Seater Premium SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 3500.0,
        "price_per_km": 15.0,
        "rating": 4.9,
        "comfort_level": "Luxury",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
        "description": "Premium 7-seater SUV equipped with ADAS, panoramic sunroof, and AWD.",
        "features": ["Sunroof", "ADAS", "Ventilated Seats", "AWD", "Wireless Carplay"]
    },
    {
        "id": "veh_2",
        "brand": "Toyota",
        "model": "Innova Crysta",
        "category": "MUV",
        "vehicle_type": "7-Seater Executive MUV",
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "seats": 7,
        "price_per_day": 3200.0,
        "price_per_km": 14.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Mumbai",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
        "description": "Legendary long-distance comfortable MPV with unmatched reliability.",
        "features": ["Captain Seats", "Rear AC Vents", "Cruise Control", "Large Boot"]
    },
    {
        "id": "veh_3",
        "brand": "Tata",
        "model": "Nexon EV",
        "category": "SUV",
        "vehicle_type": "5-Seater Electric Compact SUV",
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2200.0,
        "price_per_km": 8.0,
        "rating": 4.7,
        "comfort_level": "High",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop",
        "description": "Eco-friendly EV SUV with 465km range, fast charging, and silent drive.",
        "features": ["EV Fast Charging", "Sunroof", "JBL Sound System", "Zero Emissions"]
    }
]

@router.get("")
def list_vehicles(category: Optional[str] = None):
    if category:
        filtered = [v for v in INITIAL_VEHICLES if v["category"].lower() == category.lower()]
        return filtered
    return INITIAL_VEHICLES

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    for v in INITIAL_VEHICLES:
        if v["id"] == vehicle_id:
            return v
    return {"error": "Vehicle not found"}
