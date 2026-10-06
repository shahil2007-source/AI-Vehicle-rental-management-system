from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RecommendationRequest(BaseModel):
    customerName: Optional[str] = "Valued Customer"
    pickupLocation: str = "Hyderabad"
    dropLocation: str = "Hyderabad"
    pickupDate: str = "2026-10-10"
    returnDate: str = "2026-10-13"
    passengers: int = 5
    vehicleType: str = "SUV" # SUV, MUV, Hatchback, Sedan, Any
    fuelPreference: str = "Any" # Petrol, Diesel, Electric, Any
    maxBudgetPerDay: float = 4000
    tripType: str = "Family Trip" # Family Trip, Outstation, Business, Solo/Friends, City Drive
    approxDistanceKm: float = 350
    luggageRequirement: Optional[str] = "Medium" # Light, Medium, Heavy

class BookingRequest(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    licenseNumber: str
    vehicleId: str
    pickupLocation: str
    dropLocation: str
    pickupDate: str
    returnDate: str
    passengers: int
    additionalOptions: Optional[Dict[str, Any]] = {}

class VehicleCreateUpdate(BaseModel):
    brand: str
    model: str
    type: str
    fuelType: str
    transmission: str
    seats: int
    luggageCapacity: int
    mileage: str
    pricePerDay: float
    securityDeposit: float
    location: str
    rating: float = 4.8
    features: List[str] = []
    image: str
    available: bool = True
    status: str = "available"
    description: str = ""

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    selectedVehicleId: Optional[str] = None
