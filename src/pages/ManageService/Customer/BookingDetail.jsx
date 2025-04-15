import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { Star } from 'lucide-react';

const BookingDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  if (!booking) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Không tìm thấy thông tin đặt lịch</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-[280px] flex-shrink-0 pt-8">
            <div className="w-[285px]">
              <div>
                <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào Tan!</h2>
                <div className="h-[1px] bg-gray-200 w-full"></div>
              </div>
              <nav className="mt-4">
                <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/profile">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
                </a>
                <a className="flex items-center h-[40px] px-4 relative text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]" href="/customer/booking-history">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
                </a>
                <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-8 pt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-['SVN-Gilroy']">Trở lại</span>
              </button>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Mã đơn hàng: {booking.orderNumber}</span>
                <span className={`px-3 py-1 rounded-full ${booking.statusColor}`}>
                  {booking.statusLabel}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Job Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">Thông tin công việc</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00A86B]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <div>
                    <p className="text-gray-900">Ngày làm việc: {booking.workDate}</p>
                    <p className="text-gray-900">Làm trong {booking.workDuration}, {booking.workTime}</p>
                    <p className="text-gray-900">Loại dịch vụ: {booking.serviceName}</p>
                  </div>
                </div>
              </div>

              {/* Work Location */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">Vị trí làm việc</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00A86B]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <div>
                    <p className="text-gray-900">{booking.hospitalName}</p>
                    <p className="text-gray-600">{booking.hospitalAddress}</p>
                    <p className="text-gray-900 mt-2">Người liên hệ: {booking.contactPerson}</p>
                    <p className="text-gray-900">Số điện thoại: {booking.contactPhone}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">Chi tiết công việc</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{booking.jobDescription}</p>
                </div>
              </div>

              {/* Caregiver Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">Thông tin người chăm sóc</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                  <img src={booking.caregiver.avatar} alt={booking.caregiver.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h4 className="text-lg font-semibold">{booking.caregiver.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-[#00A86B] fill-[#00A86B]" />
                      <span className="text-[#00A86B] font-semibold">{booking.caregiver.rating}</span>
                      <span className="text-gray-500">{booking.caregiver.ratingCount}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 border border-[#00A86B] text-[#00A86B] rounded-lg hover:bg-[#00A86B] hover:text-white transition-colors">
                        Liên hệ
                      </button>
                      <button className="px-4 py-2 bg-[#00A86B] text-white rounded-lg hover:bg-[#008F5D] transition-colors">
                        Thuê lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">Chi tiết thanh toán</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Chi phí dịch vụ ({booking.workDuration} x {booking.hourlyRate} VND)</span>
                    <span className="text-gray-900">{parseInt(booking.hourlyRate.replace(/\D/g, '')) * booking.totalHours}.000 VND</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Phí di chuyển</span>
                    <span className="text-gray-900">{booking.transportFee.toLocaleString()} VND</span>
                  </div>
                  <div className="h-[1px] bg-gray-200 my-2"></div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-900 font-semibold">Tổng</span>
                    <span className="text-[#00A86B] font-semibold text-xl">{booking.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingDetail; 