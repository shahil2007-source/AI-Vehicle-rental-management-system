import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RotateCcw, Car } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { vehicleService } from '../services/api';

export default function VehiclesPage({ setCurrentPage, setSelectedVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Requirement #6: Default filter state
  const [filters, setFilters] = useState({
    type: 'All',
    fuel: 'All',
    seats: 0,
    brand: 'All',
    maxPrice: 25000,
    availableOnly: true, // ON by default
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type && filters.type !== 'All') params.type = filters.type;
      if (filters.fuel && filters.fuel !== 'All') params.fuel = filters.fuel;
      if (filters.seats && filters.seats > 0) params.seats = filters.seats;
      if (filters.brand && filters.brand !== 'All') params.brand = filters.brand;
      if (filters.maxPrice) params.max_price = filters.maxPrice;
      if (filters.availableOnly !== undefined) params.available_only = filters.availableOnly;
      if (filters.sortBy) params.sort_by = filters.sortBy;

      const res = await vehicleService.getVehicles(params);
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'All',
      fuel: 'All',
      seats: 0,
      brand: 'All',
      maxPrice: 25000,
      availableOnly: true,
      sortBy: 'rating'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Complete Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mt-1">
            Explore All Fleet Vehicles
          </h1>
          {/* Requirement #9 & #11: Dynamic vehicle count */}
          <p className="text-gray-400 text-sm mt-1">
            Showing {vehicles.length} premium Indian rental vehicles with real-time specs and pricing.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort By:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="rating">Top Customer Rating</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5 sticky top-28">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Vehicle Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Types</option>
                <option value="SUV">SUV</option>
                <option value="MUV">MUV / MPV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Fuel Type
              </label>
              <select
                value={filters.fuel}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Min Seating Capacity */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Min Seating Capacity
              </label>
              <select
                value={filters.seats}
                onChange={(e) => setFilters({ ...filters, seats: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value={0}>Any Seats</option>
                <option value={5}>5+ Seats</option>
                <option value={7}>7+ Seats</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Brands</option>
                <option value="Toyota">Toyota</option>
                <option value="Kia">Kia</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Tata">Tata</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Maruti">Maruti</option>
                <option value="Honda">Honda</option>
                <option value="MG">MG</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                <span>Max Rate / Day</span>
                <span className="text-emerald-400">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={1500}
                max={25000}
                step={500}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-gray-900 border-gray-700"
                />
                <span>Available Vehicles Only</span>
              </label>
            </div>

          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading fleet catalog...</div>
          ) : vehicles.length === 0 ? (
            <div className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
              <Car className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No vehicles match your filters</h3>
              <button onClick={handleResetFilters} className="btn-primary px-4 py-2 rounded-xl text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v._id}
                  vehicle={v}
                  onSelectDetails={(selected) => {
                    setSelectedVehicle(selected);
                    setCurrentPage('vehicle-detail');
                  }}
                  onRentNow={(selected) => {
                    setSelectedVehicle(selected);
                    setCurrentPage('booking');
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
