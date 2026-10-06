# AI Vehicle Rental Management System

> **College Project**: Fundamentals of AI (College Project Submission)  
> **Platform**: Production-Style Full-Stack AI Vehicle Rental Platform  
> **Currency**: Indian Rupees (₹ INR)  

---

## 🚗 Project Overview

The **AI Vehicle Rental Management System** is a complete, intelligent vehicle rental platform built to address real-world vehicle rental decision-making. Instead of a basic static site or standard chatbot, this system incorporates a dedicated **Autonomous AI Vehicle Rental Agent** that executes **6 application tools**, performs multi-criteria compatibility scoring across live fleet data, calculates transparent rental pricing in **Indian Rupees (₹)**, and generates natural-language explanations for recommendations.

---

## 🎯 Problem Statement

Renting a vehicle involves complex tradeoffs: passenger count, luggage volume, daily budget, trip distance (fuel economy vs comfort), vehicle body type (SUV, MUV, Sedan, Hatchback), fuel preference, and date availability. Customers often waste time searching manually across vehicle catalogs without knowing which car is best suited for their specific journey.

**Solution**: An AI Agent that autonomously retrieves candidate vehicles from a database, runs availability checks, calculates transparent cost breakdowns (Base rate + Insurance + GST + Fees), computes an 8-factor weighted compatibility score (0–100%), ranks top choices, explains its decision rationale, and generates instant bookings (`VRM-2026-XXXXX`).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Lucide React Icons, Recharts |
| **Backend** | Python 3.13, FastAPI, Uvicorn, Pydantic v2, PyJWT, Passlib |
| **Database** | MongoDB (Supported via PyMongo) + Built-in JSON Database Fallback Engine |
| **AI / LLM** | Google Gemini API (`google-generativeai`) + Grounded DB RAG Engine |
| **Authentication**| JWT Token Authentication + Passlib Password Hashing |

---

## 🤖 The 6 AI Agent Tools

The AI Agent orchestrates 6 separate tool functions:

1. **Tool 1 — Vehicle Search Tool**: Queries the vehicle collection by body type, fuel type, seating capacity, location, and budget constraints.
2. **Tool 2 — Availability Tool**: Checks pickup and return date windows against active customer bookings to eliminate date collisions.
3. **Tool 3 — Budget Calculator Tool**: Calculates `Daily Rate × Duration Days`, adds standard insurance (₹350/day), 18% GST tax, and sanitization/GPS concierge fees in **₹ Indian Rupees**.
4. **Tool 4 — Vehicle Matching Tool**: Calculates an 8-factor weighted compatibility score out of 100%:
   - **Budget Match**: 25%
   - **Passenger Match**: 20%
   - **Vehicle Type Match**: 15%
   - **Fuel Preference**: 10%
   - **Trip Distance & Economy**: 10%
   - **Comfort & Luggage**: 10%
   - **Customer Rating**: 5%
   - **Date Availability**: 5%
5. **Tool 5 — Vehicle Recommendation Tool**: Ranks candidates and extracts the #1 Best Match along with 2–3 alternative options.
6. **Tool 6 — Booking Tool**: Generates and persists the booking record with a unique identifier `VRM-2026-XXXXX`.

---

## 📐 System Architecture

```text
Customer Input
   ↓
Frontend UI (React + Vite + Tailwind CSS)
   ↓
Backend REST API (FastAPI)
   ↓
AI Vehicle Rental Agent Orchestrator
   ↓
┌──────────────────────────────────────────────┐
│ Tool 1: Vehicle Search Tool                  │
│ Tool 2: Availability Tool                    │
│ Tool 3: Budget Calculator (₹ INR)            │
│ Tool 4: Matching & Scoring Tool (0-100%)     │
│ Tool 5: Recommendation Tool (Best + Alts)    │
│ Tool 6: Booking Tool (VRM-2026-XXXXX)        │
└──────────────────────┬───────────────────────┘
                       ↓
         Gemini LLM Engine (RAG Grounded)
                       ↓
          Database (MongoDB / JSON DB)
                       ↓
     Frontend Output (Scores, Costs & Booking)
```

