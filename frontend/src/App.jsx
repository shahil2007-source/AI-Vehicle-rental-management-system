import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Database, 
  Cpu, 
  Sparkles, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Wrench,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { checkHealth, fetchVehicles } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const status = await checkHealth();
      setHealthStatus(status);
      const vehicleData = await fetchVehicles();
      if (Array.isArray(vehicleData)) {
        setVehicles(vehicleData);
      }
    } catch (err) {
      setHealthStatus({ status: 'offline', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const isOnline = healthStatus?.status === 'healthy';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans flex flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient">
                AI Vehicle Rental
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Fundamentals of AI • College Project
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
            {[
              { id: 'overview', label: 'Stage 1 Overview', icon: Activity },
              { id: 'finder', label: 'AI Vehicle Finder', icon: Sparkles },
              { id: 'fleet', label: 'Fleet Vehicles', icon: Car },
              { id: 'activity', label: 'AI Agent Activity', icon: Cpu },
              { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Health Badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={runHealthCheck}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              title="Refresh API Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isOnline ? 'API Connected (/api/health)' : 'Checking API...'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="glass-panel rounded-2xl p-8 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Stage 1 Initialization Complete</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  AI-Powered Vehicle Rental Management System
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Single-Vercel project deployment integrating React Vite Frontend, FastAPI Backend, MongoDB Atlas, and Gemini AI Agent with 6 tools.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('finder')}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2"
                  >
                    <span>Preview AI Vehicle Finder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="/api/health"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition flex items-center space-x-2"
                  >
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Test /api/health Endpoint</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Architecture & Live Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Frontend Status */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">React Frontend</h3>
                  <p className="text-xs text-gray-400 mt-1">Vite + Tailwind CSS + Lucide Icons</p>
                </div>
                <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Base API Route:</span>
                    <code className="text-blue-400">/api</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Dev Proxy:</span>
                    <code className="text-emerald-400">http://localhost:8000</code>
                  </div>
                </div>
              </div>

              {/* Card 2: Backend API Status */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Server className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {isOnline ? 'Online' : 'Checking'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">FastAPI Backend</h3>
                  <p className="text-xs text-gray-400 mt-1">Python FastAPI + Pydantic + PyMongo</p>
                </div>
                <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Health Status:</span>
                    <code className="text-emerald-400">{healthStatus?.status || 'verifying'}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Vercel Entrypoint:</span>
                    <code className="text-purple-400">backend/main.py (main:app)</code>
                  </div>
                </div>
              </div>

              {/* Card 3: MongoDB Database */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                    Connected
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">MongoDB Persistence</h3>
                  <p className="text-xs text-gray-400 mt-1">Vehicles, Bookings, Agent Logs</p>
                </div>
                <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Initial Vehicles Loaded:</span>
                    <code className="text-blue-400">{vehicles.length} Vehicles</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Collections Prepared:</span>
                    <code className="text-emerald-400">5 Collections</code>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Agent 6 Tools Preview */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Agent Tool Registry (6 Required Tools)</h3>
                  <p className="text-xs text-gray-400">Tools configured for LLM execution in Stage 2</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {[
                  { name: 'search_vehicles', desc: 'Queries vehicle collection by seat, budget, fuel & category' },
                  { name: 'check_availability', desc: 'Verifies booking date conflicts for selected vehicles' },
                  { name: 'calculate_rental_cost', desc: 'Computes day rate + distance estimate cost' },
                  { name: 'calculate_compatibility', desc: 'Executes 8-weighted deterministic scoring math (0-100)' },
                  { name: 'recommend_vehicle', desc: 'Ranks top vehicle and generates LLM breakdown rationale' },
                  { name: 'create_booking', desc: 'Triggers direct persistent reservation in MongoDB' },
                ].map((tool, idx) => (
                  <div key={tool.name} className="glass-card p-4 rounded-xl space-y-1.5 border border-gray-800">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-blue-400">#{idx + 1} {tool.name}</code>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-gray-400 leading-normal">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 border border-blue-500/20">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white capitalize">{activeTab.replace('_', ' ')} Preview</h3>
            <p className="text-xs text-gray-400">
              Module structure initialized for Stage 1. Complete interactive UI, AI recommendations, and booking workflows will be implemented in Stage 2.
            </p>
            <button
              onClick={() => setActiveTab('overview')}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-2"
            >
              <span>Back to Stage 1 Overview</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-gray-800 px-6 py-4 mt-auto text-center text-xs text-gray-500">
        AI Vehicle Rental Management System • Built for Vercel Monorepo Deployment • College Project
      </footer>
    </div>
  );
}
