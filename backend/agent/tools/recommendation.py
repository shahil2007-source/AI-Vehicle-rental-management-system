def recommend_vehicle(evaluated_candidates: list, user_reqs: dict):
    """
    Tool 5: Rank vehicles by deterministic compatibility score and select top recommendation & alternatives.
    """
    if not evaluated_candidates:
        return {"error": "No candidates evaluated for recommendation."}

    # Sort descending by compatibility score
    sorted_candidates = sorted(
        evaluated_candidates,
        key=lambda x: x["compatibility_score"],
        reverse=True
    )

    top_choice = sorted_candidates[0]
    alternatives = sorted_candidates[1:4]  # Up to 3 alternatives

    reasons = [
        f"Fits user budget requirement (₹{user_reqs.get('budget_per_day', 0)}/day limit).",
        f"Accommodates {user_reqs.get('passengers', 1)} passengers comfortably with {top_choice['vehicle'].get('seats', 5)} seats.",
        f"Matches requested vehicle class ({top_choice['vehicle'].get('category')}) and fuel preference ({top_choice['vehicle'].get('fuel_type')}).",
        f"Highly rated ({top_choice['vehicle'].get('rating')}/5.0) for {user_reqs.get('trip_type', 'road trip')} distances.",
        "Verified available for immediate booking."
    ]

    return {
        "tool_name": "recommend_vehicle",
        "recommended_vehicle": top_choice["vehicle"],
        "compatibility_score": top_choice["compatibility_score"],
        "score_breakdown": top_choice["score_breakdown"],
        "estimated_cost": top_choice["estimated_cost"],
        "alternatives": [
            {
                "vehicle": alt["vehicle"],
                "compatibility_score": alt["compatibility_score"],
                "estimated_cost": alt["estimated_cost"]
            }
            for alt in alternatives
        ],
        "reasons": reasons
    }
