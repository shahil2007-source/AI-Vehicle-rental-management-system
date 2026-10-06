import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatDrawer from './components/AIChatDrawer';

import HomePage from './pages/HomePage';
import AIFinderPage from './pages/AIFinderPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BookingPage from './pages/BookingPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ArchitecturePage from './pages/ArchitecturePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [finderPreset, setFinderPreset] = useState(null);
  const [bookingPreset, setBookingPreset] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            setSelectedVehicle={setSelectedVehicle}
            setSelectedFinderPreset={setFinderPreset}
          />
        );
      case 'ai-finder':
        return (
          <AIFinderPage
            setCurrentPage={setCurrentPage}
            setSelectedVehicle={setSelectedVehicle}
            setBookingPreset={setBookingPreset}
            initialPreset={finderPreset}
          />
        );
      case 'vehicles':
        return (
          <VehiclesPage
            setCurrentPage={setCurrentPage}
            setSelectedVehicle={setSelectedVehicle}
          />
        );
      case 'vehicle-detail':
        return (
          <VehicleDetailPage
            vehicle={selectedVehicle}
            setCurrentPage={setCurrentPage}
            setSelectedVehicle={setSelectedVehicle}
            onOpenAIChat={(v) => setSelectedVehicle(v)}
          />
        );
      case 'booking':
        return (
          <BookingPage
            selectedVehicle={selectedVehicle}
            setCurrentPage={setCurrentPage}
            bookingPreset={bookingPreset}
          />
        );
      case 'user-dashboard':
        return <UserDashboardPage setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            setSelectedVehicle={setSelectedVehicle}
            setSelectedFinderPreset={setFinderPreset}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white">
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          
          <main className="flex-1">
            {renderPage()}
          </main>

          <AIChatDrawer selectedVehicle={selectedVehicle} />

          <Footer setCurrentPage={setCurrentPage} />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
