import google.generativeai as genai
from config import GEMINI_API_KEY

class AIVehicleChatAssistant:
    def __init__(self, db):
        self.db = db

    def chat(self, user_message: str, selected_vehicle_id: str = None) -> str:
        # Fetch current vehicle fleet context from database
        vehicles = self.db.get_collection("vehicles").find()
        
        # Build fleet summary string for RAG grounding
        fleet_info = []
        for v in vehicles:
            fleet_info.append(
                f"- {v['brand']} {v['model']} ({v['type']}, {v['seats']} seats, {v['fuelType']}, {v['transmission']}, ₹{v['pricePerDay']}/day, Luggage: {v['luggageCapacity']} bags, Rating: {v['rating']}/5, Location: {v['location']})"
            )
        fleet_context = "\n".join(fleet_info)

        selected_info = ""
        if selected_vehicle_id:
            sv = self.db.get_collection("vehicles").find_one({"_id": selected_vehicle_id})
            if sv:
                selected_info = f"\nThe user is currently looking at: {sv['brand']} {sv['model']} (Price: ₹{sv['pricePerDay']}/day, Seats: {sv['seats']}, Fuel: {sv['fuelType']}, Features: {', '.join(sv.get('features', []))})"

        system_instruction = f"""
You are the AI Vehicle Rental Assistant. You assist customers in selecting vehicles from our fleet based ONLY on real database information provided below.
All prices must be in Indian Rupees (₹). Do NOT use dollars ($).

CURRENT AVAILABLE FLEET DATABASE:
{fleet_context}
{selected_info}

Provide clear, helpful, expert advice. If comparing two vehicles (like Innova vs Carens), list key specifications, price comparison in ₹, seating, and ideal use cases.
"""

        if GEMINI_API_KEY:
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = f"{system_instruction}\n\nUser Question: {user_message}"
                res = model.generate_content(prompt)
                if res and res.text:
                    return res.text.strip()
            except Exception as e:
                print(f"Chat Gemini API error: {e}")

        # Intelligent Fallback Rules if Gemini API key is not set
        msg = user_message.lower()
        if "6 people" in msg or "6 passengers" in msg or "6 seater" in msg or "7 seater" in msg or "7 people" in msg:
            six_plus = [v for v in vehicles if v["seats"] >= 6]
            six_plus.sort(key=lambda x: x["pricePerDay"])
            opts = "\n".join([f"• **{v['brand']} {v['model']}** — {v['seats']} seats, ₹{v['pricePerDay']:,}/day ({v['fuelType']})" for v in six_plus])
            return f"For 6+ passengers, here are our best options sorted by price:\n\n{opts}\n\n🏆 **Top Pick:** **Toyota Innova Crysta** (₹3,800/day) or **Kia Carens** (₹3,200/day) offer superior 3rd-row comfort and air conditioning."

        elif "cheapest" in msg or "budget" in msg or "lowest price" in msg:
            cheapest = sorted(vehicles, key=lambda x: x["pricePerDay"])[:3]
            opts = "\n".join([f"• **{v['brand']} {v['model']}** — ₹{v['pricePerDay']:,}/day (5-day total: ₹{v['pricePerDay']*5:,} base)" for v in cheapest])
            return f"Here are our 3 most affordable vehicles:\n\n{opts}\n\nFor a 5-day trip, **Maruti Swift** comes out to only ₹7,500 base rental cost!"

        elif "innova" in msg and "carens" in msg:
            return """**Comparison: Toyota Innova Crysta vs. Kia Carens**

1. **Toyota Innova Crysta (₹3,800/day)**:
   - **Type**: Premium Heavy MUV (Diesel)
   - **Pros**: Legendary long-distance reliability, bulletproof highway comfort, robust 7-seater space.
   - **Best for**: Outstation hill trips and heavy highway travel with 6-7 adults.

2. **Kia Carens (₹3,200/day)**:
   - **Type**: Modern Urban MPV (Petrol Automatic)
   - **Pros**: Cheaper per day (Save ₹600/day), 10.25" touchscreen, smooth automatic driving, modern tech.
   - **Best for**: Value-conscious family road trips with mixed city & highway driving.

👉 **Verdict**: Choose **Carens** for modern tech & budget savings; choose **Innova** for maximum power & outstation durability."""

        elif "luggage" in msg or "boot space" in msg or "bags" in msg:
            largest = sorted(vehicles, key=lambda x: x.get("luggageCapacity", 0), reverse=True)[:3]
            opts = "\n".join([f"• **{v['brand']} {v['model']}** — {v.get('luggageCapacity')} large suitcases (₹{v['pricePerDay']:,}/day)" for v in largest])
            return f"Vehicles with the largest luggage capacity:\n\n{opts}\n\n**Honda City** (506L sedan boot) and **Toyota Fortuner / Innova** are ideal for heavy luggage travel."

        elif "family" in msg:
            return "For family trips, we highly recommend **Toyota Innova Crysta** (₹3,800/day), **Mahindra XUV700** (₹4,200/day), or **Kia Carens** (₹3,200/day). They provide captain seats, dedicated rear AC vents, high safety ratings, and ample bag capacity."

        elif "long distance" in msg or "highway" in msg or "outstation" in msg:
            return "For long-distance highway travel, **Toyota Fortuner** (₹6,500/day), **Mahindra XUV700** (₹4,200/day), and **Toyota Innova Crysta** (₹3,800/day) offer unmatched stability, diesel cruise efficiency, and driver comfort."

        else:
            v_list = ", ".join([f"{v['brand']} {v['model']}" for v in vehicles[:5]])
            return f"I am your AI Rental Assistant! I can help you pick from our 15+ fleet models including {v_list}. Ask me about seating, price comparisons, luggage capacity, or distance suitability!"
