import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Vehicle Rental Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Secrets & External Keys
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/vehicle_rental")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "default_dev_secret_key_change_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Local & CORS Settings
    PORT: int = int(os.getenv("PORT", 8000))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
