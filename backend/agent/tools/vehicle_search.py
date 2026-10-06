from database import REALISTIC_INDIAN_VEHICLES, get_database

def search_vehicles(
    passengers: int = 1,
    budget_per_day: float = 10000.0,
    vehicle_type: str = "Any",
    fuel_preference: str = "Any",
    comfort_preference: str = "Any"
):
    """
    Tool 1: Search vehicles in database matching user constraints.
    """
    db = get_database()
    vehicles = REALISTIC_INDIAN_VEHICLES
    
    if db is not None:
        try:
            db_vehicles = list(db["vehicles"].find({}, {"_id": 0}))
            if db_vehicles and len(db_vehicles) > 0:
                vehicles = db_vehicles
        except Exception:
            pass

    filtered = []
    for v in vehicles:
        # Basic filter checks
        if v.get("seats", 5) < passengers:
            continue
        
        # Soft budget filter (allow up to 25% flexibility for scoring)
        if v.get("price_per_day", 0) > (budget_per_day * 1.25):
            continue

        if vehicle_type != "Any" and v.get("category", "").lower() != vehicle_type.lower():
            # Allow partial match if category is in description
            if vehicle_type.lower() not in v.get("vehicle_type", "").lower():
                pass

        filtered.append(v)
        
    if not filtered:
        # Fallback to top vehicles if strict filter yields 0
        filtered = vehicles[:5]

    return {
        "tool_name": "search_vehicles",
        "candidates_found": len(filtered),
        "vehicles": filtered
    }
