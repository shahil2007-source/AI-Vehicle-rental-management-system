from datetime import datetime

def vehicle_search_tool(db, filters: dict):
    """
    Tool 1 — Vehicle Search Tool
    Search the vehicle database based on vehicle type, brand, fuel type, seats, location, availability.
    """
    vehicles = db.get_collection("vehicles").find({"available": True})
    results = []
    
    req_type = filters.get("vehicleType", "Any")
    req_fuel = filters.get("fuelPreference", "Any")
    min_seats = int(filters.get("passengers", 1))
    max_budget = float(filters.get("maxBudgetPerDay", 100000))
    location = filters.get("pickupLocation", "").strip()

    for v in vehicles:
        # Filter check
        if req_type != "Any" and req_type.lower() not in v["type"].lower() and v["type"].lower() not in req_type.lower():
            # Allow SUV/MUV cross-match if type was unspecified
            pass
        if req_fuel != "Any" and req_fuel.lower() != v["fuelType"].lower():
            pass
        
        # Soft filtering: collect all and score them
        results.append(v)
        
    return results

def availability_tool(db, vehicle_id: str, pickup_date: str, return_date: str) -> dict:
    """
    Tool 2 — Availability Tool
    Check whether a vehicle is available for the requested rental dates.
    """
    bookings = db.get_collection("bookings").find({
        "vehicleId": vehicle_id,
        "status": {"$ne": "Cancelled"}
    })
    
    # Simple date overlap check
    p_date = datetime.strptime(pickup_date, "%Y-%m-%d") if "-" in pickup_date else datetime.now()
    r_date = datetime.strptime(return_date, "%Y-%m-%d") if "-" in return_date else datetime.now()
    
    is_available = True
    conflicting_booking = None
    
    for b in bookings:
        b_p = datetime.strptime(b.get("pickupDate", "2026-01-01"), "%Y-%m-%d")
        b_r = datetime.strptime(b.get("returnDate", "2026-01-01"), "%Y-%m-%d")
        
        if (p_date <= b_r) and (r_date >= b_p):
            is_available = False
            conflicting_booking = b["bookingId"]
            break

    return {
        "vehicleId": vehicle_id,
        "isAvailable": is_available,
        "conflictingBooking": conflicting_booking,
        "checkedDates": f"{pickup_date} to {return_date}"
    }

def budget_calculator_tool(price_per_day: float, duration_days: int) -> dict:
    """
    Tool 3 — Budget Calculator
    Calculates: Daily rental price × number of days, Base cost, Insurance, Taxes, Additional charges, Total estimated cost.
    """
    duration = max(1, duration_days)
    base_cost = round(price_per_day * duration, 2)
    insurance = round(350 * duration, 2) # ₹350 per day standard insurance
    tax = round(base_cost * 0.18, 2) # 18% GST in India
    additional_charges = 500.0 # ₹500 sanitization & GPS concierge
    total_amount = round(base_cost + insurance + tax + additional_charges, 2)

    return {
        "pricePerDay": price_per_day,
        "durationDays": duration,
        "baseCost": base_cost,
        "insurance": insurance,
        "tax": tax,
        "additionalCharges": additional_charges,
        "totalAmount": total_amount,
        "currency": "₹"
    }

