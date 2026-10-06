import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { fetchUserBookings, cancelBooking } from '../services/api';

export default function MyBookings({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchUserBookings();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm(`Are you sure you want to cancel booking ${id}?`)) {
      try {
        await cancelBooking(id);
        loadBookings();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">My Reservations</h2>
          <p className="text-xs text-gray-400 mt-1">Manage active and past vehicle rental bookings.</p>
        </div>
        <button
          onClick={loadBookings}
          className="p-2 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl hover:text-white transition"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border border-gray-800">
          <Calendar className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active bookings found</h3>
          <p className="text-xs text-gray-400">You haven't made any vehicle reservations yet.</p>
          <button
            onClick={() => onNavigate('finder')}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
          >
            Find a Vehicle with AI
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const isConfirmed = b.status !== 'Cancelled';
            return (
              <div
                key={b.id}
                className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-white font-mono">
                      #{b.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {b.start_date} to {b.end_date} ({b.rental_days} Days)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Estimated Distance: {b.estimated_distance_km} km</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Total Price</div>
                    <div className="text-lg font-extrabold text-emerald-400">
                      ₹{b.total_cost?.toLocaleString()}
                    </div>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
