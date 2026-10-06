import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import vehicles, bookings, ai, auth_routes, admin

app = FastAPI(
    title="AI Vehicle Rental Management System API",
    description="Backend API powered by AI Agent, 6 Tools, and MongoDB / File Database",
    version="2.4.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(ai.router)
app.include_router(auth_routes.router)
app.include_router(admin.router)

@app.get("/")
@app.get("/api")
def read_root():
    return {
        "status": "online",
        "app": "AI Vehicle Rental Management System",
        "agent": "AI Vehicle Rental Agent v2.4 (6 Tools Active)",
        "currency": "₹ (INR)",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
