import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, CheckCircle2, Zap, ArrowRight, Shield, Fuel, Users, Calendar, MapPin, IndianRupee, RotateCcw, AlertCircle } from 'lucide-react';
import { aiService } from '../services/api';
import AIExecutionModal from '../components/AIExecutionModal';

export default function AIFinderPage({ setCurrentPage, setSelectedVehicle, setBookingPreset, initialPreset }) {
  const [formData, setFormData] = useState({
    customerName: 'Rahul Sharma',
    pickupLocation: 'Hyderabad',
    dropLocation: 'Hyderabad',
    pickupDate: '2026-10-10',
    returnDate: '2026-10-13',
    passengers: 5,
    vehicleType: 'SUV',
    fuelPreference: 'Any',
    maxBudgetPerDay: 4000,
    tripType: 'Family Trip',
    approxDistanceKm: 350,
    luggageRequirement: 'Medium',
  });

  useEffect(() => {
    if (initialPreset) {
      setFormData((prev) => ({
        ...prev,
        vehicleType: initialPreset.type || prev.vehicleType,
        passengers: initialPreset.passengers || prev.passengers,
        maxBudgetPerDay: initialPreset.budget || prev.maxBudgetPerDay,
      }));
    }
  }, [initialPreset]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [rawAgentData, setRawAgentData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsModalOpen(true);

    try {
      const res = await aiService.findRecommendation(formData);
      setRawAgentData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalComplete = () => {
    setIsModalOpen(false);
    setLoading(false);
    if (rawAgentData) {
      setAiResult(rawAgentData);
    }
  };

  const handleRentNow = (v, costBreakdown) => {
    setSelectedVehicle(v);
    if (setBookingPreset) {
      setBookingPreset({
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        passengers: formData.passengers,
        customerName: formData.customerName
      });
    }
    setCurrentPage('booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Execution Modal Animation */}
      <AIExecutionModal
        isOpen={isModalOpen}
        onComplete={handleModalComplete}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Bot className="w-4 h-4 text-amber-400" />
          <span>AI Agent Requirement Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-outfit">
          AI Vehicle Finder
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Enter your journey parameters. Our AI Rental Agent will execute 6 backend tools to calculate compatibility scores and deliver top recommendations.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Rental Requirements & Parameters</span>
            </h3>
            <span className="text-xs text-gray-400">All prices in ₹ (INR)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Customer Name */}
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

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Pickup Location
              </label>
              <select
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Drop Location */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Drop Location
              </label>
              <select
                value={formData.dropLocation}
                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
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

            {/* Return Date */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
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

            {/* Passengers */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Number of Passengers
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SUV">SUV</option>
                <option value="MUV">MUV / MPV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Any">Any Vehicle Type</option>
              </select>
            </div>

            {/* Fuel Preference */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-blue-400" />
                Fuel Preference
              </label>
              <select
                value={formData.fuelPreference}
                onChange={(e) => setFormData({ ...formData, fuelPreference: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Any">Any Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Maximum Budget per Day */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                Max Budget / Day (₹)
              </label>
              <input
                type="number"
                step={500}
                min={1000}
                max={25000}
                value={formData.maxBudgetPerDay}
                onChange={(e) => setFormData({ ...formData, maxBudgetPerDay: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Trip Type
              </label>
              <select
                value={formData.tripType}
                onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Family Trip">Family Trip</option>
                <option value="Outstation Roadtrip">Outstation Roadtrip</option>
                <option value="Business Travel">Business Travel</option>
                <option value="Friends / Solo">Friends / Solo</option>
                <option value="City Commute">City Commute</option>
              </select>
            </div>

            {/* Approximate Distance */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Approx Distance (km)
              </label>
              <input
                type="number"
                step={50}
                min={50}
                max={3000}
                value={formData.approxDistanceKm}
                onChange={(e) => setFormData({ ...formData, approxDistanceKm: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Luggage Requirement */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Luggage Capacity
              </label>
              <select
                value={formData.luggageRequirement}
                onChange={(e) => setFormData({ ...formData, luggageRequirement: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Light">Light (1-2 Bags)</option>
                <option value="Medium">Medium (3-4 Bags)</option>
                <option value="Heavy">Heavy (5+ Bags)</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-800 pt-6">
            <button
              type="button"
              onClick={() => setFormData({
                customerName: 'Rahul Sharma',
                pickupLocation: 'Hyderabad',
                dropLocation: 'Hyderabad',
                pickupDate: '2026-10-10',
                returnDate: '2026-10-13',
                passengers: 5,
                vehicleType: 'SUV',
                fuelPreference: 'Any',
                maxBudgetPerDay: 4000,
                tripType: 'Family Trip',
                approxDistanceKm: 350,
                luggageRequirement: 'Medium'
              })}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-gray-900 border border-gray-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Example</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-4 rounded-xl text-base font-extrabold flex items-center gap-3 shadow-xl shadow-blue-600/30"
            >
              <Bot className="w-5 h-5" />
              <span>🤖 Find Best Vehicle</span>
            </button>
          </div>

        </form>
      </div>

      {/* AI RECOMMENDATION RESULTS SECTION */}
      {aiResult && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-gray-900 border border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                🤖
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white font-outfit">
                  AI VEHICLE RENTAL AGENT RECOMMENDATION
                </h2>
                <p className="text-xs text-blue-300 font-mono mt-0.5">
                  Pipeline Status: 6 Tools Executed • Output Grounded in Database
                </p>
              </div>
            </div>
          </div>

          {/* BEST RECOMMENDATION CARD (SECTION 4 & 21) */}
          {aiResult.bestRecommendation && aiResult.bestRecommendation.vehicle && (
            <div className="glass-panel rounded-3xl p-8 border-2 border-blue-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-l from-amber-500 to-yellow-400 text-gray-950 font-extrabold text-xs uppercase tracking-widest rounded-bl-2xl shadow-lg flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                <span>Best Recommendation Choice</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Vehicle Image */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-72 border border-gray-800 shadow-xl">
                  <img
                    src={aiResult.bestRecommendation.vehicle.image}
                    alt={aiResult.bestRecommendation.vehicle.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/20" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-white bg-gray-950/80 p-3 rounded-xl border border-gray-800 backdrop-blur-md">
                    <span>{aiResult.bestRecommendation.vehicle.brand} {aiResult.bestRecommendation.vehicle.model}</span>
                    <span className="text-emerald-400 font-extrabold">₹{aiResult.bestRecommendation.vehicle.pricePerDay.toLocaleString('en-IN')}/day</span>
                  </div>
                </div>

                {/* Right: Score & Reasons */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {aiResult.bestRecommendation.vehicle.brand}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {aiResult.bestRecommendation.vehicle.type}
                      </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white font-outfit mt-1">
                      {aiResult.bestRecommendation.vehicle.brand} {aiResult.bestRecommendation.vehicle.model}
                    </h2>
                  </div>

                  {/* Compatibility Score */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-gray-950 flex flex-col items-center justify-center font-extrabold shadow-lg shrink-0">
                      <span className="text-2xl leading-none">{aiResult.bestRecommendation.compatibilityScore}%</span>
                      <span className="text-[9px] uppercase font-mono tracking-tighter">AI Score</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Match Compatibility Score</div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Calculated across Budget (25%), Seats (20%), Vehicle Type (15%), Fuel (10%), Distance (10%), Comfort (10%), Rating (5%), Availability (5%).
                      </p>
                    </div>
                  </div>

                  {/* WHY THIS VEHICLE? (SECTION 21) */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Why this vehicle?</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      {aiResult.bestRecommendation.reasons.map((r, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ESTIMATED RENTAL COST (SECTION 4 & TOOL 3) */}
                  <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Estimated Rental Cost Breakdown (₹ Indian Rupees)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-gray-500">Base Cost</div>
                        <div className="text-sm font-bold text-white">
                          ₹{aiResult.bestRecommendation.costBreakdown.pricePerDay} × {aiResult.bestRecommendation.costBreakdown.durationDays}d = ₹{aiResult.bestRecommendation.costBreakdown.baseCost}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Insurance</div>
                        <div className="text-sm font-bold text-white">₹{aiResult.bestRecommendation.costBreakdown.insurance}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Taxes (18% GST)</div>
                        <div className="text-sm font-bold text-white">₹{aiResult.bestRecommendation.costBreakdown.tax}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-bold text-blue-400">Total Estimated</div>
                        <div className="text-lg font-extrabold text-emerald-400 font-outfit">
                          ₹{aiResult.bestRecommendation.costBreakdown.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleRentNow(aiResult.bestRecommendation.vehicle, aiResult.bestRecommendation.costBreakdown)}
                      className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
                    >
                      <span>Rent Now — Proceed to Booking</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                </div>

              </div>

              {/* Natural Language Explanation Box */}
              {aiResult.aiNaturalLanguageExplanation && (
                <div className="mt-8 pt-6 border-t border-gray-800 bg-gray-900/40 p-5 rounded-2xl text-sm text-gray-300 leading-relaxed font-sans border border-gray-800">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-blue-400 mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>AI Agent Natural Language Explanation</span>
                  </div>
                  <div className="whitespace-pre-wrap">{aiResult.aiNaturalLanguageExplanation}</div>
                </div>
              )}

            </div>
          )}

          {/* ALTERNATIVE RECOMMENDATIONS (SECTION 4) */}
          {aiResult.alternatives && aiResult.alternatives.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-white font-outfit">
                Alternative Recommendations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiResult.alternatives.map((alt, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-400">Option #{idx + 2}</span>
                        <h4 className="text-xl font-bold text-white font-outfit">
                          {alt.vehicle.brand} {alt.vehicle.model}
                        </h4>
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-gray-900 text-amber-400 font-extrabold text-sm border border-gray-700">
                        {alt.score}/100 Match
                      </div>
                    </div>

                    <div className="h-40 rounded-xl overflow-hidden">
                      <img src={alt.vehicle.image} alt={alt.vehicle.model} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span>{alt.vehicle.seats} Seats • {alt.vehicle.fuelType}</span>
                      <span className="font-extrabold text-white text-sm">₹{alt.vehicle.pricePerDay.toLocaleString('en-IN')}/day</span>
                    </div>

                    <button
                      onClick={() => handleRentNow(alt.vehicle, null)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white transition-colors"
                    >
                      Select Option #{idx + 2} & Rent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
