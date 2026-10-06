import React from 'react';
import { User, Monitor, Server, Bot, Wrench, Cpu, Database, CheckCircle2, ArrowDown } from 'lucide-react';

export default function ArchitectureDiagram() {
  const tools = [
    { name: 'Vehicle Search Tool', desc: 'Queries fleet database by type, brand, seats & price' },
    { name: 'Availability Tool', desc: 'Validates date ranges against active bookings' },
    { name: 'Budget Calculator', desc: 'Computes base rate, ₹350/day insurance, 18% GST' },
    { name: 'Matching & Scoring Tool', desc: 'Calculates 8-factor score out of 100%' },
    { name: 'Recommendation Tool', desc: 'Ranks top candidate & alternative options' },
    { name: 'Booking Tool', desc: 'Generates VRM-2026-XXXXX booking records' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-8 border border-gray-800 shadow-2xl my-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
          System Design & Flow
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-3 font-outfit">
          AI Agent System Architecture
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          End-to-end data pipeline connecting Customer UI, FastAPI, 6 Autonomous Agent Tools, LLM Synthesis, and Database.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
        
        {/* Layer 1: Customer */}
        <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold shadow-lg">
          <User className="w-5 h-5 text-blue-400" />
          <span>1. Customer Requirement Input</span>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 2: Frontend UI */}
        <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold shadow-lg">
          <Monitor className="w-5 h-5 text-indigo-400" />
          <span>2. Frontend UI (React + Vite + Tailwind CSS)</span>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 3: Backend API */}
        <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold shadow-lg">
          <Server className="w-5 h-5 text-purple-400" />
          <span>3. Backend REST API (Python FastAPI)</span>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 4: AI Agent Orchestrator */}
        <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg shadow-xl shadow-blue-500/20 ai-pulse">
          <Bot className="w-6 h-6 text-white" />
          <span>4. AI Vehicle Rental Agent Orchestrator</span>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 5: The 6 AI Tools Grid */}
        <div className="w-full bg-gray-950/80 p-6 rounded-3xl border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              <span>5. Agent Tool Execution Layer (6 Specialized Tools)</span>
            </h4>
            <span className="text-xs bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800 text-gray-400 font-mono">
              Autonomous Call Stack
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tool {idx + 1}: {t.name}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 6: LLM & DB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900 border border-gray-800 text-white">
            <Cpu className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">6. Gemini LLM Engine</div>
              <div className="text-xs text-gray-400">Natural language synthesis & explainability</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900 border border-gray-800 text-white">
            <Database className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">7. Database Collection</div>
              <div className="text-xs text-gray-400">MongoDB / Seeded Fleet & Bookings</div>
            </div>
          </div>
        </div>

        <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

        {/* Layer 7: Final Dynamic Recommendation Output */}
        <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-base shadow-xl">
          <CheckCircle2 className="w-6 h-6 text-white" />
          <span>8. Dynamic AI Recommendation, Cost Breakdown & Booking Output</span>
        </div>

      </div>
    </div>
  );
}
