# AI Vehicle Rental Management System

An intelligent full-stack vehicle rental management application built for college **Fundamentals of AI** evaluation. The project features a multi-tool **AI Vehicle Rental Agent** powered by **Google Gemini LLM**, deterministic compatibility scoring, MongoDB Atlas persistence, and a single Vercel monorepo deployment setup.

---

## 1. Project Overview
The **AI Vehicle Rental Management System** replaces traditional static vehicle filtering with an intelligent AI Agent. Users input travel parameters (passengers, budget, distance, trip type, fuel, comfort preference), and the AI Agent dynamically invokes 6 distinct backend tools to search candidates, verify availability, calculate total costs, evaluate deterministic 8-factor compatibility scores, rank vehicles, and synthesize natural language rationale via Gemini LLM.

---

## 2. Problem Statement
Traditional vehicle rental websites force users to manually filter through long vehicle listings without knowing:
- Whether a vehicle truly fits their trip distance and passenger comfort.
- Exact cost calculations combining daily rental rates and estimated travel mileage.
- Objectively scored vehicle suitability for specific terrain (outstation highway vs city commute).

Our system solves this by delegating decision-making to a multi-tool AI Agent that performs automated mathematical evaluation and delivers transparent, objective recommendations.

---

## 3. Objectives
1. **Solve Real-World Rental Challenges**: Provide dynamic, accurate vehicle recommendations tailored to travel requirements.
2. **Multi-Tool AI Agent Architecture**: Integrate 6 backend tool functions callable by the agent workflow.
3. **Deterministic Math Scoring**: Calculate a 0-100 compatibility score using 8 weighted factors (Budget 25%, Seats 20%, Type 15%, Fuel 10%, Distance 10%, Comfort 10%, Rating 5%, Availability 5%).
4. **Gemini LLM Integration**: Synthesize clear, human-readable recommendation explanations without inventing scores.
5. **Execution Transparency**: Log all agent execution traces in MongoDB for faculty presentation and demonstration.
6. **Single Vercel Project Deployment**: Structure frontend (React Vite) and backend (FastAPI) under unified Vercel routing (`/` for React, `/api/*` for FastAPI).

---

## 4. AI Agent Workflow
The AI Agent executes the following sequential pipeline:
```
User Request 
  ↳ AI Agent Engine 
    ↳ Understand Requirements 
      ↳ Tool #1: search_vehicles 
        ↳ Tool #2: check_availability 
          ↳ Tool #3: calculate_rental_cost 
            ↳ Tool #4: calculate_compatibility (0-100 Score) 
              ↳ Tool #5: recommend_vehicle (Rank & Select) 
                ↳ Gemini LLM Synthesis 
                  ↳ Tool #6: create_booking (Optional Reservation)
```

---

## 5. AI Agent Tools (6 Active Tools)

1. `search_vehicles`: Queries MongoDB Atlas / dataset for candidates matching passenger count, budget caps, and category preferences.
2. `check_availability`: Verifies booking date conflicts against existing database reservations.
3. `calculate_rental_cost`: Computes exact total cost = `(price_per_day * rental_days) + (travel_distance * price_per_km)`.
4. `calculate_compatibility`: Executes Python deterministic scoring across 8 weighted metrics.
5. `recommend_vehicle`: Ranks top candidate and top 3 alternatives, structuring output payload.
6. `create_booking`: Executes direct reservation in MongoDB collection `bookings`.

---

## 6. Architecture & Vercel Multi-Service Deployment

```
                            GitHub Repository
                                    |
                                    v
                             Vercel Deployment
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
     React Frontend                                  FastAPI Backend
    (Vite / Tailwind)                                (/api/* Serverless)
            |                                               |
            +-----------------------+-----------------------+
                                    |
                                    v
                           MongoDB Atlas & Gemini API
```

Root `vercel.json` routing configuration:
```json
{
  "services": {
    "frontend": { "root": "frontend/", "framework": "vite" },
    "backend": { "root": "backend/", "framework": "fastapi", "entrypoint": "main:app" }
  },
  "rewrites": [
    { "source": "/api", "destination": { "service": "backend" } },
    { "source": "/api/(.*)", "destination": { "service": "backend" } },
    { "source": "/(.*)", "destination": { "service": "frontend" } }
  ]
}
```

---

## 7. Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts, Axios
- **Backend**: Python 3.13, FastAPI, Pydantic, PyMongo, PyJWT, Passlib, Uvicorn
- **AI Engine**: Google Gemini API (`google-genai`), Custom Tool Registry
- **Database**: MongoDB Atlas / PyMongo
- **Deployment**: Vercel (Unified Frontend + Backend Project)

---

## 8. Database Design (MongoDB Collections)
- `users`: User profiles, email, password hash, role (`user`/`admin`)
- `vehicles`: Fleet vehicles, specs, daily rate, per-km rate, seating capacity, comfort level, availability
- `bookings`: Rental reservations, start/end dates, distance, total cost, status (`Confirmed`/`Cancelled`)
- `ai_recommendations`: Cached recommendation payloads
- `agent_logs`: Step-by-step AI Agent execution traces for presentation

