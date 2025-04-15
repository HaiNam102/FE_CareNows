import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized error (could be expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login or refresh token logic could be added here
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Booking related API calls
export const bookingApi = {
  // Get all bookings for the current customer
  getCustomerBookings: () => api.get('/booking/customer'),
  
  // Get a specific booking by ID
  getBookingById: (id) => api.get(`/booking/${id}`),
  
  // Create a new booking
  createBooking: (data, careTakerId) => 
    api.post(`/booking?careTakerId=${careTakerId}`, data),
  
  // Update booking status
  updateBookingStatus: (bookingId, status) => 
    api.put(`/booking/${bookingId}/status?status=${status}`),
  
  // Get booked time slots for a caretaker
  getBookedTimeSlots: (careTakerId, days) => {
    // Convert array of dates to query string format
    const daysParam = days.map(day => `days=${day.toISOString().split('T')[0]}`).join('&');
    return api.get(`/booking/booked-slots/caretaker/${careTakerId}?${daysParam}`);
  }
};

// Authentication related API calls
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api; 