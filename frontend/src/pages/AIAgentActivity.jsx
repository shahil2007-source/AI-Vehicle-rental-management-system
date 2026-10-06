import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Car, 
  IndianRupee, 
  Cpu, 
  RefreshCw,
  Award
} from 'lucide-react';
import { fetchAgentLogs } from '../services/api';

export default function AIAgentActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAgentLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Faculty Presentation & College Evaluation View</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-2">AI Agent Activity & Execution Logs</h2>
          <p className="text-xs text-gray-400">
            Exposing step-by-step agent tool selections, candidate evaluation matrices, and Gemini LLM rationale.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl hover:text-white transition flex items-center space-x-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-500">Loading AI Agent logs...</div>
      ) : logs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-gray-800 text-center space-y-3">
          <Wrench className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No agent execution logs logged yet</h3>
          <p className="text-xs text-gray-400">
            Run a search in the <strong className="text-blue-400">AI Vehicle Finder</strong> to generate live execution trace logs.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/20 space-y-6">
              {/* Log Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-4 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white font-mono">
                      Log ID: #{log.id}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-2xl text-right">
                  <div className="text-xs font-bold">Recommended: {log.recommended_vehicle}</div>
                  <div className="text-[11px] font-semibold">Score: {log.compatibility_score}/100 • Total: ₹{log.estimated_cost?.toLocaleString()}</div>
                </div>
              </div>

              {/* Grid: User Request & Tools Selected */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Request */}
                <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>User Input Parameters</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Passengers: <strong className="text-white">{log.user_requirements?.passengers}</strong></div>
                    <div>Budget/Day: <strong className="text-white">₹{log.user_requirements?.budget_per_day}</strong></div>
                    <div>Trip Type: <strong className="text-white">{log.user_requirements?.trip_type}</strong></div>
                    <div>Distance: <strong className="text-white">{log.user_requirements?.travel_distance} km</strong></div>
                    <div>Vehicle Class: <strong className="text-white">{log.user_requirements?.vehicle_type}</strong></div>
                    <div>Fuel Pref: <strong className="text-white">{log.user_requirements?.fuel_preference}</strong></div>
                  </div>
                </div>

                {/* Tools Selected */}
                <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                    <Wrench className="w-3.5 h-3.5 text-purple-400" />
                    <span>Agent Tools Invoked ({log.tools_selected?.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {log.tools_selected?.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-[11px] font-mono flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Candidates Evaluated Matrix */}
              {log.candidates_summary && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                    <span>Candidates Evaluated ({log.candidates_summary.length} Vehicles Scored)</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                          <th className="p-2.5">Vehicle</th>
                          <th className="p-2.5">Compatibility Score</th>
                          <th className="p-2.5">Estimated Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.candidates_summary.map((c, idx) => (
                          <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="p-2.5 font-semibold text-white">{c.brand} {c.model}</td>
                            <td className="p-2.5 text-blue-400 font-bold">{c.score}/100</td>
                            <td className="p-2.5 text-emerald-400 font-semibold">₹{c.cost?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Gemini LLM Agent Rationale Summary */}
              <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini LLM Synthesized Rationale</span>
                </div>
                <p>{log.agent_summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
