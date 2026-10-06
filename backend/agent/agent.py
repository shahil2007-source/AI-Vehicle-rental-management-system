import logging
import uuid
from datetime import datetime
from config import settings
from database import get_database
from agent.tools.vehicle_search import search_vehicles
from agent.tools.availability import check_availability
from agent.tools.price_calculator import calculate_rental_cost
from agent.tools.compatibility import calculate_compatibility
from agent.tools.recommendation import recommend_vehicle
from agent.tools.booking import create_booking

logger = logging.getLogger("uvicorn.error")

class VehicleRentalAgent:
    def __init__(self):
        self.agent_name = "AI Vehicle Rental Agent"
        self.version = "2.0.0"
        self.gemini_key = settings.GEMINI_API_KEY
        self.client = None
        if self.gemini_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.gemini_key)
            except Exception as e:
                logger.warning(f"Could not initialize Gemini Client: {e}")

    def run_agent_workflow(self, user_requirements: dict) -> dict:
        tools_executed = []
        
        # Step 1: Tool 1 - search_vehicles
        search_res = search_vehicles(
            passengers=int(user_requirements.get("passengers", 1)),
            budget_per_day=float(user_requirements.get("budget_per_day", 10000)),
            vehicle_type=str(user_requirements.get("vehicle_type", "Any")),
            fuel_preference=str(user_requirements.get("fuel_preference", "Any")),
            comfort_preference=str(user_requirements.get("comfort_preference", "Any"))
        )
        tools_executed.append("search_vehicles")
        candidate_vehicles = search_res.get("vehicles", [])

        # Step 2 & 3 & 4: Evaluate candidates using availability, cost, and deterministic score
        evaluated_candidates = []
        for v in candidate_vehicles:
            avail_res = check_availability(v["id"])
            if "check_availability" not in tools_executed:
                tools_executed.append("check_availability")

            cost_res = calculate_rental_cost(
                price_per_day=float(v.get("price_per_day", 2000)),
                rental_days=int(user_requirements.get("rental_duration", 1)),
                distance_km=float(user_requirements.get("travel_distance", 100)),
                price_per_km=float(v.get("price_per_km", 10))
            )
            if "calculate_rental_cost" not in tools_executed:
                tools_executed.append("calculate_rental_cost")

            score_res = calculate_compatibility(user_requirements, v)
            if "calculate_compatibility" not in tools_executed:
                tools_executed.append("calculate_compatibility")

            evaluated_candidates.append({
                "vehicle": v,
                "compatibility_score": score_res["compatibility_score"],
                "score_breakdown": score_res["breakdown"],
                "estimated_cost": cost_res["estimated_total_cost"],
                "available": avail_res["available"]
            })

        # Step 5: Tool 5 - recommend_vehicle
        rec_res = recommend_vehicle(evaluated_candidates, user_requirements)
        tools_executed.append("recommend_vehicle")

        top_vehicle = rec_res["recommended_vehicle"]
        top_score = rec_res["compatibility_score"]
        total_cost = rec_res["estimated_cost"]
        alternatives = rec_res["alternatives"]
        reasons = rec_res["reasons"]

        # Step 6: Generate LLM Explanation Rationale via Gemini (or intelligent template fallback)
        agent_summary = self._generate_llm_summary(user_requirements, top_vehicle, top_score, total_cost, reasons)

        # Build final response object
        response_payload = {
            "recommended_vehicle": top_vehicle,
            "compatibility_score": top_score,
            "score_breakdown": rec_res["score_breakdown"],
            "estimated_cost": total_cost,
            "alternatives": alternatives,
            "reasons": reasons,
            "tools_used": tools_executed,
            "agent_summary": agent_summary
        }

        # Step 7: Log Agent Execution to database for faculty demonstration
        self._log_agent_execution(user_requirements, tools_executed, evaluated_candidates, response_payload)

        return response_payload

    def _generate_llm_summary(self, user_reqs, vehicle, score, cost, reasons) -> str:
        """Call Gemini LLM to synthesize explanation rationale for the deterministic score."""
        prompt_text = (
            f"You are the AI Vehicle Rental Agent. A customer needs a vehicle for a {user_reqs.get('trip_type', 'trip')} "
            f"with {user_reqs.get('passengers', 1)} passengers, traveling {user_reqs.get('travel_distance', 100)} km over "
            f"{user_reqs.get('rental_duration', 1)} days with a daily budget of ₹{user_reqs.get('budget_per_day', 0)}. "
            f"The deterministic scoring tool ranked the {vehicle.get('brand')} {vehicle.get('model')} as the top recommendation "
            f"with a compatibility score of {score}/100 and estimated total cost of ₹{cost}. "
            f"Write a professional, concise 3-sentence recommendation summary explaining why this vehicle was chosen."
        )

        if self.client:
            try:
                # Use Gemini 2.5 Flash model
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt_text,
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini API generation fallback triggered: {e}")

        # Intelligent deterministic summary fallback
        return (
            f"The {vehicle.get('brand')} {vehicle.get('model')} is recommended for your {user_reqs.get('trip_type', 'road trip')} "
            f"with an impressive compatibility score of {score}/100. It comfortably accommodates your party of {user_reqs.get('passengers', 1)} "
            f"while remaining within your budget at an estimated total cost of ₹{cost:,}."
        )

    def _log_agent_execution(self, user_reqs, tools_used, candidate_evals, final_rec):
        """Save step-by-step agent logs into agent_logs collection."""
        db = get_database()
        log_entry = {
            "id": f"log_{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.utcnow().isoformat(),
            "user_requirements": user_reqs,
            "tools_selected": tools_used,
            "candidates_evaluated_count": len(candidate_evals),
            "candidates_summary": [
                {
                    "brand": c["vehicle"].get("brand"),
                    "model": c["vehicle"].get("model"),
                    "score": c["compatibility_score"],
                    "cost": c["estimated_cost"]
                }
                for c in candidate_evals[:5]
            ],
            "recommended_vehicle": f"{final_rec['recommended_vehicle'].get('brand')} {final_rec['recommended_vehicle'].get('model')}",
            "compatibility_score": final_rec["compatibility_score"],
            "estimated_cost": final_rec["estimated_cost"],
            "agent_summary": final_rec["agent_summary"]
        }

        if db is not None:
            try:
                db["agent_logs"].insert_one(log_entry.copy())
            except Exception:
                pass
        
        # Keep in memory log cache if db is offline
        if not hasattr(self, "_memory_logs"):
            self._memory_logs = []
        self._memory_logs.append(log_entry)

# Global singleton agent instance
agent_instance = VehicleRentalAgent()
