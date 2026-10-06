from pydantic import BaseModel, Field
from typing import List, Optional

class VehicleBase(BaseModel):
    brand: str = Field(..., example="Mahindra")
    model: str = Field(..., example="XUV700")
    category: str = Field(..., example="SUV")  # SUV, Sedan, Hatchback, MUV, Luxury
    vehicle_type: str = Field(..., example="7-Seater Premium SUV")
    fuel_type: str = Field(..., example="Diesel")  # Petrol, Diesel, Electric, Hybrid
    transmission: str = Field(..., example="Automatic")  # Manual, Automatic
    seats: int = Field(..., ge=2, le=10, example=7)
    price_per_day: float = Field(..., gt=0, example=3500.0)
    price_per_km: float = Field(..., gt=0, example=15.0)
    rating: float = Field(4.5, ge=1.0, le=5.0, example=4.8)
    comfort_level: str = Field("High", example="Luxury")  # Standard, High, Luxury
    location: str = Field("Bengaluru", example="Bengaluru")
    available: bool = Field(True)
    image_url: str = Field(..., example="https://images.unsplash.com/photo-1549399542-7e3f8b79c341")
    description: str = Field(..., example="Spacious 7-seater SUV with ADAS and panoramic sunroof.")
    features: List[str] = Field(default=[], example=["Sunroof", "ADAS", "Ventilated Seats", "GPS"])

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: str

class VehicleFilter(BaseModel):
    category: Optional[str] = None
    fuel_type: Optional[str] = None
    min_seats: Optional[int] = None
    max_price_per_day: Optional[float] = None
    available_only: Optional[bool] = True
