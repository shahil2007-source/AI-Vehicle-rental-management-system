import React from 'react';
import { Star, CheckCircle, Users, Fuel, Gauge, Luggage, ShieldAlert, ArrowLeft, ArrowRight, Bot, IndianRupee, MapPin } from 'lucide-react';

export default function VehicleDetailPage({ vehicle, setCurrentPage, setSelectedVehicle, onOpenAIChat }) {
  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <p>No vehicle selected.</p>
        <button onClick={() => setCurrentPage('vehicles')} className="btn-primary mt-4 px-4 py-2 rounded-xl text-xs font-bold">
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Back Navigation */}
      <button
        onClick={() => setCurrentPage('vehicles')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fleet Catalog</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Image & Badge */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[420px] w-full rounded-3xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900">
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/20" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 text-white backdrop-blur-md shadow-md">
                {vehicle.type}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-950/80 text-gray-200 backdrop-blur-md border border-gray-800">
                {vehicle.fuelType}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-gray-950/80 px-3 py-1.5 rounded-xl border border-gray-800 text-amber-400 text-xs font-bold backdrop-blur-md">
              <Star className="w-4 h-4 fill-current" />
              <span>{vehicle.rating} / 5 Stars (Over 45 Verified Reviews)</span>
            </div>
          </div>
        </div>

        {/* Right: Specifications & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {vehicle.brand}
              </span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${vehicle.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                {vehicle.available ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                {vehicle.available ? 'Available' : 'Rented'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mt-1">
              {vehicle.brand} {vehicle.model}
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed mt-3">
              {vehicle.description || "Premium rental vehicle offering superior driving dynamics, spacious seating, and high safety scores."}
            </p>
          </div>

          {/* Pricing Banner */}
          <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">Daily Rental Rate</span>
              <div className="text-3xl font-extrabold text-white font-outfit mt-0.5">
                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-gray-400">/ day</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Security Deposit</span>
              <div className="text-sm font-bold text-gray-200 mt-0.5">
                ₹{vehicle.securityDeposit.toLocaleString('en-IN')}{' '}
                <span className="text-[10px] text-emerald-400 font-semibold">(Refundable)</span>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <Users className="w-4 h-4 text-blue-400" />
              <div className="text-gray-400">Seating</div>
              <div className="font-bold text-white text-sm">{vehicle.seats} Seats</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <Fuel className="w-4 h-4 text-blue-400" />
              <div className="text-gray-400">Fuel & Transmission</div>
              <div className="font-bold text-white text-sm truncate">{vehicle.fuelType} ({vehicle.transmission})</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <Gauge className="w-4 h-4 text-blue-400" />
              <div className="text-gray-400">Mileage</div>
              <div className="font-bold text-white text-sm truncate">{vehicle.mileage}</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <Luggage className="w-4 h-4 text-blue-400" />
              <div className="text-gray-400">Luggage Boot</div>
              <div className="font-bold text-white text-sm">{vehicle.luggageCapacity} Large Bags</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1 col-span-2 sm:col-span-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div className="text-gray-400">Primary Hub Location</div>
              <div className="font-bold text-white text-sm">{vehicle.location} Hub</div>
            </div>
          </div>

          {/* Features Checklist */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Included Features</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {vehicle.features.map((f, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-gray-900 text-gray-200 border border-gray-800 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons (SECTION 8) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setSelectedVehicle(vehicle);
                setCurrentPage('booking');
              }}
              className="btn-primary w-full sm:w-1/2 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
            >
              <span>Rent Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (onOpenAIChat) onOpenAIChat(vehicle);
              }}
              className="w-full sm:w-1/2 py-3.5 rounded-xl text-sm font-bold bg-gray-900 hover:bg-gray-800 border border-gray-800 text-blue-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Ask AI About This Vehicle</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
