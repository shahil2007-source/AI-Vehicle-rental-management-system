from pydantic import BaseModel, Field
from typing import Optional

class BookingCreate(BaseModel):
    vehicle_id: str
    start_date: str = Field(..., example="2026-10-10")
    end_date: str = Field(..., example="2026-10-14")
    rental_days: int = Field(..., gt=0, example=4)
    estimated_distance_km: float = Field(..., gt=0, example=600.0)
    user_notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: str
    user_id: str
    vehicle_id: str
    vehicle_details: Optional[dict] = None
    start_date: str
    end_date: str
    rental_days: int
    total_cost: float
    status: str = Field("Confirmed", example="Confirmed")  # Pending, Confirmed, Cancelled
    created_at: str
