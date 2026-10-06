from datetime import datetime
import json
import os
import requests
from config import GEMINI_API_KEY
from agent.tools import (
    vehicle_search_tool,
    availability_tool,
    budget_calculator_tool,
    vehicle_matching_tool,
    vehicle_recommendation_tool
)

class AIVehicleRentalAgent:
    def __init__(self, db):
        self.db = db

    def run_recommendation_pipeline(self, req: dict) -> dict:
        """
        Runs the complete 6-tool autonomous AI Agent pipeline.
        Returns execution logs, best recommendation, breakdown, and natural language analysis.
        """
        step_logs = []

        # Step 1: Analyze Requirements & Search Database
        step_logs.append({
            "step": 1,
            "title": "Analyzing Customer Requirements & Database Search",
            "log": f"Received query for {req.get('passengers')} passengers, budget ₹{req.get('maxBudgetPerDay')}/day, trip type '{req.get('tripType')}' ({req.get('approxDistanceKm')} km). Tool 'Vehicle Search Tool' executed."
        })
        candidates = vehicle_search_tool(self.db, req)

        # Step 2: Availability Verification
        step_logs.append({
            "step": 2,
            "title": "Checking Vehicle Availability",
            "log": f"Verifying dates {req.get('pickupDate')} to {req.get('returnDate')} against active bookings for {len(candidates)} vehicles using 'Availability Tool'."
        })
        available_candidates = []
        for c in candidates:
            avail_status = availability_tool(self.db, c["_id"], req.get("pickupDate"), req.get("returnDate"))
            if avail_status["isAvailable"]:
                available_candidates.append(c)

        if not available_candidates:
            # Fallback to all candidates if date filtering leaves zero
            available_candidates = candidates

        # Step 3: Calculate Compatibility Scores
        step_logs.append({
            "step": 3,
            "title": "Calculating Multi-Factor Compatibility Scores",
            "log": "Executing 'Vehicle Matching Tool' — evaluating Budget (25%), Passengers (20%), Type (15%), Fuel (10%), Distance (10%), Comfort (10%), Rating (5%), Availability (5%)."
        })
        scored_candidates = []
        for v in available_candidates:
            match_res = vehicle_matching_tool(v, req)
            scored_candidates.append({
                "vehicle": v,
                "match": match_res
            })

        # Step 4: Rank Vehicles & Pick Best + Alternatives
        step_logs.append({
            "step": 4,
            "title": "Ranking Suitable Vehicles",
            "log": "Executing 'Vehicle Recommendation Tool' — sorting candidates by match score to extract primary choice and alternatives."
        })
        ranked = vehicle_recommendation_tool(scored_candidates)

        best_vehicle = ranked.get("bestVehicle")
        if not best_vehicle and scored_candidates:
            best_vehicle = scored_candidates[0]["vehicle"]

        # Step 5: Budget & Cost Calculation
        step_logs.append({
            "step": 5,
            "title": "Calculating Rental Costs",
            "log": "Executing 'Budget Calculator Tool' — computing daily rate × duration, insurance, taxes, and fees."
        })
        
        # Calculate rental duration in days
        try:
            d1 = datetime.strptime(req.get("pickupDate", "2026-10-10"), "%Y-%m-%d")
            d2 = datetime.strptime(req.get("returnDate", "2026-10-13"), "%Y-%m-%d")
            duration_days = max(1, (d2 - d1).days)
        except Exception:
            duration_days = 3

        cost_breakdown = budget_calculator_tool(
            price_per_day=best_vehicle.get("pricePerDay", 3000),
            duration_days=duration_days
        )

        # Step 6: Generate Natural Language Explanation
        step_logs.append({
            "step": 6,
            "title": "Generating AI Natural Language Recommendation",
            "log": "Synthesizing AI reasoning and tailored decision rationale."
        })

        ai_summary = self.generate_natural_language_explanation(
            req=req,
            best_vehicle=best_vehicle,
            cost_breakdown=cost_breakdown,
            best_reasons=ranked.get("bestReasons", []),
            best_score=ranked.get("bestScore", 90)
        )

        return {
            "agentName": "AI Vehicle Rental Agent v2.4",
            "status": "Success",
            "executionSteps": step_logs,
            "customerRequirement": req,
            "bestRecommendation": {
                "vehicle": best_vehicle,
                "compatibilityScore": ranked.get("bestScore", 90),
                "reasons": ranked.get("bestReasons", []),
                "costBreakdown": cost_breakdown
            },
            "alternatives": ranked.get("alternatives", []),
            "aiNaturalLanguageExplanation": ai_summary
        }

    def generate_natural_language_explanation(self, req, best_vehicle, cost_breakdown, best_reasons, best_score):
        """
        Uses Gemini API if key is provided, or structured template if key is omitted.
        """
        prompt = f"""
You are the AI Vehicle Rental Agent for a premium vehicle rental platform in India.
Customer Requirements:
- Name: {req.get('customerName')}
- Passengers: {req.get('passengers')}
- Budget: ₹{req.get('maxBudgetPerDay')}/day
- Trip Type: {req.get('tripType')} ({req.get('approxDistanceKm')} km)
- Vehicle Type: {req.get('vehicleType')}
- Fuel Preference: {req.get('fuelPreference')}

Best Recommendation: {best_vehicle.get('brand')} {best_vehicle.get('model')} ({best_vehicle.get('type')})
Match Score: {best_score}%
Cost Breakdown: ₹{best_vehicle.get('pricePerDay')}/day × {cost_breakdown.get('durationDays')} days = ₹{cost_breakdown.get('baseCost')}. Total with Tax & Insurance = ₹{cost_breakdown.get('totalAmount')}

Write a concise, professional, friendly recommendation summary for the user in natural language explaining why this vehicle was chosen.
"""
        if GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"Gemini API call failed or fallback used: {e}")

        # Fallback structured explanation
        reasons_bullet = "\n".join([f"✓ {r}" for r in best_reasons])
        return f"""Hello {req.get('customerName', 'Valued Customer')}, based on your requirement for a {req.get('tripType')} covering {req.get('approxDistanceKm')} km with {req.get('passengers')} passengers, I recommend the **{best_vehicle.get('brand')} {best_vehicle.get('model')}**.

It achieved a **{best_score}% AI Compatibility Score** because it perfectly matches your space, comfort, and budget constraints (₹{best_vehicle.get('pricePerDay'):,}/day vs your max budget ₹{req.get('maxBudgetPerDay'):,}/day).

**Key Rationale:**
{reasons_bullet}

**Estimated Total Cost:** ₹{cost_breakdown.get('totalAmount'):,} for {cost_breakdown.get('durationDays')} days (Includes ₹{cost_breakdown.get('baseCost'):,} base rate + ₹{cost_breakdown.get('insurance'):,} insurance + ₹{cost_breakdown.get('tax'):,} GST)."""
