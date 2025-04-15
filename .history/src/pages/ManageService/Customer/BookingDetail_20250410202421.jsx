import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingDetail = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[800px] mx-auto pt-6 pb-8 font-['SVN-Gilroy']">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Trở lại</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Mã đơn hàng: 1234</span>
          <span className="px-3 py-1 bg-[#11AA52] text-white rounded-md">
            Đã hoàn thành
          </span>
        </div>
      </div>

      {/* Job Information */}
      <section className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Thông tin công việc</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00A37D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-600">Ngày làm việc: Thứ hai, 10/3/2025</p>
              <p className="text-gray-600">Làm trong 4 giờ , 14:00 đến 18:00</p>
              <p className="text-gray-600">Loại dịch vụ: Chăm sóc tại bệnh viện</p>
            </div>
          </div>
        </div>
      </section>

      {/* Work Location */}
      <section className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Vị trí làm việc</h2>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00A37D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">Bệnh viện Đa khoa Đà Nẵng</p>
            <p className="text-gray-600">Đa khoa Đà Nẵng, 124 Hải Phòng, Thạch Trang</p>
            <p className="text-gray-600">Người liên hệ: Nhật Tân (+84) 899229928</p>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Chi tiết công việc</h2>
        <p className="text-gray-600">
          Bệnh nhân cần hỗ trợ tâm lý vì vừa phẫu thuật, cần kiên nhẫn, nhẹ nhàng...
        </p>
      </section>

      {/* Caregiver Information */}
      <section className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Thông tin người chăm sóc</h2>
        <div className="flex items-center gap-4">
          <img 
            src="https://i.pravatar.cc/100"
            alt="Caregiver"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-medium">Tố uyên</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#00A37D] fill-[#00A37D]" />
              <span className="text-[#00A37D] font-medium">5</span>
              <span className="text-gray-400">(20)</span>
            </div>
            <p className="text-gray-600">5 năm kinh nghiệm</p>
          </div>
          <div className="ml-auto space-x-3">
            <button className="px-6 py-2 border border-[#00A37D] text-[#00A37D] rounded-lg hover:bg-[#00A37D] hover:text-white transition-colors">
              Liên hệ
            </button>
            <button className="px-6 py-2 bg-[#00A37D] text-white rounded-lg hover:bg-[#008F6B] transition-colors">
              Thuê lại
            </button>
          </div>
        </div>
      </section>

      {/* Schedule History */}
      <section className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Lịch chăm sóc đã đặt</span>
        </div>
      </section>

      {/* Payment Details */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Chi tiết thanh toán</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Chi phí dịch vụ (4 giờ x 120.000 VND)</span>
            <span>480.000 VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí di chuyển</span>
            <span>0</span>
          </div>
          <div className="h-[1px] bg-gray-200 my-2"></div>
          <div className="flex justify-between font-medium">
            <span>Tổng</span>
            <span>480.000 VND</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingDetail; 