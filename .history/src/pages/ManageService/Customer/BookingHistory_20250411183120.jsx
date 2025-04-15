import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import MainLayout from '../../../layouts/MainLayout';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight, ArrowRight, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
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

const BookingDetailModal = ({ booking, onClose, onContact, onRehire }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return Math.round(diff);
  };

  const duration = calculateDuration(booking.time_to_start, booking.time_to_end);
  const serviceCharge = booking.careTaker?.service_price || 120000;
  const total = duration * serviceCharge;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto md:bg-black md:bg-opacity-50 md:p-4">
      <div className="bg-white w-full md:max-w-2xl md:rounded-lg md:mx-auto md:my-8">
        <div className="p-4 md:p-6">
          {/* Header with back button and order ID */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b">
            <button onClick={onClose} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Trở lại</span>
            </button>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Mã đơn hàng: {booking.booking_id}</span>
              <Badge className={`${getStatusConfig(booking.service_progress).color} text-white`}>
                {getStatusConfig(booking.service_progress).text}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Thông tin công việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin công việc</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#00A37D] mt-1 mr-3" />
                  <div className="space-y-2">
                    <div>Ngày làm việc: {formatDate(booking.created_at)}</div>
                    <div>Làm trong {duration} giờ ({booking.time_to_start} - {booking.time_to_end})</div>
                    <div>Loại dịch vụ: {booking.location_type === 'HOSPITAL' ? 'Chăm sóc tại bệnh viện' : 'Chăm sóc tại nhà'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vị trí làm việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Vị trí làm việc</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#00A37D] mt-1 mr-3" />
                  <div className="space-y-2">
                    <div className="font-semibold">{booking.place_name || "Bệnh viện Đa khoa Đà Nẵng"}</div>
                    <div>{booking.booking_address || "Đa khoa Đà Nẵng, 124 Hải Phòng, Thạch Trang"}</div>
                    <div>Người liên hệ: {booking.description_place || "Nhật Tân (+84) 899229928"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết công việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Chi tiết công việc</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p>{booking.job_description || "Bệnh nhân cần hỗ trợ tâm lý vì vừa phẫu thuật, cần kiên nhẫn, nhẹ nhàng..."}</p>
              </div>
            </div>

            {/* Thông tin người chăm sóc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin người chăm sóc</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <img 
                    src={booking.careTaker?.avatar || "/default-avatar.png"} 
                    alt={booking.careTaker?.name_of_care_taker || "Chưa có thông tin"} 
                    className="w-20 h-20 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{booking.careTaker?.name_of_care_taker || "Tố Uyên"}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Star className="w-4 h-4 text-[#00A37D] fill-current" />
                      <span className="ml-1 text-[#00A37D]">{booking.careTaker?.average_rating || 5}</span>
                      <span className="ml-1 text-gray-400">({booking.careTaker?.total_review || 20})</span>
                    </div>
                    <p className="text-gray-600 mt-1">{booking.careTaker?.experience_year || 5} năm kinh nghiệm</p>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <button 
                    onClick={() => onContact(booking.careTaker)}
                    className="border border-[#00A37D] text-[#00A37D] rounded-md py-2 px-4 hover:bg-[#00A37D]/5"
                  >
                    Liên hệ
                  </button>
                  <button 
                    onClick={() => onRehire(booking.careTaker)}
                    className="bg-[#00A37D] text-white rounded-md py-2 px-8 hover:bg-[#00A37D]/90"
                  >
                    Thuê lại
                  </button>
                </div>
              </div>
            </div>

            {/* Chi tiết thanh toán */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Chi tiết thanh toán</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Chi phí dịch vụ ({duration} giờ x {serviceCharge.toLocaleString()} VND)</span>
                    <span>{total.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí di chuyển</span>
                    <span>0</span>
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/booking/customer`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);

        if (response.data?.code && response.data?.data) {
          const bookingsData = response.data.data;
          const bookingsWithDetails = bookingsData.map(booking => ({
            booking_id: booking.id,
            created_at: booking.createdAt,
            service_progress: booking.status || 'PENDING',
            time_to_start: booking.timeToStart,
            time_to_end: booking.timeToEnd,
            place_name: booking.placeName,
            booking_address: booking.address,
            description_place: booking.descriptionPlace,
            job_description: booking.jobDescription,
            location_type: booking.locationType,
            careTaker: {
              name_of_care_taker: booking.careTaker?.name || 'Chưa có thông tin',
              email: booking.careTaker?.email,
              phone_number: booking.careTaker?.phone,
              introduce_yourself: booking.careTaker?.introduction,
              gender: booking.careTaker?.gender,
              district: booking.careTaker?.district,
              ward: booking.careTaker?.ward,
              workable_area: booking.careTaker?.workableArea,
              experience_year: booking.careTaker?.experienceYear,
              service_price: booking.price || 0,
              average_rating: booking.rating || 0,
              avatar: booking.careTaker?.avatar
            },
            careRecipient: {
              name: booking.careRecipient?.name || 'Chưa có thông tin',
              gender: booking.careRecipient?.gender,
              year_old: booking.careRecipient?.age,
              special_detail: booking.careRecipient?.specialDetail
            },
            bookingDays: booking.days?.map(day => ({
              day: day,
              booking_id: booking.id
            })) || []
          }));
          console.log('Transformed bookings:', bookingsWithDetails);
          setBookings(bookingsWithDetails);
        } else {
          console.error('Invalid response structure:', response.data);
          setError('Không thể tải danh sách đặt lịch. Dữ liệu không hợp lệ.');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        let errorMessage = 'Không thể tải danh sách đặt lịch. ';
        
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage += 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
              navigate('/login');
              break;
            case 403:
              errorMessage += 'Bạn không có quyền truy cập vào tài nguyên này.';
              break;
            case 404:
              errorMessage += 'Không tìm thấy dữ liệu.';
              break;
            case 500:
              errorMessage += 'Lỗi server. Vui lòng thử lại sau.';
              break;
            default:
              errorMessage += 'Vui lòng thử lại sau.';
          }
        } else if (error.request) {
          errorMessage += 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        } else {
          errorMessage += 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
  };

  const handleContact = (caretaker) => {
    console.log("Contacting caretaker:", caretaker);
    // Implement contact functionality
  };

  const handleRehire = (caretaker) => {
    console.log("Rehiring caretaker:", caretaker);
    // Redirect to booking page with pre-filled caretaker info
    navigate(`/booking?caretakerId=${caretaker.id}`);
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedCategory === "all") return true;
    return booking.service_progress === selectedCategory;
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-lg">Đang tải danh sách đặt lịch...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-lg text-red-500">{error}</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mt-4 mb-4 px-4">Xin chào Tan!</h1>
        
        {/* Tab navigation */}
        <div className="flex border-b">
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-3 font-medium ${
                selectedCategory === category.id 
                  ? 'bg-[#00A37D] text-white rounded-t-md' 
                  : 'text-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.booking_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Card header */}
                  <div className="p-4 border-b">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">
                          Ngày book đơn: {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Đơn hàng: #{booking.booking_id}
                        </div>
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                          booking.service_progress === 'COMPLETED' ? 'bg-[#11AA52] text-white' : 
                          booking.service_progress === 'DOING' ? 'bg-[#F7B928] text-white' :
                          booking.service_progress === 'CANCELLED' ? 'bg-[#FF4842] text-white' :
                          'bg-[#7F798F] text-white'
                        }`}>
                          {getStatusConfig(booking.service_progress).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="text-xl font-medium mb-1">
                        {booking.careTaker?.name_of_care_taker || "Chưa có thông tin"}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Star className="w-4 h-4 text-[#00A37D]" />
                        <span className="text-[#00A37D] ml-1">{booking.careTaker?.average_rating || 5}</span>
                        <span className="text-gray-400 ml-1">({booking.careTaker?.total_review || 20})</span>
                      </div>
                      <div className="text-gray-600 text-sm mb-2">
                        {booking.location_type === 'HOSPITAL' ? 'Chăm sóc tại bệnh viện' : 'Chăm sóc tại nhà'}
                      </div>
                      {booking.service_progress === 'COMPLETED' && (
                        <button className="text-[#00A37D] text-sm font-medium mb-2 hover:underline self-start">
                          Đánh giá ngay
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-4 border-t flex justify-between items-center">
                    <div className="text-[#00A37D] font-medium">
                      {(booking.careTaker?.service_price || 500000).toLocaleString()} VNĐ
                    </div>
                    <button
                      onClick={() => handleViewDetail(booking)}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      Xem chi tiết
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Không có đặt lịch nào trong danh mục này
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onContact={handleContact}
          onRehire={handleRehire}
        />
      )}
    </MainLayout>
  );
};

export default BookingHistory;