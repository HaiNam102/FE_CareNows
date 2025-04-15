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

// Mock data for demonstration
const mockBookings = [
  {
    id: 1234,
    dateBooking: "2025-03-10T10:00:00",
    dateJob: "Thứ hai, 10/3/2025",
    duration: 4,
    startTime: "14:00",
    endTime: "18:00",
    status: "COMPLETED",
    serviceType: "Chăm sóc tại bệnh viện",
    location: "Bệnh viện Đa khoa Đà Nẵng",
    address: "124 Hải Phòng, Thạch Trang",
    contactName: "Nhật Tân",
    contactPhone: "(+84) 899229928",
    jobDescription: "Bệnh nhân cần hỗ trợ tâm lý vì vừa phẫu thuật, cần kiên nhẫn, nhẹ nhàng...",
    pricePerHour: 120000,
    transportFee: 0,
    totalPrice: 480000,
    careTaker: {
      id: 101,
      fullName: "Tố Uyên",
      avatar: "https://i.pravatar.cc/300?img=1",
      rating: 5,
      ratingCount: 20,
      experience: "5 năm kinh nghiệm"
    }
  },
  {
    id: 1235,
    dateBooking: "2025-03-12T14:00:00",
    dateJob: "Thứ tư, 12/3/2025",
    duration: 6,
    startTime: "09:00",
    endTime: "15:00",
    status: "ONGOING",
    serviceType: "Chăm sóc tại nhà",
    location: "Nhà riêng",
    address: "15 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
    contactName: "Minh Tâm",
    contactPhone: "(+84) 905123456",
    jobDescription: "Chăm sóc người già (85 tuổi) sau phẫu thuật thay khớp háng. Hỗ trợ vận động, vệ sinh cá nhân và theo dõi thuốc.",
    pricePerHour: 130000,
    transportFee: 50000,
    totalPrice: 830000,
    careTaker: {
      id: 102,
      fullName: "Minh Anh",
      avatar: "https://i.pravatar.cc/300?img=5",
      rating: 4.8,
      ratingCount: 15,
      experience: "3 năm kinh nghiệm"
    }
  },
  {
    id: 1236,
    dateBooking: "2025-03-15T08:00:00",
    dateJob: "Thứ bảy, 15/3/2025",
    duration: 3,
    startTime: "13:00",
    endTime: "16:00",
    status: "CANCELLED",
    serviceType: "Chăm sóc tại bệnh viện",
    location: "Bệnh viện Hoàn Mỹ",
    address: "291 Nguyễn Văn Linh, Đà Nẵng",
    contactName: "Trần Văn Hùng",
    contactPhone: "(+84) 909876543",
    jobDescription: "Hỗ trợ chăm sóc trẻ 7 tuổi sau phẫu thuật ruột thừa. Theo dõi tình trạng, hỗ trợ ăn uống và vận động nhẹ.",
    pricePerHour: 120000,
    transportFee: 30000,
    totalPrice: 390000,
    careTaker: {
      id: 103,
      fullName: "Thu Hà",
      avatar: "https://i.pravatar.cc/300?img=9",
      rating: 4.9,
      ratingCount: 27,
      experience: "4 năm kinh nghiệm"
    }
  },
  {
    id: 1237,
    dateBooking: "2025-03-18T09:00:00",
    dateJob: "Thứ ba, 18/3/2025",
    duration: 5,
    startTime: "08:00",
    endTime: "13:00",
    status: "PENDING",
    serviceType: "Chăm sóc tại nhà",
    location: "Nhà riêng",
    address: "42 Lê Duẩn, Hải Châu, Đà Nẵng",
    contactName: "Nguyễn Thị Lan",
    contactPhone: "(+84) 903456789",
    jobDescription: "Chăm sóc sản phụ và em bé sơ sinh. Hỗ trợ công việc nhà, nấu ăn dinh dưỡng, và giúp mẹ chăm sóc bé.",
    pricePerHour: 150000,
    transportFee: 20000,
    totalPrice: 770000,
    careTaker: {
      id: 104,
      fullName: "Kim Anh",
      avatar: "https://i.pravatar.cc/300?img=3",
      rating: 5,
      ratingCount: 32,
      experience: "7 năm kinh nghiệm"
    }
  }
];

// Booking related API calls with mock implementation
export const bookingApi = {
  // Get all bookings for the current customer
  getCustomerBookings: () => {
    // Return a promise that resolves with mock data
    return Promise.resolve({
      data: {
        code: "200",
        message: "Get successful",
        data: mockBookings
      }
    });
  },
  
  // Get a specific booking by ID
  getBookingById: (id) => {
    // Find the booking with the specified ID
    const booking = mockBookings.find(b => b.id === Number(id));
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (booking) {
          resolve({
            data: {
              code: "200",
              message: "Get successful",
              data: booking
            }
          });
        } else {
          resolve({
            data: {
              code: "404",
              message: "Booking not found",
              data: null
            }
          });
        }
      }, 1000); // Simulate 1 second delay
    });
  },
  
  // Create a new booking
  createBooking: (data, careTakerId) => {
    // Just mock the response
    return Promise.resolve({
      data: {
        code: "201",
        message: "Add successful",
        data: {
          id: Math.floor(Math.random() * 1000) + 2000,
          ...data,
          status: "PENDING",
          careTakerId
        }
      }
    });
  },
  
  // Update booking status
  updateBookingStatus: (bookingId, status) => {
    return Promise.resolve({
      data: {
        code: "200",
        message: `Booking ${status} successfully!`,
        data: null
      }
    });
  },
  
  // Get booked time slots for a caretaker
  getBookedTimeSlots: (careTakerId, days) => {
    return Promise.resolve({
      data: {
        code: "200",
        message: "Get successful",
        data: []
      }
    });
  }
};

// Authentication related API calls
export const authApi = {
  login: (credentials) => {
    // Simulate successful login
    return Promise.resolve({
      data: {
        code: "200",
        message: "Login successful",
        data: {
          accessToken: "mock-jwt-token-123456",
          user: {
            id: 1,
            username: "customer",
            email: "customer@example.com",
            role: "CUSTOMER"
          }
        }
      }
    });
  },
  register: (userData) => {
    return Promise.resolve({
      data: {
        code: "201",
        message: "Register successful",
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          ...userData
        }
      }
    });
  },
};

// Helper function to store a mock token
export const storeMockToken = () => {
  localStorage.setItem('accessToken', 'mock-jwt-token-123456');
};

export default api; 