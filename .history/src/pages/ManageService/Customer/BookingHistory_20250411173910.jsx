import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import MainLayout from '../../../layouts/MainLayout';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight, ArrowRight } from 'lucide-react';
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
    }
  };
  return configs[status] || { color: "bg-gray-500", text: status };
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    navigate(`/customer/booking/${booking.id}`, { 
      state: booking
    });
  };

  const filteredBookings = activeCategory === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === activeCategory);

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
                const statusConfig = getStatusConfig(booking.status);
                return (
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
                          <Badge className={`${statusConfig.color} text-white [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[13px] leading-[26.3px] mt-2`}>
                            {statusConfig.text}
                          </Badge>
                        </div>
                        <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[13px] leading-[26.3px] mt-1">
                          Đơn hàng: {booking.id}
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
                              {booking.careTaker?.name || 'Chưa có thông tin'}
                            </div>
                            <div className="flex items-center gap-2 self-stretch">
                              <Star className="w-[18px] h-[18px] text-[#00a37d] fill-[#00a37d]" />
                              <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-[16px] leading-[19px]">
                                <span className="text-[#00a37d]">{booking.careTaker?.rating || 0}</span>
                                <span className="text-[#111111]">&nbsp;</span>
                                <span className="text-[#bcb9c5]">({booking.careTaker?.ratingCount || 0})</span>
                              </div>
                            </div>
                            <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[15px] leading-[26.3px]">
                              {booking.service?.name || 'Chưa có thông tin'}
                            </div>
                            {booking.status === 'COMPLETED' && (
                              <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#008666] text-[15px] leading-[26.3px] underline cursor-pointer hover:text-[#00a37d]">
                                Đánh giá ngay
                              </div>
                            )}
                            <div className="self-stretch text-right [font-family:'SVN-Gilroy-SemiBold',Helvetica] text-[#00a37d] text-[24px] font-semibold mt-1">
                              {booking.totalPrice?.toLocaleString('vi-VN')} VND
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingHistory; 