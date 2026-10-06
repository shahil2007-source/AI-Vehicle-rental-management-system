import axios from 'axios';

// Support both local development (http://localhost:8000/api or Vite proxy) and production (/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health Check API
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health check failed:', error);
    return { status: 'offline', error: error.message };
  }
};

// Vehicles API
export const fetchVehicles = async (category) => {
  const params = category ? { category } : {};
  const response = await api.get('/vehicles', { params });
  return response.data;
};

export default api;
