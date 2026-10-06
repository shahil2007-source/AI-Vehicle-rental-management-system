import React from 'react';
import { 
  Sparkles, 
  Car, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Cpu,
  Database
} from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner */}
      <div className="relative glass-panel rounded-3xl p-8 sm:p-12 border border-blue-500/20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Agent Powered Vehicle Rental Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Intelligent Vehicle Discovery Powered by <span className="text-gradient">Gemini AI Agent</span>
          </h1>

          <p className="text-gray-300 text-base leading-relaxed">
            Solve complex travel requirements effortlessly. Our AI Agent uses 6 integrated tools to analyze passenger count, daily budget, trip distance, fuel preference, and comfort to calculate deterministic compatibility scores (0-100) and book the ideal vehicle.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('finder')}
              className="btn-primary px-6 py-3.5 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-xl shadow-blue-600/30 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Launch AI Vehicle Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('fleet')}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-gray-800/80 text-gray-200 hover:bg-gray-700/80 border border-gray-700 transition flex items-center space-x-2"
            >
              <Car className="w-4 h-4 text-blue-400" />
              <span>Explore Indian Fleet (15 Vehicles)</span>
            </button>

            <button
              onClick={() => onNavigate('activity')}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-500/30 transition flex items-center space-x-2"
            >
              <Wrench className="w-4 h-4 text-indigo-400" />
              <span>AI Agent Activity Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 AI Agent Tools Workflow Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            6 Integrated AI Agent Tools
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Demonstrating multi-tool agentic reasoning for Fundamentals of AI college evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              name: 'search_vehicles',
              desc: 'Queries MongoDB Atlas for candidate vehicles matching seat count, fuel preference, and budget caps.',
              icon: Car,
              color: 'from-blue-500/20 to-blue-600/10'
            },
            {
              step: '02',
              name: 'check_availability',
              desc: 'Inspects real-time booking schedules to eliminate date-conflicted vehicles from candidate list.',
              icon: Zap,
              color: 'from-amber-500/20 to-amber-600/10'
            },
            {
              step: '03',
              name: 'calculate_rental_cost',
              desc: 'Computes exact rental cost using day rate multiplied by days plus distance multiplied by per-km rate.',
              icon: Cpu,
              color: 'from-emerald-500/20 to-emerald-600/10'
            },
            {
              step: '04',
              name: 'calculate_compatibility',
              desc: 'Executes 8-weighted deterministic math formula (Budget 25%, Seats 20%, Type 15%, Fuel 10%, Distance 10%, Comfort 10%, Rating 5%, Availability 5%).',
              icon: Sparkles,
              color: 'from-purple-500/20 to-purple-600/10'
            },
            {
              step: '05',
              name: 'recommend_vehicle',
              desc: 'Ranks top vehicle and top 3 alternatives, generating Gemini LLM natural language rationale.',
              icon: ShieldCheck,
              color: 'from-indigo-500/20 to-indigo-600/10'
            },
            {
              step: '06',
              name: 'create_booking',
              desc: 'Executes direct persistent booking reservation in MongoDB with instant confirmation ticket.',
              icon: Database,
              color: 'from-cyan-500/20 to-cyan-600/10'
            },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.name}
                className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative overflow-hidden border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-blue-400 border border-white/5`}>
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-500 tracking-wider">
                    TOOL #{tool.step}
                  </span>
                </div>
                <div>
                  <code className="text-sm font-bold text-blue-400 block font-mono">
                    {tool.name}
                  </code>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
