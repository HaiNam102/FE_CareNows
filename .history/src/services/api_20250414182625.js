import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  }
};

// For testing purposes - remove in production
export const storeMockToken = () => {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'your_mock_token_here');
  }
}; 