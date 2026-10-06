import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from config import settings
from database import get_database
from models.user import UserRegister, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Preset Admin Credentials
ADMIN_EMAIL = "tshahil2007@gmail.com"
ADMIN_PASSWORD_HASH = pwd_context.hash("admin")

IN_MEMORY_USERS = {
    ADMIN_EMAIL: {
        "id": "usr_admin_tshahil",
        "full_name": "Shahil Kumar (Admin)",
        "email": ADMIN_EMAIL,
        "password_hash": ADMIN_PASSWORD_HASH,
        "role": "admin"
    },
    "admin@vehiclerental.com": {
        "id": "usr_admin",
        "full_name": "System Admin",
        "email": "admin@vehiclerental.com",
        "password_hash": pwd_context.hash("admin123"),
        "role": "admin"
    }
}

def ensure_admin_user():
    """Ensure tshahil2007@gmail.com admin account exists in MongoDB Atlas if connected."""
    db = get_database()
    if db is not None:
        try:
            existing = db["users"].find_one({"email": ADMIN_EMAIL})
            if not existing:
                admin_doc = {
                    "id": "usr_admin_tshahil",
                    "full_name": "Shahil Kumar (Admin)",
                    "email": ADMIN_EMAIL,
                    "password_hash": ADMIN_PASSWORD_HASH,
                    "role": "admin"
                }
                db["users"].insert_one(admin_doc)
        except Exception:
            pass

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
def register_user(user: UserRegister):
    db = get_database()
    
    # Check existing user
    if db is not None:
        existing = db["users"].find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email is already registered.")
    elif user.email in IN_MEMORY_USERS:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    hashed_pwd = pwd_context.hash(user.password)
    user_id = f"usr_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    user_doc = {
        "id": user_id,
        "full_name": user.full_name,
        "email": user.email,
        "password_hash": hashed_pwd,
        "role": user.role or "user"
    }

    if db is not None:
        db["users"].insert_one(user_doc.copy())
    else:
        IN_MEMORY_USERS[user.email] = user_doc

    access_token = create_access_token({"sub": user.email, "role": user_doc["role"], "id": user_id})
    user_resp = UserResponse(id=user_id, full_name=user.full_name, email=user.email, role=user_doc["role"])
    
    return Token(access_token=access_token, user=user_resp)

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin):
    ensure_admin_user()
    db = get_database()
    user_doc = None
    
    if db is not None:
        user_doc = db["users"].find_one({"email": credentials.email})
    
    if not user_doc:
        user_doc = IN_MEMORY_USERS.get(credentials.email)

    if not user_doc or not pwd_context.verify(credentials.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    access_token = create_access_token({"sub": user_doc["email"], "role": user_doc["role"], "id": user_doc["id"]})
    user_resp = UserResponse(id=user_doc["id"], full_name=user_doc["full_name"], email=user_doc["email"], role=user_doc["role"])
    
    return Token(access_token=access_token, user=user_resp)

@router.get("/me")
def get_current_user():
    return {
        "id": "usr_admin_tshahil",
        "full_name": "Shahil Kumar (Admin)",
        "email": ADMIN_EMAIL,
        "role": "admin"
    }
