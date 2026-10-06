import json
import os
import uuid
from datetime import datetime
from config import MONGODB_URI

# Ensure data directory exists
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
try:
    os.makedirs(DATA_DIR, exist_ok=True)
except Exception:
    pass
DB_FILE = os.path.join(DATA_DIR, "db.json")

SEED_VEHICLES = [
    {
        "_id": "v1",
        "vehicleId": "VRM-VEH-001",
        "brand": "Toyota",
        "model": "Innova Crysta",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Manual",
        "seats": 7,
        "luggageCapacity": 4,
        "mileage": "14 km/l",
        "pricePerDay": 3500,
        "securityDeposit": 5000,
        "location": "Hyderabad",
        "rating": 4.9,
        "features": ["Captain Seats", "Rear AC Vents", "Touchscreen Infotainment", "7 Airbags", "Cruise Control"],
        "image": "/images/vehicles/innova-crysta.jpg",
        "available": True,
        "status": "available",
        "description": "The benchmark for premium family comfort and long-distance travel. Roomy 7-seater layout with powerful diesel engine."
    },
    {
        "_id": "v2",
        "vehicleId": "VRM-VEH-002",
        "brand": "Toyota",
        "model": "Fortuner",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "luggageCapacity": 5,
        "mileage": "12 km/l",
        "pricePerDay": 5000,
        "securityDeposit": 10000,
        "location": "Bengaluru",
        "rating": 4.9,
        "features": ["4x4 Capability", "Leather Seats", "JBL Audio System", "Sunroof", "Ventilated Seats"],
        "image": "/images/vehicles/fortuner.jpg",
        "available": True,
        "status": "available",
        "description": "Dominating road presence and unmatched off-road capability. Luxury 7-seater SUV for highway cruisers and rugged road trips."
    },
    {
        "_id": "v3",
        "vehicleId": "VRM-VEH-003",
        "brand": "Kia",
        "model": "Carens",
        "type": "MUV",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 7,
        "luggageCapacity": 4,
        "mileage": "16 km/l",
        "pricePerDay": 3000,
        "securityDeposit": 4000,
        "location": "Hyderabad",
        "rating": 4.7,
        "features": ["10.25 HD Screen", "Ambient Lighting", "Bose Premium Sound", "Air Purifier", "6 Airbags"],
        "image": "/images/vehicles/carens.jpg",
        "available": True,
        "status": "available",
        "description": "Modern, sleek family mover equipped with cutting-edge tech and ultra-smooth automatic transmission."
    },
    {
        "_id": "v4",
        "vehicleId": "VRM-VEH-004",
        "brand": "Kia",
        "model": "Seltos",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 3,
        "mileage": "17.5 km/l",
        "pricePerDay": 2800,
        "securityDeposit": 3500,
        "location": "Mumbai",
        "rating": 4.8,
        "features": ["Panoramic Sunroof", "ADAM Safety", "Heads Up Display", "360 Camera", "Wireless Charger"],
        "image": "/images/vehicles/seltos.jpg",
        "available": True,
        "status": "available",
        "description": "Stylish urban compact SUV packed with safety features and comfortable 5-passenger seating."
    },
    {
        "_id": "v5",
        "vehicleId": "VRM-VEH-005",
        "brand": "Hyundai",
        "model": "Creta",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 3,
        "mileage": "18 km/l",
        "pricePerDay": 2500,
        "securityDeposit": 3000,
        "location": "Delhi",
        "rating": 4.8,
        "features": ["Panoramic Sunroof", "Bose Audio", "Electric Driver Seat", "Bluelink Connect", "Ventilated Seats"],
        "image": "/images/vehicles/creta.jpg",
        "available": True,
        "status": "available",
        "description": "India's favorite compact SUV. Superb fuel economy, refined diesel engine, and high resale/rental popularity."
    },
    {
        "_id": "v6",
        "vehicleId": "VRM-VEH-006",
        "brand": "Hyundai",
        "model": "Alcazar",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "luggageCapacity": 4,
        "mileage": "16.5 km/l",
        "pricePerDay": 3200,
        "securityDeposit": 4500,
        "location": "Hyderabad",
        "rating": 4.7,
        "features": ["Second Row Wireless Charger", "Voice Control Sunroof", "Drive Modes", "Digital Cluster"],
        "image": "/images/vehicles/alcazar.jpg",
        "available": True,
        "status": "available",
        "description": "Premium 7-seater SUV with extended wheelbase for executive legroom and versatile highway family trips."
    },
    {
        "_id": "v7",
        "vehicleId": "VRM-VEH-007",
        "brand": "Tata",
        "model": "Harrier",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 4,
        "mileage": "15 km/l",
        "pricePerDay": 2800,
        "securityDeposit": 4500,
        "location": "Mumbai",
        "rating": 4.8,
        "features": ["OMEGARC Land Rover Platform", "JBL 9 Speaker Audio", "Panoramic Sunroof", "Terrain Response"],
        "image": "/images/vehicles/harrier.jpg",
        "available": True,
        "status": "available",
        "description": "Bold, aggressive SUV derived from Land Rover's D8 platform. Outstanding high-speed highway stability."
    },
    {
        "_id": "v8",
        "vehicleId": "VRM-VEH-008",
        "brand": "Tata",
        "model": "Nexon",
        "type": "SUV",
        "fuelType": "Petrol",
        "transmission": "Manual",
        "seats": 5,
        "luggageCapacity": 2,
        "mileage": "17.5 km/l",
        "pricePerDay": 2200,
        "securityDeposit": 3000,
        "location": "Chennai",
        "rating": 4.6,
        "features": ["5-Star GNCAP Rating", "Harmon Kardon Sound", "Digital Instrument Cluster", "Drive Modes"],
        "image": "/images/vehicles/nexon.jpg",
        "available": True,
        "status": "available",
        "description": "Ultra-safe 5-star GNCAP rated compact SUV built for rugged Indian terrain and city commutes."
    },
    {
        "_id": "v9",
        "vehicleId": "VRM-VEH-009",
        "brand": "Tata",
        "model": "Nexon EV",
        "type": "SUV",
        "fuelType": "Electric",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 2,
        "mileage": "312 km range",
        "pricePerDay": 2500,
        "securityDeposit": 3500,
        "location": "Bengaluru",
        "rating": 4.9,
        "features": ["Zero Emissions", "Instant Torque", "Regen Braking", "Fast Charging Compatible", "Smart Watch App"],
        "image": "/images/vehicles/nexon-ev.jpg",
        "available": True,
        "status": "available",
        "description": "Eco-friendly electric SUV with zero tailpipe emissions, silent drive, and instant electric power response."
    },
    {
        "_id": "v10",
        "vehicleId": "VRM-VEH-010",
        "brand": "Mahindra",
        "model": "XUV700",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Automatic",
        "seats": 7,
        "luggageCapacity": 4,
        "mileage": "14.5 km/l",
        "pricePerDay": 3000,
        "securityDeposit": 5500,
        "location": "Hyderabad",
        "rating": 4.9,
        "features": ["Level 2 ADAS", "Dual 10.25 Curved Displays", "Sony 3D Sound", "Flush Door Handles", "AWD Option"],
        "image": "/images/vehicles/xuv700.jpg",
        "available": True,
        "status": "available",
        "description": "Technological masterpiece with 200 PS power, ADAS autonomous safety, and world-class luxury interior."
    },
    {
        "_id": "v11",
        "vehicleId": "VRM-VEH-011",
        "brand": "Mahindra",
        "model": "Scorpio-N",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Manual",
        "seats": 7,
        "luggageCapacity": 4,
        "mileage": "14 km/l",
        "pricePerDay": 3200,
        "securityDeposit": 5000,
        "location": "Delhi",
        "rating": 4.8,
        "features": ["Big Daddy SUV Stance", "4XPLOR Terrain Modes", "Sunroof", "Alexa Built-in", "Watt 3D Audio"],
        "image": "/images/vehicles/scorpio-n.jpg",
        "available": True,
        "status": "available",
        "description": "The 'Big Daddy of SUVs'. Frame-on-chassis muscular SUV built to conquer rough terrain and long road trips."
    },
    {
        "_id": "v12",
        "vehicleId": "VRM-VEH-012",
        "brand": "MG",
        "model": "Hector",
        "type": "SUV",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 4,
        "mileage": "14 km/l",
        "pricePerDay": 2700,
        "securityDeposit": 4000,
        "location": "Delhi",
        "rating": 4.7,
        "features": ["14-inch HD Portrait Screen", "Panoramic Sunroof", "Infinity Audio", "Powered Tailgate"],
        "image": "/images/vehicles/hector.jpg",
        "available": True,
        "status": "available",
        "description": "Internet-connected SUV with massive portrait touchscreen, lounge-like rear seat space, and soft suspension."
    },
    {
        "_id": "v13",
        "vehicleId": "VRM-VEH-013",
        "brand": "Maruti",
        "model": "Swift",
        "type": "Hatchback",
        "fuelType": "Petrol",
        "transmission": "Manual",
        "seats": 5,
        "luggageCapacity": 2,
        "mileage": "22 km/l",
        "pricePerDay": 1800,
        "securityDeposit": 2000,
        "location": "Hyderabad",
        "rating": 4.5,
        "features": ["SmartPlay Studio", "Automatic Climate Control", "Keyless Entry", "High Fuel Economy"],
        "image": "/images/vehicles/swift.jpg",
        "available": True,
        "status": "available",
        "description": "Economical city hatchback with legendary fuel efficiency, light controls, and easy parking."
    },
    {
        "_id": "v14",
        "vehicleId": "VRM-VEH-014",
        "brand": "Honda",
        "model": "City",
        "type": "Sedan",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 4,
        "mileage": "18.4 km/l",
        "pricePerDay": 2200,
        "securityDeposit": 3000,
        "location": "Bengaluru",
        "rating": 4.8,
        "features": ["Honda Sensing ADAS", "506L Boot Space", "Sunroof", "LaneWatch Camera", "Leatherette Upholstery"],
        "image": "/images/vehicles/honda-city.jpg",
        "available": True,
        "status": "available",
        "description": "The quintessential executive sedan with plush ride comfort, huge 506-liter boot, and smooth i-VTEC engine."
    },
    {
        "_id": "v15",
        "vehicleId": "VRM-VEH-015",
        "brand": "Toyota",
        "model": "Camry",
        "type": "Sedan",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 4,
        "mileage": "19.1 km/l",
        "pricePerDay": 4500,
        "securityDeposit": 7000,
        "location": "Mumbai",
        "rating": 4.9,
        "features": ["Hybrid Electric Powertrain", "Reclining Rear Seats", "JBL 9 Speaker Audio", "3-Zone Climate Control"],
        "image": "/images/vehicles/camry.jpg",
        "available": True,
        "status": "available",
        "description": "Luxury hybrid sedan delivering supreme executive comfort, whisper-quiet cabin, and smooth power."
    },
    {
        "_id": "v16",
        "vehicleId": "VRM-VEH-016",
        "brand": "Mahindra",
        "model": "Thar 4x4",
        "type": "SUV",
        "fuelType": "Diesel",
        "transmission": "Manual",
        "seats": 4,
        "luggageCapacity": 2,
        "mileage": "13 km/l",
        "pricePerDay": 3500,
        "securityDeposit": 6000,
        "location": "Hyderabad",
        "rating": 4.9,
        "features": ["4x4 Low-Ratio Transfer Case", "Convertible Top", "Touchscreen Infotainment", "All-Terrain Tyres", "Off-Road Suspension"],
        "image": "/images/vehicles/thar.jpg",
        "available": True,
        "status": "available",
        "description": "Iconic 4x4 off-road SUV built for rugged terrain, beach runs, and mountain adventures."
    },
    {
        "_id": "v17",
        "vehicleId": "VRM-VEH-017",
        "brand": "Mercedes-Benz",
        "model": "G-Class G 63 AMG",
        "type": "SUV",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 4,
        "mileage": "8.5 km/l",
        "pricePerDay": 18000,
        "securityDeposit": 25000,
        "location": "Mumbai",
        "rating": 5.0,
        "features": ["V8 Biturbo Engine", "Burmester 3D Surround Sound", "Designo Nappa Leather", "AMG Ride Control", "Massaging Seats"],
        "image": "/images/vehicles/g-class.jpg",
        "available": True,
        "status": "available",
        "description": "The ultimate luxury performance SUV. Unmatched road presence, handcrafted V8 AMG power, and VIP interior."
    },
    {
        "_id": "v18",
        "vehicleId": "VRM-VEH-018",
        "brand": "Tata",
        "model": "Aeris Concept",
        "type": "SUV",
        "fuelType": "Electric",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 3,
        "mileage": "450 km range",
        "pricePerDay": 2600,
        "securityDeposit": 4000,
        "location": "Bengaluru",
        "rating": 4.8,
        "features": ["Futuristic Aerodynamic Design", "Solar Glass Roof", "AI Autonomous Pilot", "Fast DC Charging", "AR HUD"],
        "image": "/images/vehicles/aeris.jpg",
        "available": True,
        "status": "available",
        "description": "Next-generation futuristic EV crossover with ultra-long electric range, solar panoramic roof, and silent drive."
    },
    {
        "_id": "v19",
        "vehicleId": "VRM-VEH-019",
        "brand": "Kia",
        "model": "Sonet GT Line",
        "type": "SUV",
        "fuelType": "Petrol",
        "transmission": "Automatic",
        "seats": 5,
        "luggageCapacity": 3,
        "mileage": "18.2 km/l",
        "pricePerDay": 2200,
        "securityDeposit": 3000,
        "location": "Delhi",
        "rating": 4.7,
        "features": ["Bose 7-Speaker Audio", "Electric Sunroof", "Ventilated Front Seats", "10.25 Infotainment", "Smart Pure Air Purifier"],
        "image": "/images/vehicles/sonet.jpg",
        "available": True,
        "status": "available",
        "description": "Tech-loaded compact SUV perfect for city cruising and weekend getaways."
    }
]

