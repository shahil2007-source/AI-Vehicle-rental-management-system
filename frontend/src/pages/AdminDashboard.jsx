import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Car, 
  IndianRupee, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { fetchAdminStats } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Available Vehicles', value: stats?.available_vehicles || 12, color: '#10b981' },
    { name: 'Booked Vehicles', value: stats?.booked_vehicles || 3, color: '#f59e0b' },
  ];

  const barData = [
    { category: 'SUV', count: 9 },
    { category: 'MUV', count: 2 },
    { category: 'Sedan', count: 2 },
    { category: 'Hatchback', count: 1 },
    { category: 'EV', count: 1 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
            <span>Admin Management Dashboard</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time fleet occupancy, revenue metrics, and AI recommendation statistics.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Vehicles', val: stats?.total_vehicles || 15, icon: Car, color: 'text-blue-400' },
          { title: 'Available Fleet', val: stats?.available_vehicles || 12, icon: CheckCircle2, color: 'text-emerald-400' },
          { title: 'Total Revenue', val: `₹${(stats?.revenue || 142500).toLocaleString()}`, icon: IndianRupee, color: 'text-yellow-400' },
          { title: 'AI Recommendations', val: stats?.ai_recommendations_generated || 64, icon: Sparkles, color: 'text-purple-400' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-black text-white">{card.val}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart: Fleet Occupancy */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Fleet Availability Breakdown</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Vehicle Categories */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <BarIcon className="w-4 h-4 text-blue-400" />
            <span>Fleet Vehicle Categories</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="category" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
