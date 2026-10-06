def calculate_rental_cost(price_per_day: float, rental_days: int, distance_km: float, price_per_km: float):
    """Tool 3: Calculate rental cost based on day rate and estimated distance."""
    base_rental = price_per_day * rental_days
    distance_cost = distance_km * price_per_km
    total_cost = base_rental + distance_cost
    return {
        "tool": "calculate_rental_cost",
        "base_rental": base_rental,
        "distance_cost": distance_cost,
        "total_cost": total_cost
    }
