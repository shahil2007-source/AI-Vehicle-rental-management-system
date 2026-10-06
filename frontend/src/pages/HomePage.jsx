import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Shield, Award, Clock, ArrowRight, Search, CheckCircle2, ChevronRight, Zap, Users, Fuel } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { vehicleService } from '../services/api';

export default function HomePage({ setCurrentPage, setSelectedVehicle, setSelectedFinderPreset }) {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [quickFilter, setQuickFilter] = useState({
    type: 'SUV',
    passengers: 5,
    budget: 4000
  });

  useEffect(() => {
    vehicleService.getVehicles({ sort_by: 'rating' })
      .then((res) => setFeaturedVehicles(res.data.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (setSelectedFinderPreset) {
      setSelectedFinderPreset(quickFilter);
    }
    setCurrentPage('ai-finder');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Fundamentals of AI College Project • AI Agent v2.4</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight font-outfit">
              Find Your Perfect Vehicle with <span className="text-gradient">AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Smart vehicle recommendations, transparent pricing, and effortless rental booking.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage('ai-finder')}
                className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 group"
              >
                <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Find Your Perfect Vehicle (AI Agent)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentPage('vehicles')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-semibold text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-gray-800 transition-all"
              >
                Browse Fleet (15 Vehicles)
              </button>
            </div>

            {/* Key Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 border-t border-gray-800/60 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6 Autonomous AI Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent ₹ INR Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>MongoDB & Gemini AI</span>
              </div>
            </div>

          </div>

          {/* Quick AI Search Card */}
          <div className="mt-14 max-w-4xl mx-auto glass-panel rounded-3xl p-6 border border-gray-800 shadow-2xl">
            <form onSubmit={handleQuickSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Vehicle Type
                </label>
                <select
                  value={quickFilter.type}
                  onChange={(e) => setQuickFilter({ ...quickFilter, type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="SUV">SUV (e.g. Fortuner, Creta)</option>
                  <option value="MUV">MUV (e.g. Innova, Carens)</option>
                  <option value="Sedan">Sedan (e.g. Honda City)</option>
                  <option value="Hatchback">Hatchback (e.g. Swift)</option>
                  <option value="Any">Any Vehicle Type</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Passengers
                </label>
                <select
                  value={quickFilter.passengers}
                  onChange={(e) => setQuickFilter({ ...quickFilter, passengers: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={4}>4 Passengers</option>
                  <option value={5}>5 Passengers</option>
                  <option value={6}>6 Passengers</option>
                  <option value={7}>7 Passengers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Max Budget / Day (₹)
                </label>
                <select
                  value={quickFilter.budget}
                  onChange={(e) => setQuickFilter({ ...quickFilter, budget: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={2000}>Up to ₹2,000 / day</option>
                  <option value={3500}>Up to ₹3,500 / day</option>
                  <option value={5000}>Up to ₹5,000 / day</option>
                  <option value={8000}>Up to ₹8,000 / day</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Agent</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Featured Fleet</span>
            <h2 className="text-3xl font-extrabold text-white mt-1 font-outfit">
              Top Rated Vehicles in India
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('vehicles')}
            className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All 15 Fleet Vehicles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((v) => (
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
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Platform Advantages</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 font-outfit">
            Why Choose AI Vehicle Rental Management?
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Combining artificial intelligence decision-making with high-end fleet reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">AI Matching Agent</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Analyzes passenger capacity, fuel preference, trip distance, and budget to find the optimal vehicle match.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">Transparent Pricing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No hidden fees. Every calculation displays base rate, ₹350/day insurance, 18% GST, and security deposit upfront in ₹.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">Top Rated Fleet</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              15+ premium Indian vehicles including Innova Crysta, Fortuner, XUV700, Carens, and Nexon EV.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">Instant Confirmation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Generates official booking ID (VRM-2026-XXXXX) instantly with live status tracking on user & admin dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* AI AGENT EXPLANATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 flex flex-col md:flex-row items-center gap-10">
          
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>How the AI Agent Operates</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white font-outfit">
              Not Just a Chatbot — A Real Autonomous AI Agent
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Our AI Vehicle Rental Agent evaluates your journey through a multi-tool execution framework. It queries the live vehicle database, checks date collisions, computes an 8-factor compatibility score out of 100%, calculates complete rental costs, and synthesizes natural language reasoning.
            </p>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Multi-Criteria Scoring:</strong> Budget (25%), Passengers (20%), Type (15%), Fuel (10%), Distance (10%), Comfort (10%), Rating (5%), Availability (5%).</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Explainable AI:</strong> Every recommendation comes with explicit "Why this vehicle?" bullet points.</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('ai-finder')}
              className="btn-primary px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Vehicle Finder</span>
            </button>
          </div>

          <div className="w-full md:w-96 glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">Live Agent Log Preview</div>
            <div className="space-y-2 font-mono text-xs text-gray-300">
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-emerald-400">
                ✓ Tool 1: Vehicle Search Tool executed
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-emerald-400">
                ✓ Tool 2: Availability Tool verified dates
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-emerald-400">
                ✓ Tool 3: Budget Calculator (₹ INR) computed
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-amber-300">
                🏆 Top Pick: Toyota Innova Crysta (92/100)
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl glass-card border border-gray-800 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">15+</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Seeded Indian Fleet</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-outfit">98%</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">AI Recommendation Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-outfit">₹0</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Hidden Charges</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-outfit">4.9 / 5</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">Average Fleet Rating</div>
          </div>
        </div>
      </section>

    </div>
  );
}
