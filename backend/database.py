import logging
import os
from pymongo import MongoClient
from config import settings

logger = logging.getLogger("uvicorn.error")

_client = None
_db = None

# Realistic Indian rental vehicles dataset
REALISTIC_INDIAN_VEHICLES = [
    {
        "id": "veh_innova_crysta",
        "brand": "Toyota",
        "model": "Innova Crysta",
        "category": "MUV",
        "vehicle_type": "7-Seater Executive MUV",
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "seats": 7,
        "price_per_day": 3400.0,
        "price_per_km": 15.0,
        "rating": 4.9,
        "comfort_level": "High",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
        "description": "Legendary long-distance highway cruiser with supreme rear captain seat comfort and proven reliability.",
        "features": ["Captain Seats", "Dual AC Vents", "Cruise Control", "7 Airbags", "Large Luggage Space"]
    },
    {
        "id": "veh_fortuner",
        "brand": "Toyota",
        "model": "Fortuner 4x4",
        "category": "SUV",
        "vehicle_type": "7-Seater Premium SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 5200.0,
        "price_per_km": 20.0,
        "rating": 4.9,
        "comfort_level": "Luxury",
        "location": "Mumbai",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
        "description": "Dominant full-size 4x4 SUV built for tough road trips, mountain terrain, and VIP travel.",
        "features": ["4x4 Low-Range", "JBL 11-Speaker System", "Ventilated Seats", "Power Tailgate"]
    },
    {
        "id": "veh_kia_carens",
        "brand": "Kia",
        "model": "Carens Luxury Plus",
        "category": "MUV",
        "vehicle_type": "7-Seater Family MUV",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 2600.0,
        "price_per_km": 12.0,
        "rating": 4.7,
        "comfort_level": "High",
        "location": "Delhi NCR",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
        "description": "Modern family vehicle featuring one-touch electric tumble seats, ambient lighting, and smart cabin air purifier.",
        "features": ["One-Touch Tumble Seats", "Bose Audio", "Air Purifier", "Sunroof", "Wireless Charger"]
    },
    {
        "id": "veh_kia_seltos",
        "brand": "Kia",
        "model": "Seltos GTX+",
        "category": "SUV",
        "vehicle_type": "5-Seater Compact SUV",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2400.0,
        "price_per_km": 11.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Hyderabad",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop",
        "description": "Stylish 5-seater SUV packed with dual 10.25-inch panoramic screens, ADAS Level 2, and ventilated seats.",
        "features": ["Panoramic Sunroof", "Level 2 ADAS", "Heads-Up Display", "360-Degree Camera"]
    },
    {
        "id": "veh_creta",
        "brand": "Hyundai",
        "model": "Creta SX(O)",
        "category": "SUV",
        "vehicle_type": "5-Seater Premium SUV",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2300.0,
        "price_per_km": 11.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop",
        "description": "India's favorite compact SUV offering panoramic sunroof, smooth CVT automatic, and high city mileage.",
        "features": ["Voice Panoramic Sunroof", "Bose Premium Sound", "Drive Modes", "Bluelink Connected Car"]
    },
    {
        "id": "veh_alcazar",
        "brand": "Hyundai",
        "model": "Alcazar Signature",
        "category": "SUV",
        "vehicle_type": "7-Seater Executive SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 3100.0,
        "price_per_km": 14.0,
        "rating": 4.7,
        "comfort_level": "High",
        "location": "Chennai",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop",
        "description": "Premium 7-seater SUV with second-row captain seats, wireless phone chargers for all rows, and fuel efficiency.",
        "features": ["2nd Row Captain Seats", "Rear Seat Tables", "Blind View Monitor", "Digital Cluster"]
    },
    {
        "id": "veh_harrier",
        "brand": "Tata",
        "model": "Harrier Fearless",
        "category": "SUV",
        "vehicle_type": "5-Seater Heavy SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2800.0,
        "price_per_km": 13.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Pune",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
        "description": "Bold Land-Rover derived OmegaArc platform SUV delivering unmatched highway stability and 5-star GNCAP safety.",
        "features": ["5-Star Safety Rating", "JBL 10-Speaker Audio", "Terrain Response Modes", "Gesture Tailgate"]
    },
    {
        "id": "veh_nexon",
        "brand": "Tata",
        "model": "Nexon Creative",
        "category": "SUV",
        "vehicle_type": "5-Seater Compact SUV",
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "seats": 5,
        "price_per_day": 1800.0,
        "price_per_km": 9.0,
        "rating": 4.6,
        "comfort_level": "Standard",
        "location": "Ahmedabad",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop",
        "description": "Robust compact SUV engineered for daily city commutes and weekend getaways with 5-star crash protection.",
        "features": ["5-Star GNCAP Safety", "Touchscreen Infotainment", "High Ground Clearance", "Rear Camera"]
    },
    {
        "id": "veh_nexon_ev",
        "brand": "Tata",
        "model": "Nexon EV Empowered+",
        "category": "SUV",
        "vehicle_type": "5-Seater Electric SUV",
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2500.0,
        "price_per_km": 6.0,
        "rating": 4.9,
        "comfort_level": "High",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop",
        "description": "Zero-emission electric SUV offering 465 km range, instant torque acceleration, V2L vehicle charging capability.",
        "features": ["465km EV Range", "V2L Charging", "Silent Drive", "Regen Braking", "12.3-inch Cinema Touchscreen"]
    },
    {
        "id": "veh_xuv700",
        "brand": "Mahindra",
        "model": "XUV700 AX7L",
        "category": "SUV",
        "vehicle_type": "7-Seater Luxury SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 3600.0,
        "price_per_km": 16.0,
        "rating": 4.9,
        "comfort_level": "Luxury",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
        "description": "Flagship 200 PS turbo SUV with dual 10.25-inch screens, Sony 3D 12-speaker audio, ADAS Level 2 and AWD.",
        "features": ["ADAS Level 2", "Sony 3D Spatial Audio", "Panoramic Skyroof", "Smart Door Handles", "AWD"]
    },
    {
        "id": "veh_scorpio_n",
        "brand": "Mahindra",
        "model": "Scorpio-N Z8L",
        "category": "SUV",
        "vehicle_type": "7-Seater Rugged SUV",
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "price_per_day": 3300.0,
        "price_per_km": 15.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Delhi NCR",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
        "description": "The Big Daddy of SUVs with body-on-frame toughness, 4XPLOR terrain management system, and high seating stance.",
        "features": ["4XPLOR Terrain System", "Sony Audio", "High Seating Position", "Dual Zone Climate Control"]
    },
    {
        "id": "veh_mg_hector",
        "brand": "MG",
        "model": "Hector Sharp Pro",
        "category": "SUV",
        "vehicle_type": "5-Seater Tech SUV",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2600.0,
        "price_per_km": 12.0,
        "rating": 4.7,
        "comfort_level": "High",
        "location": "Kolkata",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop",
        "description": "Internet-enabled SUV featuring massive 14-inch HD portrait touchscreen, autonomous driving tech, and plush leather interior.",
        "features": ["14-inch HD Portrait Screen", "Autonomous Level 2", "Dual Pane Sunroof", "i-SMART Connectivity"]
    },
    {
        "id": "veh_swift",
        "brand": "Maruti",
        "model": "Swift ZXi+",
        "category": "Hatchback",
        "vehicle_type": "5-Seater Economy Hatchback",
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "seats": 5,
        "price_per_day": 1400.0,
        "price_per_km": 7.0,
        "rating": 4.6,
        "comfort_level": "Standard",
        "location": "Hyderabad",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop",
        "description": "Highly economical 5-seater hatchback with 25 km/l mileage, agile handling, and effortless city parking.",
        "features": ["High Fuel Economy (25 km/l)", "SmartPlay Touchscreen", "Keyless Entry", "Compact Parking"]
    },
    {
        "id": "veh_honda_city",
        "brand": "Honda",
        "model": "City ZX",
        "category": "Sedan",
        "vehicle_type": "5-Seater Comfort Sedan",
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 2400.0,
        "price_per_km": 10.0,
        "rating": 4.8,
        "comfort_level": "High",
        "location": "Bengaluru",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop",
        "description": "The benchmark executive sedan with smooth i-VTEC engine, Honda Sensing ADAS, and unmatched legroom.",
        "features": ["Honda Sensing ADAS", "Full LED Headlamps", "LaneWatch Camera", "Supremely Cushioned Seats"]
    },
    {
        "id": "veh_camry",
        "brand": "Toyota",
        "model": "Camry Hybrid Elegance",
        "category": "Sedan",
        "vehicle_type": "5-Seater Luxury Hybrid Sedan",
        "fuel_type": "Hybrid",
        "transmission": "Automatic",
        "seats": 5,
        "price_per_day": 4800.0,
        "price_per_km": 18.0,
        "rating": 4.9,
        "comfort_level": "Luxury",
        "location": "Mumbai",
        "available": True,
        "image_url": "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&auto=format&fit=crop",
        "description": "Ultra-quiet self-charging hybrid sedan with power recline rear seats, 9-speaker JBL audio, and VIP chauffeur luxury.",
        "features": ["Self-Charging Hybrid", "Power Recline Rear Seats", "3-Zone Climate Control", "JBL 9-Speaker Audio"]
    }
]

def get_database():
    """Returns PyMongo Database instance."""
    global _client, _db
    if _db is not None:
        return _db
    
    try:
        uri = settings.MONGODB_URI
        _client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        _client.admin.command('ping')
        _db = _client.get_default_database(default="vehicle_rental")
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Operating with in-memory dataset fallback.")
        _db = None
    return _db

def check_db_health() -> dict:
    """Check connection status for /api/health endpoint."""
    try:
        db = get_database()
        if db is not None and _client is not None:
            _client.admin.command('ping')
            return {"connected": True, "type": "MongoDB Atlas"}
    except Exception as e:
        return {"connected": False, "error": str(e)}
    
    return {"connected": True, "type": "InMemory Engine (Fallback Active)"}
