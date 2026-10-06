import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  IndianRupee, 
  Navigation, 
  Car, 
  Fuel, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Wrench, 
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { getAIRecommendation } from '../services/api';

export default function AIVehicleFinder({ onSelectBooking }) {
  const [formData, setFormData] = useState({
    passengers: 5,
    budget_per_day: 3500,
    trip_type: 'Outstation Road Trip',
    travel_distance: 600,
    vehicle_type: 'SUV',
    fuel_preference: 'Diesel',
    rental_duration: 4,
    comfort_preference: 'High'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setResult(null);

    // Simulate agent step-by-step tool execution progress animation
    for (let i = 1; i <= 5; i++) {
      setAnalysisStep(i);
      await new Promise((r) => setTimeout(r, 350));
    }

    try {
      const res = await getAIRecommendation(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const stepsList = [
    'Parsing user requirements & travel constraints',
    'Executing Tool #1: search_vehicles()',
    'Executing Tool #2: check_availability()',
    'Executing Tool #3: calculate_rental_cost()',
    'Executing Tool #4: calculate_compatibility() [8 Weights]',
    'Executing Tool #5: recommend_vehicle() & Gemini LLM synthesis'
  ];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Multi-Tool Agentic AI Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">AI Vehicle Finder</h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Input your travel parameters below. Our AI Agent evaluates candidate vehicles using deterministic math scores and Gemini AI rationale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-gray-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span>Trip Requirements Form</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Passengers & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Users className="w-3 h-3 text-blue-400" />
                  <span>Passengers</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <IndianRupee className="w-3 h-3 text-emerald-400" />
                  <span>Budget / Day (₹)</span>
                </label>
                <input
                  type="number"
                  step="500"
                  min="1000"
                  value={formData.budget_per_day}
                  onChange={(e) => setFormData({ ...formData, budget_per_day: parseFloat(e.target.value) || 1000 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Distance & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Navigation className="w-3 h-3 text-purple-400" />
                  <span>Distance (km)</span>
                </label>
                <input
                  type="number"
                  min="50"
                  value={formData.travel_distance}
                  onChange={(e) => setFormData({ ...formData, travel_distance: parseFloat(e.target.value) || 50 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>Rental Days</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.rental_duration}
                  onChange={(e) => setFormData({ ...formData, rental_duration: parseInt(e.target.value) || 1 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Vehicle Type & Fuel */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Car className="w-3 h-3 text-amber-400" />
                  <span>Vehicle Type</span>
                </label>
                <select
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Any">Any Category</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Fuel className="w-3 h-3 text-cyan-400" />
                  <span>Fuel Preference</span>
                </label>
                <select
                  value={formData.fuel_preference}
                  onChange={(e) => setFormData({ ...formData, fuel_preference: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Any">Any Fuel</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Trip Type & Comfort */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <span>Trip Type</span>
                </label>
                <select
                  value={formData.trip_type}
                  onChange={(e) => setFormData({ ...formData, trip_type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Outstation Road Trip">Outstation Road Trip</option>
                  <option value="City Commute">City Commute</option>
                  <option value="Mountain Offroad">Mountain Offroad</option>
                  <option value="Family Vacation">Family Vacation</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex items-center space-x-1 mb-1">
                  <Award className="w-3 h-3 text-yellow-400" />
                  <span>Comfort Level</span>
                </label>
                <select
                  value={formData.comfort_preference}
                  onChange={(e) => setFormData({ ...formData, comfort_preference: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High Comfort</option>
                  <option value="Luxury">Luxury Chauffeur</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 mt-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>AI Agent Analyzing Requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Find My Vehicle</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Container */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Animation State */}
          {analyzing && (
            <div className="glass-panel p-8 rounded-2xl border border-blue-500/30 text-center space-y-6 ai-pulse">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Agent is analyzing your requirements...</h3>
                <p className="text-xs text-gray-400 mt-1">Executing 6 agent tools in sequence</p>
              </div>

              <div className="space-y-2 max-w-md mx-auto text-left">
                {stepsList.map((st, idx) => (
                  <div 
                    key={st}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs transition-all ${
                      analysisStep >= idx
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : 'bg-gray-900/40 border-gray-800 text-gray-600'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${analysisStep >= idx ? 'text-emerald-400' : 'text-gray-700'}`} />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results View */}
          {!analyzing && result && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/30 space-y-6 animate-fadeIn">
              {/* Top Banner Recommendation */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>TOP AI MATCH RECOMMENDATION</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {result.recommended_vehicle?.brand} {result.recommended_vehicle?.model}
                  </h3>
                  <p className="text-xs text-gray-400">{result.recommended_vehicle?.vehicle_type}</p>
                </div>

                {/* Compatibility Badge Gauge */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl text-center shadow-lg shadow-blue-500/20">
                  <div className="text-3xl font-black text-white">{result.compatibility_score}/100</div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-100 mt-0.5">
                    Compatibility Score
                  </div>
                </div>
              </div>

              {/* Rationale & Summary */}
              <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-200 leading-relaxed space-y-2">
                <div className="font-bold flex items-center space-x-1 text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Summary (Gemini LLM Rationale)</span>
                </div>
                <p>{result.agent_summary}</p>
              </div>

              {/* Vehicle Specs & Price Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold text-gray-300">Vehicle Specifications</h4>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between"><span>Category:</span> <span className="text-white font-semibold">{result.recommended_vehicle?.category}</span></div>
                    <div className="flex justify-between"><span>Fuel Type:</span> <span className="text-white font-semibold">{result.recommended_vehicle?.fuel_type}</span></div>
                    <div className="flex justify-between"><span>Seating:</span> <span className="text-white font-semibold">{result.recommended_vehicle?.seats} Seats</span></div>
                    <div className="flex justify-between"><span>Comfort:</span> <span className="text-white font-semibold">{result.recommended_vehicle?.comfort_level}</span></div>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold text-gray-300">Cost Estimate</h4>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between"><span>Day Rate:</span> <span className="text-white">₹{result.recommended_vehicle?.price_per_day}/day</span></div>
                    <div className="flex justify-between"><span>Distance Rate:</span> <span className="text-white">₹{result.recommended_vehicle?.price_per_km}/km</span></div>
                    <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-gray-800">
                      <span>Total Estimated Cost:</span>
                      <span className="text-sm">₹{result.estimated_cost?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasons List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-300">Why the AI Agent chose this vehicle:</h4>
                <div className="space-y-1.5">
                  {result.reasons?.map((r, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Used Checklist */}
              <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 space-y-2">
                <h4 className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-400" />
                  <span>Agent Tools Used ({result.tools_used?.length} Executed)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.tools_used?.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-[11px] font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking CTA */}
              <button
                onClick={() => onSelectBooking(result.recommended_vehicle, result.estimated_cost)}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30"
              >
                <span>Book This Recommended Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!analyzing && !result && (
            <div className="glass-panel p-12 rounded-2xl border border-gray-800 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Ready to find your ideal rental</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Fill in your trip details on the left form and click "Find My Vehicle" to trigger the multi-tool AI Agent workflow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