---

## 🏎️ Seeded Vehicles Fleet (15+ Indian Models)

The system comes pre-seeded with realistic Indian market rental pricing (in ₹):

1. **Toyota Innova Crysta** (MUV, 7 Seats, Diesel, ₹3,800/day)
2. **Toyota Fortuner** (SUV, 7 Seats, Diesel, ₹6,500/day)
3. **Kia Carens** (MUV, 7 Seats, Petrol, ₹3,200/day)
4. **Kia Seltos** (SUV, 5 Seats, Petrol, ₹2,800/day)
5. **Hyundai Creta** (SUV, 5 Seats, Diesel, ₹2,600/day)
6. **Hyundai Alcazar** (SUV, 7 Seats, Diesel, ₹3,500/day)
7. **Tata Nexon** (SUV, 5 Seats, Petrol, ₹2,200/day)
8. **Tata Nexon EV** (Electric SUV, 5 Seats, Electric, ₹2,500/day)
9. **Tata Harrier** (SUV, 5 Seats, Diesel, ₹3,400/day)
10. **Mahindra XUV700** (SUV, 7 Seats, Diesel, ₹4,200/day)
11. **Mahindra Scorpio-N** (SUV, 7 Seats, Diesel, ₹3,900/day)
12. **Maruti Swift** (Hatchback, 5 Seats, Petrol, ₹1,500/day)
13. **Maruti Baleno** (Hatchback, 5 Seats, Petrol, ₹1,700/day)
14. **Honda City** (Sedan, 5 Seats, Petrol, ₹2,400/day)
15. **MG Hector** (SUV, 5 Seats, Petrol, ₹3,100/day)

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Python 3.10+ installed
- Node.js v18+ installed

### 2. Environment Setup
Rename or copy `.env.example` to `.env` in both root and `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/vrm_db
JWT_SECRET=super-secret-vrm-ai-jwt-key-2026
```
*(Note: If `GEMINI_API_KEY` or `MONGODB_URI` is left blank, the application automatically uses the local RAG engine and file-backed database so it works out of the box with zero setup).*

### 3. Run Backend (FastAPI)
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation: `http://localhost:8000/docs`

### 4. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend URL: `http://localhost:5173`

---

## 🎭 Project Demonstration Flow (Step-by-Step)

1. Open `http://localhost:5173`.
2. Click **"AI Vehicle Finder"** in the navigation bar.
3. Submit the journey parameters:
   - **Passengers**: 5
   - **Budget**: ₹4,000 / day
   - **Trip Type**: Family Trip
   - **Approx Distance**: 350 km
   - **Vehicle Type**: SUV
4. Click **"🤖 Find Best Vehicle"**.
5. Observe the animated execution modal detailing the tool stack execution.
6. View the generated **Best Match Card** (e.g., **Toyota Innova Crysta** with **92% AI Match Score**).
7. Inspect the **"Why this vehicle?"** reasons and the **Estimated Rental Cost Breakdown in ₹**.
8. Click **"Rent Now"** to auto-fill the booking page and confirm the booking.
9. Note the generated Booking ID (e.g. `VRM-2026-00125`).
10. Open **My Bookings Dashboard** to track your booking status, or switch to **Admin Portal** (`admin@vrm.com` / `admin123`) to view live KPIs and Recharts analytics.

---

## 🔑 Demo Login Credentials

- **Customer Account**: `user@vrm.com` / `admin123`
- **Admin Account**: `admin@vrm.com` / `admin123`

---

## 🔬 Fundamentals of AI Evaluation Points

- **Problem Realism**: Solves complex multi-attribute decision problems in transportation.
- **Genuine AI Agent Architecture**: 6 discrete tools called programmatically.
- **Explainability**: Clear transparency on compatibility score components and natural language rationale.
- **Production Quality**: Modern glassmorphism dark mode UI, responsive layout, Recharts data visualization, and robust error handling.
