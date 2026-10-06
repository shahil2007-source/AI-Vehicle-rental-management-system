import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import check_db_health
from routes import auth, vehicles, bookings, ai, admin

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for AI Vehicle Rental Management System"
)

# CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if os.getenv("FRONTEND_URL"):
    origins.append(os.getenv("FRONTEND_URL").rstrip("/"))

if os.getenv("VERCEL_URL"):
    origins.append(f"https://{os.getenv('VERCEL_URL')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint (both /api/health and /health for Vercel/direct access)
@app.get("/health")
@app.get("/api/health")
def health_check():
    db_status = check_db_health()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status
    }

# Root info endpoint
@app.get("/")
@app.get("/api")
def root_info():
    return {
        "service": settings.PROJECT_NAME,
        "status": "running",
        "health_check": "/api/health",
        "docs": "/docs"
    }

# Register routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
