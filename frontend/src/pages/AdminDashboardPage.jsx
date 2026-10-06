import React, { useState, useEffect } from 'react';
import { Shield, Car, Calendar, Users, IndianRupee, Plus, Edit, Trash2, CheckCircle2, XCircle, BarChart3, PieChartIcon, RefreshCw, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { adminService, vehicleService, bookingService } from '../services/api';
import { useToast } from '../context/ToastContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export default function AdminDashboardPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview, vehicles, bookings, customers
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Vehicle Modal State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    type: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    luggageCapacity: 3,
    mileage: '16 km/l',
    pricePerDay: 3000,
    securityDeposit: 4000,
    location: 'Hyderabad',
    rating: 4.8,
    features: ['Sunroof', 'Touchscreen'],
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    available: true,
    status: 'available',
    description: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, vRes, bRes] = await Promise.all([
        adminService.getStats(),
        vehicleService.getVehicles(),
        bookingService.getUserBookings()
      ]);
      setStats(sRes.data);
      setVehicles(vRes.data);
      setBookings(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      brand: 'Toyota',
      model: 'Urban Cruiser',
      type: 'SUV',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seats: 5,
      luggageCapacity: 3,
      mileage: '18 km/l',
      pricePerDay: 2900,
      securityDeposit: 3500,
      location: 'Hyderabad',
      rating: 4.8,
      features: ['Apple CarPlay', '360 Camera'],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      available: true,
      status: 'available',
      description: 'Compact urban SUV with high fuel efficiency.'
    });
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (v) => {
    setEditingVehicleId(v._id);
    setVehicleForm({
      brand: v.brand,
      model: v.model,
      type: v.type,
      fuelType: v.fuelType,
      transmission: v.transmission,
      seats: v.seats,
      luggageCapacity: v.luggageCapacity,
      mileage: v.mileage,
      pricePerDay: v.pricePerDay,
      securityDeposit: v.securityDeposit,
      location: v.location,
      rating: v.rating,
      features: v.features || [],
      image: v.image,
      available: v.available,
      status: v.status,
      description: v.description || ''
    });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicleId) {
        await vehicleService.updateVehicle(editingVehicleId, vehicleForm);
        showToast('Vehicle updated successfully!', 'success');
      } else {
        await vehicleService.createVehicle(vehicleForm);
        showToast('New vehicle added to database!', 'success');
      }
      setIsVehicleModalOpen(false);
      loadAdminData();
    } catch (err) {
      showToast('Failed to save vehicle', 'error');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      showToast('Vehicle deleted', 'info');
      loadAdminData();
    } catch (err) {
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(`Booking ${bookingId} status updated to ${status}`, 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400 text-sm">Loading admin dashboard statistics...</div>;
  }

  const kpi = stats?.kpi || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit mt-1">
            System Administration Dashboard
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'overview' ? 'bg-amber-500 text-gray-950 font-extrabold' : 'text-gray-400'}`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'vehicles' ? 'bg-amber-500 text-gray-950 font-extrabold' : 'text-gray-400'}`}
          >
            Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'bookings' ? 'bg-amber-500 text-gray-950 font-extrabold' : 'text-gray-400'}`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'customers' ? 'bg-amber-500 text-gray-950 font-extrabold' : 'text-gray-400'}`}
          >
            Customers
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB (SECTION 12) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI CARDS (SECTION 12) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Vehicles</div>
              <div className="text-2xl font-extrabold text-white font-outfit">{kpi.totalVehicles}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Available Vehicles</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-outfit">{kpi.availableVehicles}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Rented Vehicles</div>
              <div className="text-2xl font-extrabold text-rose-400 font-outfit">{kpi.rentedVehicles}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Bookings</div>
              <div className="text-2xl font-extrabold text-blue-400 font-outfit">{kpi.totalBookings}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Active Rentals</div>
              <div className="text-2xl font-extrabold text-purple-400 font-outfit">{kpi.activeRentals}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Revenue</div>
              <div className="text-xl font-extrabold text-amber-400 font-outfit">₹{kpi.totalRevenue?.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* RECHARTS CHARTS SECTION (SECTION 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Monthly Performance AreaChart */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-outfit">Monthly Revenue & Bookings Trend</h3>
                <span className="text-xs text-gray-400 font-mono">Recharts Engine</span>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.charts?.monthlyPerformance || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vehicle Type Distribution PieChart */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="font-bold text-white text-base font-outfit">Vehicle Type Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.charts?.typeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(stats?.charts?.typeDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(stats?.charts?.typeDistribution || []).map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-300">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{t.name}: {t.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MANAGE VEHICLES TAB (SECTION 12) */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white font-outfit">Fleet Vehicle Inventory</h3>
            <button
              onClick={handleOpenAddVehicle}
              className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Vehicle</span>
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-gray-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900 text-gray-400 uppercase font-bold tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Vehicle</th>
                  <th className="p-3.5">Type & Fuel</th>
                  <th className="p-3.5">Seats</th>
                  <th className="p-3.5">Rate / Day</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-900/40">
                    <td className="p-3.5 font-bold text-white flex items-center gap-3">
                      <img src={v.image} alt={v.model} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <span>{v.brand} {v.model}</span>
                    </td>
                    <td className="p-3.5 text-gray-300">{v.type} ({v.fuelType})</td>
                    <td className="p-3.5 text-gray-300">{v.seats} Seats</td>
                    <td className="p-3.5 font-bold text-emerald-400">₹{v.pricePerDay?.toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${v.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {v.available ? 'Available' : 'Rented'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditVehicle(v)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                        title="Edit Vehicle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v._id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MANAGE BOOKINGS TAB (SECTION 12) */}
      {activeTab === 'bookings' && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
          <h3 className="text-xl font-extrabold text-white font-outfit">Manage Customer Reservations</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900 text-gray-400 uppercase font-bold tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Vehicle</th>
                  <th className="p-3.5">Dates</th>
                  <th className="p-3.5">Total (₹)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-900/40 font-mono">
                    <td className="p-3.5 font-bold text-blue-400">{b.bookingId}</td>
                    <td className="p-3.5 font-sans font-bold text-white">{b.customerName}</td>
                    <td className="p-3.5 font-sans text-gray-300">{b.vehicleName}</td>
                    <td className="p-3.5 text-gray-300">{b.pickupDate} → {b.returnDate}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        b.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        b.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                        b.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-sans space-x-1">
                      <button
                        onClick={() => handleUpdateBookingStatus(b.bookingId, 'Active')}
                        className="px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded font-semibold text-[10px]"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.bookingId, 'Completed')}
                        className="px-2 py-1 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded font-semibold text-[10px]"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.bookingId, 'Cancelled')}
                        className="px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded font-semibold text-[10px]"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT VEHICLE MODAL */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white font-outfit">
                {editingVehicleId ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Type</label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Fuel</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Price / Day (₹)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.pricePerDay}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.image}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-bold">
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
