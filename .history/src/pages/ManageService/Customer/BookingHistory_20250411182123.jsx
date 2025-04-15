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
  const serviceCharge = booking.careTaker?.service_price || 120000;
  const total = duration * serviceCharge;

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
            {/* Thông tin người chăm sóc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin người chăm sóc</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Tên:</p>
                    <p>{booking.careTaker?.name_of_care_taker}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Số điện thoại:</p>
                    <p>{booking.careTaker?.phone_number}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{booking.careTaker?.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Kinh nghiệm:</p>
                    <p>{booking.careTaker?.experience_year} năm</p>
                  </div>
                  <div>
                    <p className="font-semibold">Khu vực làm việc:</p>
                    <p>{booking.careTaker?.workable_area}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Đánh giá:</p>
                    <p>{booking.careTaker?.average_rating}/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin người được chăm sóc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin người được chăm sóc</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Tên:</p>
                    <p>{booking.careRecipient?.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Giới tính:</p>
                    <p>{booking.careRecipient?.gender}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tuổi:</p>
                    <p>{booking.careRecipient?.year_old}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Ghi chú đặc biệt:</p>
                    <p>{booking.careRecipient?.special_detail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin công việc */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin công việc</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#00A37D] mt-1 mr-3" />
                  <div>
                    <div>Ngày làm việc: {formatDate(booking.created_at)}</div>
                    <div>Làm trong {duration} giờ ({booking.time_to_start} - {booking.time_to_end})</div>
                    <div>Loại dịch vụ: {booking.location_type === 'HOSPITAL' ? 'Chăm sóc tại bệnh viện' : 'Chăm sóc tại nhà'}</div>
                    {booking.days && booking.days.length > 0 && (
                      <div>
                        <p className="font-semibold mt-2">Các ngày làm việc:</p>
                        <ul className="list-disc list-inside">
                          {booking.days.map((day, index) => (
                            <li key={index}>{formatDate(day.day)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    <span>Chi phí dịch vụ ({duration} giờ x {serviceCharge.toLocaleString()} VND)</span>
                    <span>{total.toLocaleString()} VND</span>
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
  const [loading, setLoading] = useState(true);
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

        if (response.data?.code === 1010 && response.data?.data) {
          const bookingsData = response.data.data;
          const bookingsWithDetails = bookingsData.map(booking => ({
            booking_id: booking.bookingId,
            created_at: booking.createdAt,
            service_progress: booking.serviceProgress || 'PENDING',
            time_to_start: booking.timeToStart,
            time_to_end: booking.timeToEnd,
            place_name: booking.placeName,
            booking_address: booking.bookingAddress,
            description_place: booking.descriptionPlace,
            job_description: booking.jobDescription,
            location_type: booking.locationType,
            careTaker: {
              name_of_care_taker: booking.careTakerName,
              email: booking.careTakerEmail,
              phone_number: booking.careTakerPhone,
              introduce_yourself: booking.careTakerIntroduction,
              gender: booking.careTakerGender,
              district: booking.careTakerDistrict,
              ward: booking.careTakerWard,
              workable_area: booking.careTakerWorkableArea,
              experience_year: booking.careTakerExperienceYear,
              service_price: booking.price,
              average_rating: booking.rating || 0,
              avatar: booking.careTakerAvatar
            },
            careRecipient: {
              name: booking.careRecipientName,
              gender: booking.careRecipientGender,
              year_old: booking.careRecipientAge,
              special_detail: booking.specialDetail
            },
            days: booking.days || []
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

  const filteredBookings = bookings.filter(booking => {
    if (selectedCategory === "all") return true;
    return booking.service_progress === selectedCategory;
  });

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Xin chào Tan!</h1>

            {/* Navigation Categories */}
            <div className="flex space-x-4 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-[#00A37D] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Booking Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
              {filteredBookings.map((booking) => (
                <div key={booking.booking_id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-medium mb-1">
                        Ngày book đơn: {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-gray-500">
                        Đơn hàng: #{booking.booking_id}
                      </div>
                    </div>
                    <Badge className={`${getStatusConfig(booking.service_progress).color} text-white`}>
                      {getStatusConfig(booking.service_progress).text}
                    </Badge>
                  </div>

                  <div className="flex items-start space-x-6">
                    <img
                      src={booking.careTaker?.avatar || '/default-avatar.png'}
                      alt={booking.careTaker?.name_of_care_taker}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">
                        {booking.careTaker?.name_of_care_taker || "Chưa có thông tin"}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Star className="w-5 h-5 text-[#00A37D] fill-current" />
                        <span className="ml-1">{booking.careTaker?.average_rating || 5}</span>
                        <span className="ml-1 text-gray-400">({booking.careTaker?.total_review || 20})</span>
                      </div>
                      <div className="text-gray-600 mb-4">
                        {booking.location_type === 'HOSPITAL' ? 'Chăm sóc tại bệnh viện' : 'Chăm sóc tại nhà'}
                      </div>
                      {booking.service_progress === 'COMPLETED' && (
                        <button className="text-[#00A37D] font-medium hover:underline">
                          Đánh giá ngay
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-[#00A37D] font-medium">
                      {booking.total_price?.toLocaleString() || '500.000'} VNĐ
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
              ))}
            </div>
          </div>
        </div>
      </div>
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