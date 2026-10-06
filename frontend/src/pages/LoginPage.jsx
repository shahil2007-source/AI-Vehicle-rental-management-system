import React, { useState } from 'react';
import { Bot, LogIn, ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ setCurrentPage }) {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      login(res.data.access_token, res.data.user);
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');
      if (res.data.user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('user-dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.detail || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 mx-auto">
            <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">Sign In to VRM AI</h2>
          <p className="text-xs text-gray-400">Access your bookings and AI recommendation history</p>
        </div>

        {/* Demo Login Quick Fill Banner */}
        <div className="p-3.5 rounded-2xl bg-gray-900 border border-blue-500/20 text-xs space-y-2">
          <div className="font-bold text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user@vrm.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 text-gray-200 border border-gray-800 font-medium text-left truncate"
            >
              👤 Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('tshahil2007@gmail.com', 'admin')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 font-medium text-left truncate"
            >
              🛡️ Admin (tshahil2007)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@vrm.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          Don't have an account?{' '}
          <button onClick={() => setCurrentPage('register')} className="text-blue-400 font-bold hover:underline">
            Register Here
          </button>
        </div>

      </div>
    </div>
  );
}
