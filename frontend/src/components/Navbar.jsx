import React, { useState } from 'react';
import { Bot, Car, LayoutDashboard, Shield, Menu, X, LogIn, LogOut, UserCheck, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'ai-finder', label: 'AI Finder', icon: Bot, badge: 'Agent' },
    { id: 'vehicles', label: 'Fleet Vehicles', icon: Car },
    { id: 'architecture', label: 'AI Architecture', icon: Cpu },
  ];

  if (user) {
    navItems.push({ id: 'user-dashboard', label: 'My Bookings', icon: LayoutDashboard });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin-dashboard', label: 'Admin Portal', icon: Shield, highlight: true });
  }

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-outfit">
                  VRM <span className="text-blue-500">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Agent v2.4
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium hidden sm:block">
                AI Vehicle Rental Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-2xl border border-gray-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                      : item.highlight
                      ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth & User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-gray-900 px-3.5 py-2 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-200">{user.name}</div>
                    <div className="text-[10px] text-gray-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-900 border border-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold ${
                currentPage === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          {!user ? (
            <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
              <button
                onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
                className="w-full py-3 text-center bg-gray-900 rounded-xl font-medium text-gray-200"
              >
                Sign In
              </button>
              <button
                onClick={() => { setCurrentPage('register'); setMobileMenuOpen(false); }}
                className="w-full py-3 text-center btn-primary rounded-xl font-semibold text-white"
              >
                Register Account
              </button>
            </div>
          ) : (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full py-3 text-center bg-rose-950/40 text-rose-300 border border-rose-800/50 rounded-xl font-semibold"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
