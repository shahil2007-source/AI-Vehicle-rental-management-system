import React from 'react';
import { Bot, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 text-gray-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800/60">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white font-outfit">
                VRM <span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fundamentals of AI College Project — An autonomous AI-agent-powered vehicle rental platform delivering multi-criteria recommendation scoring and transparent Indian Rupee (₹) pricing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini AI & 6 Agent Tools</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-outfit">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-blue-400 transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('ai-finder')} className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-400 font-semibold">
                  <span>🤖 AI Vehicle Finder</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('vehicles')} className="hover:text-blue-400 transition-colors">
                  Browse All 15 Fleet Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('architecture')} className="hover:text-blue-400 transition-colors">
                  AI System Architecture Diagram
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-outfit">AI Agent Tools</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 1: Vehicle Search Tool</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 2: Date Availability Tool</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 3: Indian ₹ Budget Calculator</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 4: 8-Factor Compatibility Scorer</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 5: Recommendation Ranker</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tool 6: Booking Generator</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-outfit">Project Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <span>Dept. of Computer Science & Artificial Intelligence</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 (040) 2345-6789 (Hyderabad Hub)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>ai-project@college.edu.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 AI Vehicle Rental Management System. Built for Fundamentals of AI Project.</p>
          <div className="flex items-center gap-2">
            <span>Currency:</span>
            <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300 font-bold">₹ INR (Indian Rupees)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
