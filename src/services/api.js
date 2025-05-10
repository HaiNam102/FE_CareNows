import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api';

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
    
    // Handle different error status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Đã hết truy cập,vui lòng đăng nhập lại');
        break;
      case 403:
        toast.error('Bạn không có quyền thực hiện hành động này');
        break;
      case 404:
        toast.error('Không tìm thấy dữ liệu');
        break;
      case 500:
        toast.error('Lỗi server, vui lòng thử lại sau');
        break;
      default:
        toast.error(message);
    }
    return Promise.reject(error);
  }
);

// Auth related APIs
export const authApi = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  refreshToken: () => {
    return api.post('/auth/refresh-token');
  }
};

// CareTaker related APIs
export const careTakerApi = {
  // Get all care takers with filters
  search: (params) => {
    return api.get('/careTaker/search', { params });
  },
  
  // Get care taker by ID
  getById: (id) => { 
    return api.get(`/careTaker/getCareTakerId/${id}`);
  },
  
  // Get care taker profile
  getProfile: () => {
    return api.get('/careTaker/profile');
  },
  
  // Update care taker profile
  updateProfile: (data) => {
    return api.put('/careTaker/profile', data);
  },
  
  // Get care taker reviews
  getReviews: (careTakerId) => {
    return api.get(`/careTakerFeedBack?careTaker_id=${careTakerId}`);
  },
  
  // Add review for care taker
  addReview: (careTakerId, reviewData) => {
    return api.post(`/careTakerFeedBack?careTaker_id=${careTakerId}`, reviewData);
  }
};

// Booking related APIs
export const bookingApi = {
  // Get all bookings for current customer
  getCustomerBookings: () => {
    return api.get('/booking/customer');
  },

  // Get booking by ID
  getBookingById: (id) => {
    return api.get(`/booking/${id}`);
  },

  // Create new booking
  createBooking: (bookingData, careTakerId) => {
    return api.post(`/booking?careTakerId=${careTakerId}`, bookingData);
  },

  // Update booking status
  updateBookingStatus: (bookingId, status) => {
    return api.put(`/booking/${bookingId}/status?status=${status}`);
  },

  // Get booked time slots for a care taker
  getBookedTimeSlots: (careTakerId, days) => {
    const daysParam = days.map(day => `days=${day}`).join('&');
    return api.get(`/booking/booked-slots/caretaker/${careTakerId}?${daysParam}`);
  },

  // Cancel booking
  cancelBooking: (bookingId) => {
    return api.put(`/booking/${bookingId}/cancel`);
  },

  // Get booking history
  getBookingHistory: (params) => {
    return api.get('/booking/history', { params });
  }
};

// Care Recipient related APIs
export const careRecipientApi = {
  // Get all care recipients for current user
  getAll: () => {
    return api.get('/careRecipient/customer');
  },

  // Get care recipient by ID
  getById: (id) => {
    return api.get(`/careRecipient/${id}`);
  },

  // Create new care recipient
  create: (data) => {
    return api.post('/careRecipient', data);
  },

  // Update care recipient
  update: (id, data) => {
    return api.put(`/careRecipient/${id}`, data);
  },

  // Delete care recipient
  delete: (id) => {
    return api.delete(`/careRecipient/${id}`);
  }
};

// Calendar related APIs
export const calendarApi = {
  // Get available dates for care taker
  getAvailableDates: (careTakerId) => {
    return api.get(`/calendar/caretaker/${careTakerId}`);
  },

  // Get schedule for specific date
  getSchedule: (careTakerId, date) => {
    return api.get(`/calendar/schedule/${careTakerId}`, {
      params: { date }
    });
  }
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user role
  getUserRole: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  },

  // Format API error message
  formatErrorMessage: (error) => {
    return error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
  }
};

// For testing purposes - remove in production
export const storeMockToken = () => {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'your_mock_token_here');
  }
};

export default api; 