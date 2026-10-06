import React from 'react';
import { 
  Bot, 
  Car, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  User, 
  LogOut, 
  Calendar, 
  Server,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, healthStatus, onOpenAuth }) {
  const { user, logout } = useAuth();
  const isOnline = healthStatus?.status === 'healthy';

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'finder', label: 'AI Vehicle Finder', icon: Sparkles, badge: 'AI Agent' },
    { id: 'fleet', label: 'Fleet Vehicles', icon: Car },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'activity', label: 'AI Agent Activity', icon: Wrench, badge: 'Demo' },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gradient">
              AI Vehicle Rental
            </h1>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              Gemini Agent • 6 Tools • College AI Project
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Health status badge */}
          <div 
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
            title="FastAPI Backend Connection Status"
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isOnline ? 'API /api/health' : 'Offline'}</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-2 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                {user.full_name ? user.full_name[0] : 'U'}
              </div>
              <span className="text-xs font-semibold text-gray-200 hidden md:block max-w-[100px] truncate">
                {user.full_name}
              </span>
              <button
                onClick={logout}
                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
