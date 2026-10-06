import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, CheckCircle2, AlertCircle, ShieldAlert, IndianRupee, Car, Edit3 } from 'lucide-react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UserDashboardPage({ setCurrentPage }) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, profile
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user?.email) {
      bookingService.getUserBookings(user.email)
        .then((res) => setBookings(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const activeRentalsCount = bookings.filter((b) => b.status === 'Active').length;
  const upcomingBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const totalBookingsCount = bookings.length;
  const totalSpent = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Customer Portal</span>
          <h1 className="text-3xl font-extrabold text-white font-outfit mt-1">
            Welcome back, {user?.name || 'Customer'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your active rentals, upcoming trips, and account settings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB (SECTION 11) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase">Active Rentals</div>
              <div className="text-3xl font-extrabold text-emerald-400 font-outfit">{activeRentalsCount}</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase">Upcoming Bookings</div>
              <div className="text-3xl font-extrabold text-blue-400 font-outfit">{upcomingBookingsCount}</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase">Total Bookings</div>
              <div className="text-3xl font-extrabold text-white font-outfit">{totalBookingsCount}</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase">Total Amount Spent</div>
              <div className="text-3xl font-extrabold text-amber-400 font-outfit">₹{totalSpent.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Recent Bookings Summary</h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs text-blue-400 font-bold">
                View All →
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">No recent bookings found.</div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div key={b._id} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {b.vehicleImage ? (
                        <img src={b.vehicleImage} alt={b.vehicleName} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                      ) : (
                        <Car className="w-8 h-8 text-blue-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{b.vehicleName}</div>
                        <div className="text-xs text-gray-400 font-mono">ID: {b.bookingId} • {b.pickupDate} to {b.returnDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        b.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        b.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                        b.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {b.status}
                      </span>
                      <span className="font-extrabold text-white text-sm">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* MY BOOKINGS TAB (SECTION 11) */}
      {activeTab === 'bookings' && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-outfit border-b border-gray-800 pb-3">
            All Customer Reservations
          </h3>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              You have no active or previous bookings.
              <div className="mt-4">
                <button onClick={() => setCurrentPage('ai-finder')} className="btn-primary px-4 py-2 rounded-xl text-xs font-bold">
                  Find Vehicles with AI
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-900 text-gray-400 uppercase font-bold tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Vehicle</th>
                    <th className="p-3.5">Pickup Location</th>
                    <th className="p-3.5">Dates</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-900/40">
                      <td className="p-3.5 font-bold text-blue-400">{b.bookingId}</td>
                      <td className="p-3.5 font-sans font-bold text-white">{b.vehicleName}</td>
                      <td className="p-3.5 font-sans text-gray-300">{b.pickupLocation}</td>
                      <td className="p-3.5 text-gray-300">{b.pickupDate} → {b.returnDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${
                          b.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          b.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                          b.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-white text-sm">
                        ₹{b.totalAmount?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB (SECTION 11) */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-outfit border-b border-gray-800 pb-3 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <span>Update Customer Profile</span>
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
