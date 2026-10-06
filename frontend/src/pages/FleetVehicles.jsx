import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Search, 
  Users, 
  Fuel, 
  Star, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { fetchVehicles } from '../services/api';

export default function FleetVehicles({ onSelectBooking }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadFleet();
  }, [categoryFilter, fuelFilter]);

  const loadFleet = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicles({
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        fuel_type: fuelFilter !== 'All' ? fuelFilter : undefined
      });
      setVehicles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles
    .filter((v) => {
      if (!search) return true;
      const s = search.lowerCase || search.toLowerCase();
      return (
        v.brand.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.category.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_day - b.price_per_day;
      if (sortBy === 'price_desc') return b.price_per_day - a.price_per_day;
      return b.rating - a.rating;
    });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Rental Vehicle Fleet</h2>
          <p className="text-xs text-gray-400 mt-1">
            Browse our realistic Indian rental fleet equipped for city drives & highway trips.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Innova, Fortuner, XUV700..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'SUV', 'MUV', 'Sedan', 'Hatchback'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fuel Filter & Sort Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Fuels</option>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 text-xs">Loading vehicles...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between"
            >
              <div>
                {/* Vehicle Image */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={v.image_url}
                    alt={`${v.brand} ${v.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-blue-400 border border-white/10 uppercase">
                    {v.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 flex items-center space-x-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{v.rating}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{v.vehicle_type}</p>
                  </div>

                  {/* Specs Pill List */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-300">
                    <span className="bg-gray-900/80 px-2.5 py-1 rounded-lg border border-gray-800 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{v.seats} Seats</span>
                    </span>
                    <span className="bg-gray-900/80 px-2.5 py-1 rounded-lg border border-gray-800 flex items-center space-x-1">
                      <Fuel className="w-3 h-3 text-cyan-400" />
                      <span>{v.fuel_type}</span>
                    </span>
                    <span className="bg-gray-900/80 px-2.5 py-1 rounded-lg border border-gray-800 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span>{v.location}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed pt-1">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-800/60 mt-3 pt-4">
                <div>
                  <div className="text-lg font-extrabold text-white">
                    ₹{v.price_per_day.toLocaleString()}
                    <span className="text-xs font-normal text-gray-400">/day</span>
                  </div>
                  <div className="text-[10px] text-gray-500">+ ₹{v.price_per_km}/km</div>
                </div>

                <button
                  onClick={() => onSelectBooking(v)}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