SEED_USERS = [
    {
        "_id": "u_admin_shahil",
        "name": "Shahil Tankala (Admin)",
        "email": "tshahil2007@gmail.com",
        "phone": "+91 98765 43210",
        "password": "$2b$12$TJICVwrZGY3TtYQy6Bj35uP5.mI1CQpgQax9RSpoJmWgDllWeXv9e", # hashed 'admin'
        "role": "admin",
        "createdAt": "2026-01-01T00:00:00Z"
    },
    {
        "_id": "u1",
        "name": "Admin User",
        "email": "admin@vrm.com",
        "phone": "+91 98765 43210",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW", # hashed 'admin123'
        "role": "admin",
        "createdAt": "2026-01-01T00:00:00Z"
    },
    {
        "_id": "u2",
        "name": "Rahul Sharma",
        "email": "user@vrm.com",
        "phone": "+91 91234 56789",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW", # hashed 'admin123' or 'user123'
        "role": "customer",
        "createdAt": "2026-02-15T10:30:00Z"
    }
]

SEED_BOOKINGS = [
    {
        "_id": "b1",
        "bookingId": "VRM-2026-00125",
        "userId": "u2",
        "customerName": "Rahul Sharma",
        "customerEmail": "user@vrm.com",
        "customerPhone": "+91 91234 56789",
        "licenseNumber": "DL-0420261988231",
        "vehicleId": "v1",
        "vehicleName": "Toyota Innova Crysta",
        "vehicleImage": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        "pickupLocation": "Hyderabad",
        "dropLocation": "Hyderabad",
        "pickupDate": "2026-10-10",
        "returnDate": "2026-10-13",
        "passengers": 5,
        "baseCost": 11400,
        "insurance": 1050,
        "tax": 2052,
        "additionalCharges": 500,
        "totalAmount": 15002,
        "status": "Confirmed",
        "createdAt": "2026-10-01T14:20:00Z"
    }
]

