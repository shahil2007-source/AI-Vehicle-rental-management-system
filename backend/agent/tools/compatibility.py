def calculate_compatibility(user_reqs: dict, vehicle: dict) -> dict:
    """
    Tool 4: Deterministic AI compatibility scoring algorithm in Python.
    Weights:
    - Budget = 25%
    - Passenger Capacity = 20%
    - Vehicle Type = 15%
    - Fuel Preference = 10%
    - Distance Suitability = 10%
    - Comfort = 10%
    - Rating = 5%
    - Availability = 5%
    """
    # 1. Budget Score (25%)
    user_budget = float(user_reqs.get("budget_per_day", 5000))
    vehicle_price = float(vehicle.get("price_per_day", 3000))
    if vehicle_price <= user_budget:
        budget_score = 100.0
    else:
        over_percentage = (vehicle_price - user_budget) / user_budget
        budget_score = max(0.0, 100.0 - (over_percentage * 200.0))
        
    # 2. Passenger Capacity Score (20%)
    passengers = int(user_reqs.get("passengers", 1))
    seats = int(vehicle.get("seats", 5))
    if seats >= passengers:
        extra_seats = seats - passengers
        if extra_seats <= 2:
            passenger_score = 100.0
        else:
            passenger_score = 85.0  # slightly lower if too oversized
    else:
        passenger_score = max(0.0, 100.0 - ((passengers - seats) * 40.0))

    # 3. Vehicle Type Score (15%)
    req_type = str(user_reqs.get("vehicle_type", "Any")).lower()
    v_category = str(vehicle.get("category", "")).lower()
    v_type = str(vehicle.get("vehicle_type", "")).lower()
    if req_type == "any" or req_type in v_category or req_type in v_type:
        type_score = 100.0
    else:
        type_score = 50.0

    # 4. Fuel Preference Score (10%)
    req_fuel = str(user_reqs.get("fuel_preference", "Any")).lower()
    v_fuel = str(vehicle.get("fuel_type", "")).lower()
    if req_fuel == "any" or req_fuel == v_fuel:
        fuel_score = 100.0
    else:
        fuel_score = 60.0

    # 5. Distance Suitability Score (10%)
    distance = float(user_reqs.get("travel_distance", 300))
    trip_type = str(user_reqs.get("trip_type", "Outstation")).lower()
    if distance > 400 or "outstation" in trip_type:
        # Long distance prefers Diesel, Hybrid, or high comfort SUV/MUV
        if v_fuel in ["diesel", "hybrid"] or v_category in ["suv", "muv"]:
            distance_score = 100.0
        else:
            distance_score = 70.0
    else:
        # Short distance / city trip handles electric, petrol, hatchback fine
        distance_score = 100.0

    # 6. Comfort Score (10%)
    req_comfort = str(user_reqs.get("comfort_preference", "High")).lower()
    v_comfort = str(vehicle.get("comfort_level", "High")).lower()
    comfort_map = {"standard": 1, "high": 2, "luxury": 3}
    user_level = comfort_map.get(req_comfort, 2)
    veh_level = comfort_map.get(v_comfort, 2)
    if veh_level >= user_level:
        comfort_score = 100.0
    else:
        comfort_score = 70.0

    # 7. Rating Score (5%)
    rating = float(vehicle.get("rating", 4.5))
    rating_score = (rating / 5.0) * 100.0

    # 8. Availability Score (5%)
    availability_score = 100.0 if vehicle.get("available", True) else 0.0

    # Calculate Weighted Total (0 - 100)
    final_score = (
        (budget_score * 0.25) +
        (passenger_score * 0.20) +
        (type_score * 0.15) +
        (fuel_score * 0.10) +
        (distance_score * 0.10) +
        (comfort_score * 0.10) +
        (rating_score * 0.05) +
        (availability_score * 0.05)
    )

    final_score_rounded = round(final_score, 1)

    return {
        "tool_name": "calculate_compatibility",
        "vehicle_id": vehicle.get("id"),
        "vehicle_name": f"{vehicle.get('brand')} {vehicle.get('model')}",
        "compatibility_score": final_score_rounded,
        "breakdown": {
            "budget": round(budget_score, 1),
            "passenger_capacity": round(passenger_score, 1),
            "vehicle_type": round(type_score, 1),
            "fuel": round(fuel_score, 1),
            "distance": round(distance_score, 1),
            "comfort": round(comfort_score, 1),
            "rating": round(rating_score, 1),
            "availability": round(availability_score, 1)
        }
    }