def vehicle_matching_tool(vehicle: dict, requirement: dict) -> dict:
    """
    Tool 4 — Vehicle Matching Tool
    Calculate a compatibility score (0-100) based on:
    - Budget Match       25%
    - Passenger Match    20%
    - Vehicle Type       15%
    - Fuel Preference    10%
    - Trip Distance      10%
    - Comfort             10%
    - Rating              5%
    - Availability        5%
    """
    passengers = int(requirement.get("passengers", 5))
    max_budget = float(requirement.get("maxBudgetPerDay", 4000))
    req_type = requirement.get("vehicleType", "Any")
    req_fuel = requirement.get("fuelPreference", "Any")
    distance = float(requirement.get("approxDistanceKm", 300))
    trip_type = requirement.get("tripType", "Family Trip")

    score_details = {}
    reasons = []

    # 1. Budget Match (25%)
    price = vehicle.get("pricePerDay", 3000)
    if price <= max_budget:
        budget_score = 25.0
        reasons.append(f"Within your ₹{int(max_budget):,}/day budget (Costs ₹{int(price):,}/day)")
    else:
        over = price - max_budget
        budget_score = max(0.0, 25.0 - (over / max_budget) * 25.0)
        reasons.append(f"Price is ₹{int(price):,}/day (Slightly above ₹{int(max_budget):,}/day budget)")
    score_details["budget"] = round(budget_score, 1)

    # 2. Passenger Match (20%)
    seats = vehicle.get("seats", 5)
    if seats >= passengers:
        passenger_score = 20.0
        reasons.append(f"Suitable for {passengers} passengers ({seats}-seater capacity)")
    else:
        passenger_score = max(0.0, 20.0 - (passengers - seats) * 10.0)
        reasons.append(f"Seats {seats} people (Requested {passengers} passengers)")
    score_details["passengers"] = round(passenger_score, 1)

    # 3. Vehicle Type Match (15%)
    v_type = vehicle.get("type", "SUV")
    if req_type == "Any" or req_type.lower() == v_type.lower():
        type_score = 15.0
        reasons.append(f"Exact match for vehicle type ({v_type})")
    elif (req_type in ["SUV", "MUV"] and v_type in ["SUV", "MUV"]):
        type_score = 12.0
        reasons.append(f"High comfort {v_type} layout suitable for your request")
    else:
        type_score = 5.0
        reasons.append(f"{v_type} body type")
    score_details["type"] = round(type_score, 1)

    # 4. Fuel Preference Match (10%)
    v_fuel = vehicle.get("fuelType", "Diesel")
    if req_fuel == "Any" or req_fuel.lower() == v_fuel.lower():
        fuel_score = 10.0
        reasons.append(f"Preferred fuel type ({v_fuel})")
    else:
        fuel_score = 4.0
    score_details["fuel"] = round(fuel_score, 1)

    # 5. Trip Distance / Economy Match (10%)
    if distance > 250:
        if v_fuel in ["Diesel", "Electric"]:
            distance_score = 10.0
            reasons.append(f"Fuel-efficient {v_fuel} engine ideal for long-distance travel ({int(distance)} km)")
        else:
            distance_score = 7.0
            reasons.append(f"Good road stability for {int(distance)} km trip")
    else:
        distance_score = 10.0
        reasons.append("Great choice for city and short highway distance")
    score_details["distance"] = round(distance_score, 1)

    # 6. Comfort & Luggage Match (10%)
    luggage = vehicle.get("luggageCapacity", 3)
    if "Family" in trip_type or passengers >= 5:
        if luggage >= 3:
            comfort_score = 10.0
            reasons.append(f"Good luggage capacity ({luggage} large bags)")
        else:
            comfort_score = 6.0
    else:
        comfort_score = 10.0
        reasons.append(f"Ample legroom and {luggage}-bag boot space")
    score_details["comfort"] = round(comfort_score, 1)

    # 7. Rating Match (5%)
    rating = vehicle.get("rating", 4.5)
    rating_score = round((rating / 5.0) * 5.0, 1)
    if rating >= 4.7:
        reasons.append(f"High customer rating ({rating}/5 stars)")
    score_details["rating"] = rating_score

    # 8. Availability Match (5%)
    avail = vehicle.get("available", True)
    avail_score = 5.0 if avail else 0.0
    if avail:
        reasons.append("Available for the selected dates")
    score_details["availability"] = avail_score

    total_score = round(sum(score_details.values()), 1)
    
    return {
        "vehicleId": vehicle.get("_id"),
        "totalScore": min(100, int(total_score)),
        "scoreBreakdown": score_details,
        "reasons": reasons
    }

def vehicle_recommendation_tool(vehicles_with_scores: list) -> dict:
    """
    Tool 5 — Vehicle Recommendation Tool
    Rank suitable vehicles and return Best vehicle, Second-best, Third-best.
    """
    sorted_vehicles = sorted(vehicles_with_scores, key=lambda x: x["match"]["totalScore"], reverse=True)
    
    if not sorted_vehicles:
        return {}

    best = sorted_vehicles[0]
    alternatives = sorted_vehicles[1:3] if len(sorted_vehicles) > 1 else []

    return {
        "bestVehicle": best["vehicle"],
        "bestScore": best["match"]["totalScore"],
        "bestReasons": best["match"]["reasons"],
        "alternatives": [
            {
                "vehicle": alt["vehicle"],
                "score": alt["match"]["totalScore"],
                "reasons": alt["match"]["reasons"]
            }
            for alt in alternatives
        ]
    }

def create_booking_tool(db, booking_data: dict) -> dict:
    """
    Tool 6 — Booking Tool
    Create a rental booking after customer selects vehicle.
    """
    import random
    b_id = f"VRM-2026-{random.randint(10000, 99999)}"
    
    booking_doc = {
        "_id": str(b_id),
        "bookingId": b_id,
        "userId": booking_data.get("userId", "guest"),
        "customerName": booking_data.get("customerName"),
        "customerEmail": booking_data.get("customerEmail"),
        "customerPhone": booking_data.get("customerPhone"),
        "licenseNumber": booking_data.get("licenseNumber"),
        "vehicleId": booking_data.get("vehicleId"),
        "vehicleName": booking_data.get("vehicleName"),
        "vehicleImage": booking_data.get("vehicleImage"),
        "pickupLocation": booking_data.get("pickupLocation"),
        "dropLocation": booking_data.get("dropLocation"),
        "pickupDate": booking_data.get("pickupDate"),
        "returnDate": booking_data.get("returnDate"),
        "passengers": booking_data.get("passengers"),
        "baseCost": booking_data.get("baseCost"),
        "insurance": booking_data.get("insurance"),
        "tax": booking_data.get("tax"),
        "additionalCharges": booking_data.get("additionalCharges"),
        "totalAmount": booking_data.get("totalAmount"),
        "status": "Confirmed",
        "createdAt": datetime.utcnow().isoformat()
    }
    
    db.get_collection("bookings").insert_one(booking_doc)
    return booking_doc
