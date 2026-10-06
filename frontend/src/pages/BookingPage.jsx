import React, { useState } from 'react';
import { 
  Calendar, 
  Car, 
  IndianRupee, 
  Navigation, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingPage({ vehicle, estimatedCost, onCompleteBooking }) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-14');
  const [rentalDays, setRentalDays] = useState(4);
  const [distanceKm, setDistanceKm] = useState(600);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!vehicle) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto my-12 border border-gray-800 space-y-4">
        <Car className="w-10 h-10 text-gray-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Vehicle Selected</h3>
        <p className="text-xs text-gray-400">Please select a vehicle from Fleet or AI Finder to proceed.</p>
      </div>
    );
  }

  // Calculate live total cost
  const baseCost = vehicle.price_per_day * rentalDays;
  const distCost = distanceKm * vehicle.price_per_km;
  const calculatedTotal = baseCost + distCost;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        user_id: user?.id || 'usr_demo',
        vehicle_id: vehicle.id,
        start_date: startDate,
        end_date: endDate,
        rental_days: rentalDays,
        estimated_distance_km: distanceKm,
        total_cost: calculatedTotal
      };
      const res = await createBooking(payload);
      if (res && res.booking) {
        setConfirmedBooking(res.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-xl mx-auto my-8 border border-emerald-500/30 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            Booking Confirmed
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-3">
            Reservation #{confirmedBooking.id}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Stored persistently in MongoDB Atlas collection <code className="text-blue-400">bookings</code>.
          </p>
        </div>

        <div className="glass-card p-4 rounded-2xl text-xs space-y-2 text-left border border-gray-800">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Vehicle:</span>
            <span className="font-bold text-white">{vehicle.brand} {vehicle.model}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Dates:</span>
            <span className="text-white">{confirmedBooking.start_date} to {confirmedBooking.end_date} ({confirmedBooking.rental_days} Days)</span>
          </div>
          <div className="flex justify-between font-bold text-emerald-400 pt-1">
            <span>Total Amount Paid:</span>
            <span className="text-base">₹{confirmedBooking.total_cost?.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onCompleteBooking}
          className="btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
        >
          <span>View My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold text-white">Vehicle Reservation</h2>
        <p className="text-xs text-gray-400">Confirm dates and distance parameters to complete booking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Vehicle Summary Card */}
        <div className="md:col-span-5 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <img
            src={vehicle.image_url}
            alt={vehicle.model}
            className="w-full h-40 object-cover rounded-xl border border-gray-800"
          />
          <div>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase">
              {vehicle.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs text-gray-400">{vehicle.vehicle_type}</p>
          </div>

          <div className="text-xs text-gray-300 space-y-1.5 border-t border-gray-800 pt-3">
            <div className="flex justify-between"><span>Base Rate:</span> <span className="text-white font-semibold">₹{vehicle.price_per_day}/day</span></div>
            <div className="flex justify-between"><span>Distance Rate:</span> <span className="text-white font-semibold">₹{vehicle.price_per_km}/km</span></div>
            <div className="flex justify-between"><span>Fuel Type:</span> <span className="text-white font-semibold">{vehicle.fuel_type}</span></div>
            <div className="flex justify-between"><span>Seats:</span> <span className="text-white font-semibold">{vehicle.seats} Passengers</span></div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="md:col-span-7 glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Rental Schedule & Distance</span>
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 mb-1 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 mb-1 block">Rental Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 mb-1 block">Distance (km)</label>
                <input
                  type="number"
                  min="50"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 50)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Base Daily Charge ({rentalDays} days @ ₹{vehicle.price_per_day}):</span>
                <span className="text-white">₹{baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Distance Charge ({distanceKm} km @ ₹{vehicle.price_per_km}):</span>
                <span className="text-white">₹{distCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 text-sm pt-2 border-t border-gray-800">
                <span>Total Estimated Cost:</span>
                <span>₹{calculatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              {submitting ? 'Processing Reservation...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
