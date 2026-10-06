import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

// Vehicles
export const fetchVehicles = async (params = {}) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

export const fetchVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

// AI Agent
export const getAIRecommendation = async (requirements) => {
  const response = await api.post('/ai/recommend', requirements);
  return response.data;
};

export const sendAIChat = async (message) => {
  const response = await api.post('/ai/chat', { message });
  return response.data;
};

// Bookings
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const fetchUserBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

// Admin & Agent Logs
export const fetchAdminStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const fetchAgentLogs = async () => {
  const response = await api.get('/admin/agent-logs');
  return response.data;
};

// Auth
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export default api;
