import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import MainLayout from '../../../layouts/MainLayout';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight, ArrowRight, X } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// API service
const bookingApi = {
  getCustomerBookings: () => {
    return axios.get(`${API_URL}/booking/customer`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  getBookingById: (id) => {
    return axios.get(`${API_URL}/booking/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  updateBookingStatus: (bookingId, status) => {
    return axios.put(`${API_URL}/booking/${bookingId}/status?status=${status}`, null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

// For testing purposes - remove in production
const storeMockToken = () => {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'your_mock_token_here');
  }
};

// Navigation categories
const categories = [
  { id: "all", label: "Tất cả" },
  { id: "doing", label: "Đang thực hiện" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "cancelled", label: "Đã hủy" }
];

const getStatusConfig = (status) => {
  const configs = {
    COMPLETED: {
      color: "bg-[#11AA52]",
      text: "Đã hoàn thành" 
    },
    ONGOING: {
      color: "bg-[#F7B928]",
      text: "Đang thực hiện"
    },
    CANCELLED: {
      color: "bg-[#FF4842]",
      text: "Đã hủy"
    },
    PENDING: {
      color: "bg-[#2196F3]",
      text: "Chờ xác nhận"
    }
  };
  return configs[status] || { color: "bg-gray-500", text: status };
};

// Modal component for booking details
const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  // Show loading spinner if the booking details are being fetched
  if (booking.isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button onClick={onClose} className="mr-4">
                <X className="h-5 w-5 text-gray-500" />
              </button>
              <h3 className="text-lg font-medium">Mã đơn hàng: #{booking.bookingId}</h3>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Format dates array to string
  const formatDates = (dates) => {
    if (!dates || !Array.isArray(dates)) return '';
    return dates.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={onClose} className="mr-4">
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-medium">Mã đơn hàng: #{booking.bookingId}</h3>
          </div>
          <Badge className={`${getStatusConfig(booking.serviceProgress).color} text-white`}>
            {getStatusConfig(booking.serviceProgress).text}
          </Badge>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin công việc */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-['SVN-Gilroy']">Thông tin công việc</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#11AA52]/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#11AA52]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <p className="text-gray-900">Ngày làm việc: {formatDates(booking.days)}</p>
                <p className="text-gray-900">Thời gian: {booking.timeToStart} - {booking.timeToEnd}</p>
                <p className="text-gray-900">Tên cơ sở: {booking.placeName}</p>
                <p className="text-gray-900">Mô tả: {booking.jobDescription}</p>
              </div>
            </div>
          </div>
          
          {/* Vị trí làm việc */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-['SVN-Gilroy']">Vị trí làm việc</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#11AA52]/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#11AA52]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <p className="text-gray-900">Địa chỉ: {booking.bookingAddress}</p>
                <p className="text-gray-600">Chi tiết: {booking.descriptionPlace}</p>
                <p className="text-gray-900 mt-2">Loại địa điểm: {booking.locationType === 'HOSPITAL' ? 'Bệnh viện' : 'Tại nhà'}</p>
                <p className="text-gray-900">Người liên hệ: {booking.customerName}</p>
              </div>
            </div>
          </div>
          
          {/* Thông tin người chăm sóc */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-['SVN-Gilroy']">Thông tin người chăm sóc</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
              <img 
                src={booking.careTakerAvatar || "https://i.pravatar.cc/300?img=1"} 
                alt={booking.careTakerName} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold">{booking.careTakerName}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-[#00A86B] fill-[#00A86B]" />
                  <span className="text-[#00A86B] font-semibold">{booking.rating}</span>
                  <span className="text-gray-500">({booking.toltalReviewers || 0})</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 border border-[#00A86B] text-[#00A86B] rounded-lg hover:bg-[#00A86B] hover:text-white transition-colors">
                    Liên hệ
                  </button>
                  {booking.serviceProgress === "COMPLETED" && (
                    <button className="px-4 py-2 bg-[#00A86B] text-white rounded-lg hover:bg-[#008F5D] transition-colors">
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Chi tiết thanh toán */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-['SVN-Gilroy']">Chi tiết thanh toán</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Chi phí dịch vụ</span>
                <span className="text-gray-900">{booking.servicePrice?.toLocaleString() || "0"} VND</span>
              </div>
              <div className="h-[1px] bg-gray-200 my-2"></div>
              <div className="flex justify-between py-2">
                <span className="text-gray-900 font-semibold">Tổng cộng</span>
                <span className="text-[#00A86B] font-semibold text-xl">{booking.servicePrice?.toLocaleString() || "0"} VND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Store a mock token for testing without a real backend
  useEffect(() => {
    // This is only for demonstration purposes
    // In a real app, this would come from the authentication flow
    storeMockToken();
  }, []);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getCustomerBookings();
        if (response.data && response.data.data) {
          setBookings(response.data.data);
        } else {
          setError('Failed to load booking data');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 401) {
            setError('Please log in to view your bookings');
          } else {
            setError(`Server error: ${err.response.data?.message || 'Unknown error'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('Error setting up request. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on active category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredBookings(bookings);
    } else {
      // Map our UI category names to backend status values
      const statusMap = {
        "doing": ["ONGOING", "PENDING"],
        "completed": ["COMPLETED"],
        "cancelled": ["CANCELLED"]
      };
      
      const filtered = bookings.filter(booking => {
        const validStatuses = statusMap[activeCategory];
        return validStatuses ? validStatuses.includes(booking.serviceProgress) : false;
      });
      setFilteredBookings(filtered);
    }
  }, [activeCategory, bookings]);

  const handleViewDetail = async (booking) => {
    try {
      setSelectedBooking({ ...booking, isLoading: true });
      const response = await bookingApi.getBookingById(booking.bookingId);
      if (response.data && response.data.data) {
        setSelectedBooking({
          ...response.data.data,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      
      // Enhanced error handling
      if (error.response && error.response.status === 404) {
        // Handle not found case
        alert('Booking not found. It may have been deleted.');
        setSelectedBooking(null);
      } else {
        // For other errors, still show whatever data we have
        setSelectedBooking({
          ...booking, 
          loadError: true, 
          errorMessage: error.response?.data?.message || 'Failed to load complete details'
        });
      }
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex">
          <div className="w-[280px] flex-shrink-0 pt-8">
            <div className="w-[285px]">
              <div>
                <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào Tan!</h2>
                <div className="h-[1px] bg-gray-200 w-full"></div>
              </div>
              <nav className="mt-4">
                <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/profile" data-discover="true">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
                </a>
                <a className="flex items-center h-[40px] px-4 relative text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]" href="/customer/booking-history" data-discover="true">
                  <span className="mr-3 ml-[-2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
                </a>
                <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records" data-discover="true">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
                </a>
                <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records-list" data-discover="true">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard-list">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <path d="M12 11h4"></path>
                      <path d="M12 16h4"></path>
                      <path d="M8 11h.01"></path>
                      <path d="M8 16h.01"></path>
                    </svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
                </a>
              </nav>
              <div className="px-4 mt-4">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out mr-3">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                  </svg>
                  <span className="font-['SVN-Gilroy']">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 pl-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center w-full mb-8">
              <div className="bg-white rounded-lg inline-flex">
                <div className="flex items-center px-[10px] py-[6px]">
                  {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      <button
                        className={`whitespace-nowrap rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? 'bg-[#00A86B] text-white px-6 py-2'
                            : 'text-gray-400'
                        } font-['SVN-Gilroy'] text-base`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.label}
                      </button>
                      {index < categories.length - 1 && <div className="w-[161px]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading, Error or Booking Cards */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-12 rounded-lg text-center">
                <div className="text-[#00A86B] mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-1">Không có lịch chăm sóc nào</h3>
                <p className="text-gray-500 mb-4">Bạn chưa có lịch chăm sóc nào trong danh mục này</p>
                <button 
                  className="bg-[#00A86B] text-white px-6 py-2 rounded-lg hover:bg-[#008F5D] transition-colors"
                  onClick={() => navigate('/services')}
                >
                  Đặt lịch ngay
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-6 mb-[400px]">
                {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => handleViewDetail(booking)}
                >
                  <Card className="w-full bg-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="px-6 py-1">
                      <div className="flex items-center justify-between">
                        <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-black text-[20px] leading-[26.3px] pt-2">
                            Ngày book đơn: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          <Badge className={`${getStatusConfig(booking.serviceProgress).color} text-white [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[13px] leading-[26.3px] mt-2`}>
                            {getStatusConfig(booking.serviceProgress).text}
                          </Badge>
                      </div>
                      <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[13px] leading-[26.3px] mt-1">
                          Đơn hàng: #{booking.bookingId}
                      </div>
                      <div className="h-[0.75px] bg-[#006B52]/10 -mx-6 mt-4 mb-6" />
                    </CardHeader>

                    <CardContent className="px-6">
                      <div className="flex items-start gap-6 pt-8">
                        <div
                          className="w-[130px] h-[130px] bg-cover bg-center rounded-full flex-shrink-0"
                            style={{ backgroundImage: `url(${booking.careTakerAvatar || "https://i.pravatar.cc/300?img=1"})` }}
                        />
                        <div className="flex flex-col items-start gap-3 flex-1">
                          <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-black text-[26px] leading-[32px]">
                              {booking.careTakerName}
                          </div>
                          <div className="flex items-center gap-2 self-stretch">
                            <Star className="w-[18px] h-[18px] text-[#00a37d] fill-[#00a37d]" />
                            <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-[16px] leading-[19px]">
                                <span className="text-[#00a37d]">{booking.rating}</span>
                              <span className="text-[#111111]">&nbsp;</span>
                                <span className="text-[#bcb9c5]">({booking.toltalReviewers})</span>
                              </div>
                          </div>
                          <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[15px] leading-[26.3px]">
                              Chăm sóc tại {booking.locationType === 'HOSPITAL' ? 'bệnh viện' : 'nhà'}
                          </div>
                            {booking.serviceProgress === "COMPLETED" && (
                          <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#008666] text-[15px] leading-[26.3px] underline cursor-pointer hover:text-[#00a37d]">
                            Đánh giá ngay
                          </div>
                            )}
                          <div className="self-stretch text-right [font-family:'SVN-Gilroy-SemiBold',Helvetica] text-[#00a37d] text-[24px] font-semibold mt-1">
                              {booking.totalPrice?.toLocaleString() || "480.000"} VND
                            </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col px-6 pb-2.5">
                      <div className="h-[1px] w-[calc(100%+48px)] bg-[#006B52] opacity-100 -mx-6 mb-4" />
                      <div 
                        className="flex items-center justify-between w-full group hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                      >
                        <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#006B52] text-[13px] leading-[26.3px]">
                          Xem chi tiết
                        </div>
                        <ArrowRight className="w-[21px] h-[21px] text-[#006B52] stroke-[1.5] transition-transform duration-200" />
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for booking details */}
      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking}
          onClose={closeModal}
        />
      )}
    </MainLayout>
  );
};

export default BookingHistory; 