class LocalJSONDatabase:
    def __init__(self, file_path):
        self.file_path = file_path
        self._load()

    def _load(self):
        if not os.path.exists(self.file_path):
            self.data = {
                "vehicles": SEED_VEHICLES,
                "users": SEED_USERS,
                "bookings": SEED_BOOKINGS,
                "reviews": []
            }
            self._save()
        else:
            try:
                with open(self.file_path, "r") as f:
                    self.data = json.load(f)
            except Exception:
                self.data = {
                    "vehicles": SEED_VEHICLES,
                    "users": SEED_USERS,
                    "bookings": SEED_BOOKINGS,
                    "reviews": []
                }
                self._save()

    def _save(self):
        try:
            with open(self.file_path, "w") as f:
                json.dump(self.data, f, indent=2)
        except Exception:
            pass

    def get_collection(self, name):
        if name not in self.data:
            self.data[name] = []
            self._save()
        return LocalCollection(self, name)


class LocalCollection:
    def __init__(self, db, name):
        self.db = db
        self.name = name

    @property
    def items(self):
        return self.db.data.get(self.name, [])

    def find(self, query=None):
        if not query:
            return list(self.items)
        results = []
        for item in self.items:
            match = True
            for k, v in query.items():
                if isinstance(v, dict):
                    if "$regex" in v:
                        import re
                        pattern = re.compile(v["$regex"], re.IGNORECASE)
                        if not pattern.search(str(item.get(k, ""))):
                            match = False
                    elif "$gte" in v:
                        if float(item.get(k, 0)) < float(v["$gte"]):
                            match = False
                    elif "$lte" in v:
                        if float(item.get(k, 0)) > float(v["$lte"]):
                            match = False
                    elif "$ne" in v:
                        if item.get(k) == v["$ne"]:
                            match = False
                elif isinstance(v, bool):
                    if bool(item.get(k)) != v:
                        match = False
                elif str(item.get(k, "")).strip().lower() != str(v).strip().lower():
                    match = False
            if match:
                results.append(item)
        return results

    def find_one(self, query):
        res = self.find(query)
        return res[0] if res else None

    def insert_one(self, doc):
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        self.items.append(doc)
        self.db._save()
        return doc

    def update_one(self, query, update):
        target = self.find_one(query)
        if not target:
            return False
        if "$set" in update:
            for k, v in update["$set"].items():
                target[k] = v
        self.db._save()
        return True

    def delete_one(self, query):
        target = self.find_one(query)
        if target:
            self.items.remove(target)
            self.db._save()
            return True
        return False

    def count_documents(self, query=None):
        return len(self.find(query))


