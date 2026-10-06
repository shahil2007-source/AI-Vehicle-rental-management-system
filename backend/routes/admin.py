from fastapi import APIRouter
from database import get_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard-stats")
def get_dashboard_stats():
    db = get_db()

    vehicles = db.get_collection("vehicles").find()
    bookings = db.get_collection("bookings").find()
    users = db.get_collection("users").find()

    total_vehicles = len(vehicles)
    available_vehicles = len([v for v in vehicles if v.get("available") and v.get("status") == "available"])
    rented_vehicles = len([v for v in vehicles if v.get("status") == "rented" or not v.get("available")])

    total_bookings = len(bookings)
    active_rentals = len([b for b in bookings if b.get("status") in ["Confirmed", "Active"]])
    total_revenue = sum([b.get("totalAmount", 0) for b in bookings if b.get("status") != "Cancelled"])

    # Recharts data: Vehicle Type Distribution
    type_counts = {}
    for v in vehicles:
        t = v.get("type", "Other")
        type_counts[t] = type_counts.get(t, 0) + 1
    type_distribution = [{"name": k, "value": v} for k, v in type_counts.items()]

    # Recharts data: Monthly Bookings & Revenue
    monthly_data = [
        {"month": "May", "bookings": 12, "revenue": 145000},
        {"month": "Jun", "bookings": 18, "revenue": 210000},
        {"month": "Jul", "bookings": 24, "revenue": 290000},
        {"month": "Aug", "bookings": 29, "revenue": 340000},
        {"month": "Sep", "bookings": 35, "revenue": 415000},
        {"month": "Oct", "bookings": total_bookings + 15, "revenue": total_revenue + 180000},
    ]

    # Recharts data: Vehicle Popularity
    vehicle_popularity = [
        {"name": "Innova Crysta", "rentals": 48},
        {"name": "Fortuner", "rentals": 36},
        {"name": "XUV700", "rentals": 32},
        {"name": "Creta", "rentals": 28},
        {"name": "Carens", "rentals": 24},
        {"name": "Nexon EV", "rentals": 19},
    ]

    return {
        "kpi": {
            "totalVehicles": total_vehicles,
            "availableVehicles": available_vehicles,
            "rentedVehicles": rented_vehicles,
            "totalBookings": total_bookings,
            "activeRentals": active_rentals,
            "totalRevenue": round(total_revenue, 2),
            "currency": "₹"
        },
        "charts": {
            "typeDistribution": type_distribution,
            "monthlyPerformance": monthly_data,
            "vehiclePopularity": vehicle_popularity
        },
        "customers": [
            {
                "_id": u["_id"],
                "name": u["name"],
                "email": u["email"],
                "phone": u.get("phone", "N/A"),
                "role": u.get("role", "customer"),
                "createdAt": u.get("createdAt", "2026-01-01")
            }
            for u in users
        ]
    }
