from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from models import UserRegister, UserLogin
from auth import verify_password, get_password_hash, create_access_token, get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
def register_user(req: UserRegister):
    db = get_db()
    existing = db.get_collection("users").find_one({"email": req.email.strip().lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = get_password_hash(req.password)
    user_doc = {
        "_id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email.strip().lower(),
        "phone": req.phone,
        "password": hashed_password,
        "role": "customer",
        "createdAt": datetime.utcnow().isoformat()
    }

    db.get_collection("users").insert_one(user_doc)

    token = create_access_token({"sub": user_doc["_id"], "email": user_doc["email"], "role": user_doc["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": user_doc["_id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "phone": user_doc["phone"],
            "role": user_doc["role"]
        }
    }

@router.post("/login")
def login_user(req: UserLogin):
    db = get_db()
    user = db.get_collection("users").find_one({"email": req.email.strip().lower()})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": user["_id"], "email": user["email"], "role": user.get("role", "customer")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "role": user.get("role", "customer")
        }
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user = db.get_collection("users").find_one({"_id": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "_id": user["_id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone", ""),
        "role": user.get("role", "customer")
    }