class MongoCollectionWrapper:
    def __init__(self, collection):
        self.collection = collection

    def find(self, query=None):
        q = query or {}
        return list(self.collection.find(q))

    def find_one(self, query):
        q = query or {}
        return self.collection.find_one(q)

    def insert_one(self, doc):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        self.collection.insert_one(doc_copy)
        return doc_copy

    def update_one(self, query, update):
        res = self.collection.update_one(query or {}, update)
        return res.modified_count > 0

    def delete_one(self, query):
        res = self.collection.delete_one(query or {})
        return res.deleted_count > 0

    def count_documents(self, query=None):
        return self.collection.count_documents(query or {})


class MongoDatabaseWrapper:
    def __init__(self, db):
        self.db = db

    def get_collection(self, name):
        return MongoCollectionWrapper(self.db[name])


active_db = None
db_status_message = ""

def init_db():
    global active_db, db_status_message
    if active_db is not None:
        return active_db

    if MONGODB_URI and MONGODB_URI.strip():
        try:
            from pymongo import MongoClient
            client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            db_name = MONGODB_URI.split("/")[-1].split("?")[0] or "vrm_db"
            raw_db = client[db_name]
            mongo_wrapper = MongoDatabaseWrapper(raw_db)

            # Auto-seed MongoDB Atlas if vehicle collection is empty
            vehicles_col = mongo_wrapper.get_collection("vehicles")
            v_count = vehicles_col.count_documents({})
            if v_count == 0:
                print("[DATABASE SETUP] MongoDB Atlas connected to empty database. Auto-seeding 15+ vehicles...")
                for v in SEED_VEHICLES:
                    vehicles_col.insert_one(dict(v))
                users_col = mongo_wrapper.get_collection("users")
                if users_col.count_documents({}) == 0:
                    for u in SEED_USERS:
                        users_col.insert_one(dict(u))
                bookings_col = mongo_wrapper.get_collection("bookings")
                if bookings_col.count_documents({}) == 0:
                    for b in SEED_BOOKINGS:
                        bookings_col.insert_one(dict(b))
                v_count = vehicles_col.count_documents({})

            u_count = mongo_wrapper.get_collection("users").count_documents({})
            b_count = mongo_wrapper.get_collection("bookings").count_documents({})

            active_db = mongo_wrapper
            db_status_message = f"[DATABASE STATUS] MongoDB Atlas connected successfully to database '{db_name}'. (Vehicles: {v_count}, Users: {u_count}, Bookings: {b_count})"
            print(db_status_message)
            return active_db
        except Exception as e:
            print(f"[DATABASE STATUS WARNING] Failed to connect to MongoDB Atlas ({e}). Falling back to local JSON database.")

    # Local JSON fallback engine
    local_db = LocalJSONDatabase(DB_FILE)
    v_count = local_db.get_collection("vehicles").count_documents({})
    u_count = local_db.get_collection("users").count_documents({})
    b_count = local_db.get_collection("bookings").count_documents({})
    active_db = local_db
    db_status_message = f"[DATABASE STATUS] Local JSON Database engine active. (Vehicles: {v_count}, Users: {u_count}, Bookings: {b_count})"
    print(db_status_message)
    return active_db

def get_db():
    return init_db()
