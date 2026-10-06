import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, MapPin, IndianRupee, ShieldCheck, User, Phone, Mail, FileText, ArrowRight, Bot } from 'lucide-react';
import { bookingService, vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function BookingPage({ selectedVehicle, setCurrentPage, bookingPreset }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(selectedVehicle || null);
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [formData, setFormData] = useState({
    customerName: user?.name || bookingPreset?.customerName || 'Rahul Sharma',
    customerEmail: user?.email || 'user@vrm.com',
    customerPhone: user?.phone || '+91 91234 56789',
    licenseNumber: 'DL-0420261988231',
    pickupLocation: bookingPreset?.pickupLocation || 'Hyderabad',
    dropLocation: bookingPreset?.dropLocation || 'Hyderabad',
    pickupDate: bookingPreset?.pickupDate || '2026-10-10',
    returnDate: bookingPreset?.returnDate || '2026-10-13',
    passengers: bookingPreset?.passengers || 5,
  });

  useEffect(() => {
    vehicleService.getVehicles()
      .then((res) => {
        setVehicles(res.data);
        if (!vehicle && res.data.length > 0) {
          setVehicle(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedVehicle) setVehicle(selectedVehicle);
  }, [selectedVehicle]);

  // Calculate pricing breakdown dynamically
  const calculateDays = () => {
    try {
      const d1 = new Date(formData.pickupDate);
      const d2 = new Date(formData.returnDate);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const durationDays = calculateDays();
  const pricePerDay = vehicle?.pricePerDay || 3000;
  const baseCost = pricePerDay * durationDays;
  const insurance = 350 * durationDays;
  const tax = Math.round(baseCost * 0.18);
  const additionalCharges = 500;
  const securityDeposit = vehicle?.securityDeposit || 4000;
  const totalAmount = baseCost + insurance + tax + additionalCharges;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle) {
      showToast('Please select a vehicle to book', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        licenseNumber: formData.licenseNumber,
        vehicleId: vehicle._id,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        passengers: formData.passengers
      };

      const res = await bookingService.createBooking(payload);
      setConfirmedBooking(res.data);
      showToast(`Booking Confirmed! ID: ${res.data.bookingId}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Booking failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-emerald-500/40 text-center space-y-6 shadow-2xl">
          
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Confirmation Success</span>
            <h2 className="text-3xl font-extrabold text-white font-outfit mt-1">
              Booking Confirmed
            </h2>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Booking ID: <span className="text-blue-400 font-bold">{confirmedBooking.bookingId}</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-950 border border-gray-800 text-left space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Vehicle:</span>
              <span className="font-bold text-white">{confirmedBooking.vehicleName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Pickup Location:</span>
              <span className="font-bold text-white">{confirmedBooking.pickupLocation}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Pickup Date:</span>
              <span className="font-bold text-white">{confirmedBooking.pickupDate}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Return Date:</span>
              <span className="font-bold text-white">{confirmedBooking.returnDate}</span>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <span className="font-bold text-white">Total Amount Paid:</span>
              <span className="font-extrabold text-emerald-400 font-outfit">₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentPage('user-dashboard')}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold"
            >
              View in My Bookings Dashboard
            </button>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setCurrentPage('vehicles');
              }}
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-gray-900 text-gray-300 hover:text-white border border-gray-800"
            >
              Book Another Vehicle
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Checkout Process</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mt-1">
          Complete Vehicle Reservation
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Review your trip details and complete your booking with transparent Indian Rupee (₹) pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Booking Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          
          <h3 className="text-lg font-bold text-white font-outfit border-b border-gray-800 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Customer & License Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
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
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Driving License Number
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white font-outfit border-b border-gray-800 pb-3 pt-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Rental & Location Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Select Vehicle */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Selected Vehicle
              </label>
              <select
                value={vehicle?._id || ''}
                onChange={(e) => {
                  const found = vehicles.find((v) => v._id === e.target.value);
                  if (found) setVehicle(found);
                }}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.brand} {v.model} ({v.type}) — ₹{v.pricePerDay}/day
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                required
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Drop Location
              </label>
              <input
                type="text"
                required
                value={formData.dropLocation}
                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                required
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Return Date
              </label>
              <input
                type="date"
                required
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>

        {/* Right: Booking Cost Summary (SECTION 10) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-5 sticky top-28">
            <h3 className="text-lg font-bold text-white font-outfit border-b border-gray-800 pb-3">
              Booking Summary & Pricing (₹ INR)
            </h3>

            {vehicle && (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-900 border border-gray-800">
                <img src={vehicle.image} alt={vehicle.model} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                <div>
                  <div className="text-xs text-blue-400 font-bold uppercase">{vehicle.brand}</div>
                  <div className="font-extrabold text-white text-base">{vehicle.brand} {vehicle.model}</div>
                  <div className="text-xs text-gray-400">{vehicle.type} • {vehicle.seats} Seats</div>
                </div>
              </div>
            )}

            <div className="space-y-2.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between">
                <span>Rental Duration</span>
                <span className="font-bold text-white">{durationDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Price per Day</span>
                <span className="font-bold text-white">₹{pricePerDay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800/60 pt-2">
                <span>Base Rental Cost</span>
                <span className="font-bold text-white">₹{baseCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance (₹350/day)</span>
                <span className="font-bold text-white">₹{insurance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Taxes (18%)</span>
                <span className="font-bold text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Sanitization & GPS Fee</span>
                <span className="font-bold text-white">₹{additionalCharges.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Security Deposit (Refundable)</span>
                <span className="text-emerald-400 font-bold">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold font-outfit text-white pt-3 border-t border-gray-800">
                <span>Final Estimated Amount</span>
                <span className="text-2xl text-emerald-400 font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
            >
              <span>Confirm Booking</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              🔒 Instant Confirmation • Cancellation available up to 24 hrs prior.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
