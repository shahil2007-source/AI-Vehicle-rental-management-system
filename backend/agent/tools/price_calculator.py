def calculate_rental_cost(
    price_per_day: float,
    rental_days: int,
    distance_km: float,
    price_per_km: float
):
    """
    Tool 3: Calculate rental cost based on day rate and estimated travel distance.
    Formula: Total = (price_per_day * rental_days) + (distance_km * price_per_km)
    """
    days = max(1, rental_days)
    dist = max(0.0, distance_km)
    
    base_daily_cost = price_per_day * days
    distance_cost = dist * price_per_km
    estimated_total = round(base_daily_cost + distance_cost, 2)
    
    return {
        "tool_name": "calculate_rental_cost",
        "rental_days": days,
        "base_daily_cost": base_daily_cost,
        "distance_km": dist,
        "distance_cost": distance_cost,
        "estimated_total_cost": estimated_total
    }
