import React from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { Bot, Cpu, Database, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Fundamentals of AI • Section 16 Technical Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-outfit">
          AI Agent Architecture & Pipeline
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Comprehensive blueprint demonstrating how the AI Vehicle Rental Agent orchestrates 6 separate application tools to analyze requirements, calculate match scores, query MongoDB, and generate natural language rationale.
        </p>
      </div>

      <ArchitectureDiagram />

      {/* Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            <span>The 6 Autonomous Agent Tools</span>
          </h3>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 1: Vehicle Search Tool</strong>
              Filters DB by vehicle type (SUV, MUV, Sedan, Hatchback), brand, fuel, seats, and daily budget.
            </li>
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 2: Availability Tool</strong>
              Verifies pickup & return date windows against active customer bookings to eliminate date collisions.
            </li>
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 3: Budget Calculator Tool</strong>
              Computes duration days, base cost, ₹350/day insurance, 18% GST tax, and ₹500 fee in Indian Rupees (₹).
            </li>
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 4: Vehicle Matching Tool</strong>
              Calculates 8-factor score: Budget (25%), Passengers (20%), Type (15%), Fuel (10%), Distance (10%), Comfort (10%), Rating (5%), Availability (5%).
            </li>
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 5: Recommendation Tool</strong>
              Ranks candidates and selects Top 1 (Best Match) plus 2-3 Alternatives.
            </li>
            <li className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <strong className="text-blue-400 block mb-1">Tool 6: Booking Tool</strong>
              Generates official booking record with unique ID `VRM-2026-XXXXX`.
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span>LLM Grounding & Explainability</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Unlike static search algorithms, our AI Agent feeds the calculated tool outputs into Google's Gemini API (or structured local engine fallback) to compose human-readable explanation reasoning.
          </p>
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs text-emerald-400 space-y-2">
            <div>✓ "Why this vehicle?" reasoning generation</div>
            <div>✓ DB-grounded Q&A Chat assistant (No hallucination)</div>
            <div>✓ Strict ₹ INR currency compliance</div>
            <div>✓ Real-time status reporting</div>
          </div>
        </div>
      </div>
    </div>
  );
}
