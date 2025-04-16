import React from 'react';

const CalendarLegend = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Chú thích lịch</h3>
      <div className="space-y-3">
        {/* Ngày có sẵn */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-[#00A37D] bg-white flex items-center justify-center text-[#00A37D] font-medium">
            30
          </div>
          <span className="text-gray-700">Ngày có sẵn - có thể đặt lịch</span>
        </div>

        {/* Ngày đã chọn */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00A37D] text-white flex items-center justify-center font-medium">
            30
          </div>
          <span className="text-gray-700">Ngày đã chọn</span>
        </div>

        {/* Ngày không có sẵn */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center font-medium">
            30
          </div>
          <span className="text-gray-700">Ngày không có sẵn - không thể đặt lịch</span>
        </div>

        {/* Ngày bắt đầu/kết thúc khoảng */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-[#00A37D] bg-[#E6F6F2] flex items-center justify-center text-[#00A37D] font-medium">
            30
          </div>
          <span className="text-gray-700">Ngày bắt đầu/kết thúc khoảng chọn</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend; 