import React, { useState } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen, LogOut, ChevronRight } from 'lucide-react';

const ProfileCustomer = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings] = useState([
    {
      id: '#1234',
      date: '22/11/2025',
      status: 'complete',
      caregiver: {
        name: 'Kim sa',
        avatar: '/avatars/kim-sa.jpg',
        rating: 5,
        ratingCount: 20,
        location: 'Chăm sóc tại bệnh viện'
      },
      price: '500.000 VND'
    },
    {
      id: '#1234',
      date: '22/11/2025',
      status: 'in-progress',
      caregiver: {
        name: 'Mai Anh',
        avatar: '/avatars/mai-anh.jpg',
        rating: 5,
        ratingCount: 20,
        location: 'Chăm sóc tại bệnh viện'
      },
      price: '500.000 VND'
    },
    {
      id: '#1234',
      date: '22/11/2025',
      status: 'cancelled',
      caregiver: {
        name: 'Mai Xuân',
        avatar: '/avatars/mai-xuan.jpg',
        rating: 5,
        ratingCount: 20,
        location: 'Chăm sóc tại bệnh viện'
      },
      price: '500.000 VND'
    },
    {
      id: '#1234',
      date: '22/11/2025',
      status: 'cancelled',
      caregiver: {
        name: 'Kim sa',
        avatar: '/avatars/kim-sa.jpg',
        rating: 5,
        ratingCount: 20,
        location: 'Chăm sóc tại bệnh viện'
      },
      price: '500.000 VND'
    }
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'complete':
        return <span className="px-3 py-1 text-sm rounded-full bg-[#00A86B] text-white">Complete</span>;
      case 'in-progress':
        return <span className="px-3 py-1 text-sm rounded-full bg-[#F59E0B] text-white">Đang thực hiện</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-sm rounded-full bg-[#EF4444] text-white">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex pt-[123px]">
        {/* Sidebar */}
        <div className="w-[300px] flex-shrink-0 px-8">
          <div className="space-y-4">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <User size={20} />
              <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-[#E6F5F0] text-[#00A86B] rounded-lg">
              <Calendar size={20} />
              <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building size={20} />
              <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building size={20} />
              <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <LogOut size={20} />
              <span className="font-['SVN-Gilroy']">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8">
          <h1 className="text-2xl font-bold mb-6 font-['SVN-Gilroy']">Xin chào Tan!</h1>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center gap-[160px]">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-12 py-4 rounded-lg font-['SVN-Gilroy'] text-base ${
                  activeTab === 'all'
                    ? 'bg-[#00A86B] text-white'
                    : 'bg-transparent text-gray-400'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('inProgress')}
                className={`px-12 py-4 font-['SVN-Gilroy'] text-base ${
                  activeTab === 'inProgress'
                    ? 'text-[#00A86B]'
                    : 'text-gray-400'
                }`}
              >
                Đang thực hiện
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-12 py-4 font-['SVN-Gilroy'] text-base ${
                  activeTab === 'completed'
                    ? 'text-[#00A86B]'
                    : 'text-gray-400'
                }`}
              >
                Đã hoàn thành
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-12 py-4 font-['SVN-Gilroy'] text-base ${
                  activeTab === 'cancelled'
                    ? 'text-[#00A86B]'
                    : 'text-gray-400'
                }`}
              >
                Đã hủy
              </button>
            </div>
          </div>

          {/* Booking Cards */}
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 mb-1 font-['SVN-Gilroy']">Ngày book đơn: {booking.date}</p>
                    <p className="text-gray-600 font-['SVN-Gilroy']">Đơn hàng: {booking.id}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img 
                      src={booking.caregiver.avatar} 
                      alt={booking.caregiver.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium mb-1 font-['SVN-Gilroy']">{booking.caregiver.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(booking.caregiver.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                        <span className="text-gray-400 text-sm">({booking.caregiver.ratingCount})</span>
                      </div>
                      <p className="text-gray-600 text-sm font-['SVN-Gilroy']">{booking.caregiver.location}</p>
                      <a href="#" className="text-[#00A86B] text-sm hover:underline font-['SVN-Gilroy']">Đánh giá ngay</a>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[#00A86B] text-xl font-medium mb-2 font-['SVN-Gilroy']">{booking.price}</p>
                    <a href="#" className="inline-flex items-center text-[#00A86B] hover:underline font-['SVN-Gilroy']">
                      Xem chi tiết
                      <ChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomer;
