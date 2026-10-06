import React from 'react';
import { Users, Fuel, Gauge, Star, CheckCircle, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export default function VehicleCard({ vehicle, onSelectDetails, onRentNow, matchScore }) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-800/80 group">
      
      {/* Top Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/vehicles/innova-crysta.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/20" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-md">
            {vehicle.type}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-900/90 text-gray-200 backdrop-blur-md border border-gray-700/60">
            {vehicle.fuelType}
          </span>
        </div>

        {matchScore && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-950 shadow-lg flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{matchScore}% AI Match</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-gray-950/80 px-2.5 py-0.5 rounded-lg border border-gray-800 text-amber-400 text-xs font-bold backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{vehicle.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {vehicle.brand}
            </span>
            <span className={`text-xs font-semibold flex items-center gap-1 ${vehicle.available ? 'text-emerald-400' : 'text-rose-400'}`}>
              {vehicle.available ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              {vehicle.available ? 'Available' : 'Rented'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit group-hover:text-blue-400 transition-colors">
            {vehicle.brand} {vehicle.model}
          </h3>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2 my-4 py-2.5 px-3 rounded-xl bg-gray-900/60 border border-gray-800/60 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vehicle.mileage}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Rental Rate</span>
            <div className="text-xl font-extrabold text-white font-outfit">
              ₹{vehicle.pricePerDay.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-gray-400">/day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectDetails(vehicle)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-700/60 transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onRentNow(vehicle)}
              className="btn-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/30"
            >
              <span>Rent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
