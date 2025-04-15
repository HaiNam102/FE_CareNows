import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import MainLayout from '../../../layouts/MainLayout';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight, ArrowRight, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import BookingDetail from './BookingDetail';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Navigation categories
const categories = [
  { id: "all", label: "Tất cả" },
  { id: "DOING", label: "Đang thực hiện" },
  { id: "COMPLETED", label: "Đã hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" }
];

const getStatusConfig = (status) => {
  const configs = {
    COMPLETED: {
      color: "bg-[#11AA52]",
      text: "Đã hoàn thành"
    },
    DOING: {
      color: "bg-[#F7B928]",
      text: "Đang thực hiện"
    },
    CANCELLED: {
      color: "bg-[#FF4842]",
      text: "Đã hủy"
    },
    PENDING: {
      color: "bg-[#7F798F]",
      text: "Đang chờ"
    }
  };
  return configs[status] || { color: "bg-gray-500", text: status };
};

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return Math.round(diff);
  };

  const duration = calculateDuration(booking.time_to_start, booking.time_to_end);
  const hourlyRate = 120000; // Giả sử rate cố định
  const serviceCharge = duration * hourlyRate;
  const transportFee = 0; // Giả sử phí di chuyển
  const total = serviceCharge + transportFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Trở lại</span>
            </button>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Mã đơn hàng: {booking.booking_id}</span>
              <Badge className={`${getStatusConfig(booking.service_progress).color}`}>
                {getStatusConfig(booking.service_progress).text}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Thông tin công việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin công việc</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#00A37D] mt-1 mr-3" />
                  <div>
                    <div>Ngày làm việc: {formatDate(booking.created_at)}</div>
                    <div>Làm trong {duration} giờ, {booking.time_to_start} đến {booking.time_to_end}</div>
                    <div>Loại dịch vụ: {booking.location_type === 'HOSPITAL' ? 'Chăm sóc tại bệnh viện' : 'Chăm sóc tại nhà'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vị trí làm việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Vị trí làm việc</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#00A37D] mt-1 mr-3" />
                  <div>
                    <div className="font-semibold">{booking.place_name}</div>
                    <div>{booking.booking_address}</div>
                    <div>Người liên hệ: {booking.description_place}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết công việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Chi tiết công việc</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p>{booking.job_description}</p>
              </div>
            </div>

            {/* Chi tiết thanh toán */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Chi tiết thanh toán</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chi phí dịch vụ ({duration} giờ x {hourlyRate.toLocaleString()} VND)</span>
                    <span>{serviceCharge.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí di chuyển</span>
                    <span>{transportFee.toLocaleString()} VND</span>
                  </div>
                  <div className="h-[1px] bg-gray-300 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span>Tổng</span>
                    <span>{total.toLocaleString()} VND</span>
                  </div>
                </div>
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/booking/customer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data?.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
  };

  const filteredBookings = activeCategory === "all" 
    ? bookings 
    : bookings.filter(booking => booking.service_progress === activeCategory);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Đang tải danh sách đặt lịch...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </MainLayout>
    );
  }

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

            {/* Booking Cards */}
            <div className="grid grid-cols-2 gap-6 mb-[400px]">
              {filteredBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.service_progress);
                return (
                  <div
                    key={booking.booking_id}
                    className="relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() => handleViewDetail(booking)}
                  >
                    <Card className="w-full bg-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                      <CardHeader className="px-6 py-1">
                        <div className="flex items-center justify-between">
                          <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-black text-[20px] leading-[26.3px] pt-2">
                            Ngày book đơn: {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                          </div>
                          <Badge className={`${statusConfig.color} text-white [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[13px] leading-[26.3px] mt-2`}>
                            {statusConfig.text}
                          </Badge>
                        </div>
                        <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[13px] leading-[26.3px] mt-1">
                          Đơn hàng: {booking.booking_id}
                        </div>
                        <div className="h-[0.75px] bg-[#006B52]/10 -mx-6 mt-4 mb-6" />
                      </CardHeader>

                      <CardContent className="px-6">
                        <div className="flex items-start gap-6 pt-8">
                          <div
                            className="w-[130px] h-[130px] bg-cover bg-center rounded-full flex-shrink-0"
                            style={{ backgroundImage: `url(${booking.careTaker?.avatar || 'https://i.pravatar.cc/300'})` }}
                          />
                          <div className="flex flex-col items-start gap-3 flex-1">
                            <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-black text-[26px] leading-[32px]">
                              {booking.place_name || 'Chưa có thông tin'}
                            </div>
                            <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[15px] leading-[26.3px]">
                              <div className="mb-2">
                                <strong>Địa chỉ:</strong> {booking.booking_address}
                              </div>
                              <div className="mb-2">
                                <strong>Thời gian:</strong> {booking.time_to_start} - {booking.time_to_end}
                              </div>
                              <div className="mb-2">
                                <strong>Loại địa điểm:</strong> {booking.location_type === 'HOSPITAL' ? 'Bệnh viện' : 'Tại nhà'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col px-6 pb-2.5">
                        <div className="h-[1px] w-[calc(100%+48px)] bg-[#006B52] opacity-100 -mx-6 mb-4" />
                        <div className="flex items-center justify-between w-full group hover:translate-x-1 transition-transform duration-200 cursor-pointer">
                          <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#006B52] text-[13px] leading-[26.3px]">
                            Xem chi tiết
                          </div>
                          <ArrowRight className="w-[21px] h-[21px] text-[#006B52] stroke-[1.5] transition-transform duration-200" />
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </MainLayout>
  );
};

export default BookingHistory; 