---

## 9. Realistic Indian Vehicles Dataset
1. **Toyota Innova Crysta** (MUV, 7 Seats, Diesel, Manual, High Comfort)
2. **Toyota Fortuner 4x4** (SUV, 7 Seats, Diesel, Automatic, Luxury)
3. **Kia Carens** (MUV, 7 Seats, Petrol, Automatic, High Comfort)
4. **Kia Seltos** (SUV, 5 Seats, Petrol, Automatic, High Comfort)
5. **Hyundai Creta** (SUV, 5 Seats, Petrol, Automatic, High Comfort)
6. **Hyundai Alcazar** (SUV, 7 Seats, Diesel, Automatic, High Comfort)
7. **Tata Harrier** (SUV, 5 Seats, Diesel, Automatic, High Comfort)
8. **Tata Nexon** (SUV, 5 Seats, Petrol, Manual, Standard)
9. **Tata Nexon EV** (SUV, 5 Seats, Electric, Automatic, High Comfort)
10. **Mahindra XUV700** (SUV, 7 Seats, Diesel, Automatic, Luxury)
11. **Mahindra Scorpio-N** (SUV, 7 Seats, Diesel, Automatic, High Comfort)
12. **MG Hector** (SUV, 5 Seats, Petrol, Automatic, High Comfort)
13. **Maruti Swift** (Hatchback, 5 Seats, Petrol, Manual, Standard)
14. **Honda City** (Sedan, 5 Seats, Petrol, Automatic, High Comfort)
15. **Toyota Camry Hybrid** (Sedan, 5 Seats, Hybrid, Automatic, Luxury)

---

## 10. Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/shahil2007-source/AI-Vehicle-rental-management-system.git
cd AI-Vehicle-rental-management-system

# 2. Install backend Python dependencies
cd backend
pip install -r requirements.txt

# 3. Install frontend Node dependencies
cd ../frontend
npm install
```

---

## 11. Environment Variables

Create `.env` inside `backend/`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/vehicle_rental?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=8000
FRONTEND_URL=http://localhost:5173
```

Create `.env` inside `frontend/`:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 12. Local Development

Start FastAPI Backend Server (Terminal 1):
```bash
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Start React Vite Frontend Server (Terminal 2):
```bash
cd frontend
npm run dev -- --port 5173
```

Access Applications:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 13. Vercel Deployment Guide

1. Push repository to GitHub.
2. Import repository in [Vercel Dashboard](https://vercel.com).
3. Set environment variables in Vercel settings:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
4. Deploy project. Vercel will automatically build the Vite static assets and expose FastAPI backend under `/api/*`.

---

## 14. MongoDB Atlas Setup
1. Create a free M0 Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create Database User under Database Access.
3. Allow Network Access (`0.0.0.0/0`).
4. Copy Connection String into `MONGODB_URI`.

---

## 15. Gemini API Setup
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Add key to `GEMINI_API_KEY` environment variable in backend.

---

## 16. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service & database health status |
| `GET` | `/api/vehicles` | List fleet with filters & search |
| `GET` | `/api/vehicles/{id}` | Get vehicle details by ID |
| `POST` | `/api/ai/recommend` | Trigger 6-tool AI Agent recommendation |
| `POST` | `/api/ai/chat` | AI chat assistant endpoint |
| `POST` | `/api/bookings` | Create new reservation |
| `GET` | `/api/bookings` | List active user bookings |
| `DELETE` | `/api/bookings/{id}` | Cancel reservation |
| `GET` | `/api/admin/dashboard-stats` | Fleet occupancy & revenue metrics |
| `GET` | `/api/admin/agent-logs` | Retrieve step-by-step AI Agent execution traces |

---

## 17. College Presentation Demonstration Instructions

1. Open **AI Agent Activity** page (`/activity`) during faculty presentation.
2. Navigate to **AI Vehicle Finder** (`/finder`).
3. Enter test trip parameters:
   - Passengers: `7`
   - Budget/Day: `₹4,000`
   - Trip Type: `Outstation Road Trip`
   - Travel Distance: `500 km`
   - Vehicle Class: `SUV`
   - Fuel: `Diesel`
4. Click **"Find My Vehicle"**.
5. Highlight the live step-by-step tool execution progress animation (`search_vehicles` → `check_availability` → `calculate_rental_cost` → `calculate_compatibility` → `recommend_vehicle`).
6. Point to the **Compatibility Score Gauge** (e.g. 99.9/100) and explain that the score is calculated by deterministic Python math, while Gemini LLM synthesizes the natural language rationale.
7. Click **"Book This Recommended Vehicle"** to execute reservation.
8. Switch to **AI Agent Activity** logs to present the recorded trace log JSON.
