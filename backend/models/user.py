from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, example="Rahul Sharma")
    email: EmailStr = Field(..., example="rahul@example.com")
    password: str = Field(..., min_length=6, example="password123")
    role: Optional[str] = Field("user", example="user")  # 'user' or 'admin'

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="rahul@example.com")
    password: str = Field(...)

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
