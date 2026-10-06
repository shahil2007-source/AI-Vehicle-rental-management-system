import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT Token interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vrm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleService = {
  getVehicles: (params) => API.get('/vehicles', { params }),
  getVehicleById: (id) => API.get(`/vehicles/${id}`),
  createVehicle: (data) => API.post('/vehicles', data),
  updateVehicle: (id, data) => API.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => API.delete(`/vehicles/${id}`),
};

export const bookingService = {
  createBooking: (data) => API.post('/bookings', data),
  getUserBookings: (email) => API.get('/bookings', { params: { email } }),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => API.put(`/bookings/${id}/status`, null, { params: { status } }),
};

export const aiService = {
  findRecommendation: (data) => API.post('/ai/recommend', data),
  chat: (message, selectedVehicleId = null) => API.post('/ai/chat', { message, selectedVehicleId }),
};

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const adminService = {
  getStats: () => API.get('/admin/dashboard-stats'),
};

export default API;
