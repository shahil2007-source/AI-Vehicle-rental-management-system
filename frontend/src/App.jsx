import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import AIVehicleFinder from './pages/AIVehicleFinder';
import FleetVehicles from './pages/FleetVehicles';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AIAgentActivity from './pages/AIAgentActivity';
import { AuthProvider } from './context/AuthContext';
import { checkHealth } from './services/api';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [healthStatus, setHealthStatus] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCost, setSelectedCost] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    checkHealth().then((res) => setHealthStatus(res));
  }, []);

  const handleSelectBooking = (vehicle, cost = 0) => {
    setSelectedVehicle(vehicle);
    setSelectedCost(cost);
    setActiveTab('booking_form');
  };

  const handleCompleteBooking = () => {
    setActiveTab('bookings');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans flex flex-col">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthStatus={healthStatus}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
        {activeTab === 'finder' && <AIVehicleFinder onSelectBooking={handleSelectBooking} />}
        {activeTab === 'fleet' && <FleetVehicles onSelectBooking={handleSelectBooking} />}
        {activeTab === 'booking_form' && (
          <BookingPage
            vehicle={selectedVehicle}
            estimatedCost={selectedCost}
            onCompleteBooking={handleCompleteBooking}
          />
        )}
        {activeTab === 'bookings' && <MyBookings onNavigate={setActiveTab} />}
        {activeTab === 'activity' && <AIAgentActivity />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Footer */}
      <footer className="glass-panel border-t border-gray-800 px-6 py-4 mt-auto text-center text-xs text-gray-500">
        AI Vehicle Rental Management System • Fundamentals of AI Project • Deployed on Vercel
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
