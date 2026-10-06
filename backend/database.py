import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import settings

logger = logging.getLogger("uvicorn.error")

_client = None
_db = None

def get_database():
    """Returns PyMongo Database instance."""
    global _client, _db
    if _db is not None:
        return _db
    
    try:
        uri = settings.MONGODB_URI
        _client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        # Attempt server info to test connection
        _client.admin.command('ping')
        _db = _client.get_default_database(default="vehicle_rental")
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Falling back to unauthenticated local mode.")
        try:
            _client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
            _db = _client["vehicle_rental"]
        except Exception:
            _db = None
    return _db

def check_db_health() -> dict:
    """Check connection status for /api/health endpoint."""
    try:
        db = get_database()
        if db is not None:
            # ping server
            if _client:
                _client.admin.command('ping')
            return {"connected": True, "type": "MongoDB"}
    except Exception as e:
        return {"connected": False, "error": str(e)}
    
    return {"connected": False, "type": "MongoDB (Offline)"}
