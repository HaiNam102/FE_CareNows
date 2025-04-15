import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

export default function TasksAccordion() {
  const [isTasksToDoOpen, setIsTasksToDoOpen] = useState(false);
  const [isTasksNotToDoOpen, setIsTasksNotToDoOpen] = useState(false);

  const toggleTasksToDo = () => {
    setIsTasksToDoOpen(!isTasksToDoOpen);
  };

  const toggleTasksNotToDo = () => {
    setIsTasksNotToDoOpen(!isTasksNotToDoOpen);
  };

  return (
    <div className="max-w-2xl mx-auto font-['SVN-Gilroy']">
      {/* Tasks to be performed section */}
      <div className="border-b">
        <button
          onClick={toggleTasksToDo}
          className="w-full flex items-center justify-between p-4 text-left text-lg font-medium"
        >
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={24} />
            <span>Các công việc sẽ thực hiện</span>
          </div>
          {isTasksToDoOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {isTasksToDoOpen && (
          <div className="p-4 pl-10 text-base">
            <div className="mb-4">
              <h3 className="text-green-500 font-medium mb-2">Chăm sóc sinh hoạt hàng ngày:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Trông nom, chăm sóc người bệnh</li>
                <li>Cho bệnh nhân ăn uống</li>
                <li>Vệ sinh cá nhân cho người bệnh (vệ sinh răng miệng, gội đầu, hỗ trợ tắm rửa)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-green-500 font-medium mb-2">Hỗ trợ di chuyển & bài tiết:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nâng trở người bệnh</li>
                <li>Vận chuyển bệnh nhân đi khám bệnh</li>
                <li>Hỗ trợ người bệnh bài tiết</li>
                <li>Đổ bô, xử lý chất thải và vệ sinh dụng cụ đựng chất thải</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-green-500 font-medium mb-2">Theo dõi và hỗ trợ sức khỏe:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Giám sát và nhắc nhở uống thuốc theo đơn</li>
                <li>Xoa bóp vùng đau nhức, vỗ rung</li>
                <li>Theo dõi dấu hiệu sinh tồn (tim, mạch, huyết áp, nhiệt độ)</li>
                <li>Thông báo tình trạng bệnh nhân cho người thân và bác sĩ khi cần</li>
              </ul>
            </div>

            <div>
              <h3 className="text-green-500 font-medium mb-2">Hỗ trợ thủ tục & giấy tờ tại bệnh viện</h3>
            </div>
          </div>
        )}
      </div>

      {/* Tasks NOT to be performed section */}
      <div>
        <button
          onClick={toggleTasksNotToDo}
          className="w-full flex items-center justify-between p-4 text-left text-lg font-medium"
        >
          <div className="flex items-center">
            <X className="text-red-500 mr-2" size={24} />
            <span>Các công việc KHÔNG thực hiện</span>
          </div>
          {isTasksNotToDoOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {isTasksNotToDoOpen && (
          <div className="p-4 pl-10 text-base">
            <div className="mb-4">
              <h3 className="text-red-500 font-medium mb-2">Không thực hiện các thủ thuật y tế xâm lấn có thể:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tiêm thuốc, truyền dịch, thay băng cắt chỉ, rửa vết thương</li>
                <li>Tháo thụt đại tràng cho người già và các thủ thuật tương tự</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-red-500 font-medium mb-2">Không kiểm tra, thăm khám các vùng cơ thể nhạy cảm:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kiểm tra tình trạng lỗ tiểu, vệ sinh bộ phận sinh dục</li>
              </ul>
            </div>

            <div>
              <h3 className="text-red-500 font-medium mb-2">Không thực hiện các thủ thuật đặc biệt:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Đặt Sonde tiểu, Sonde dạ dày, bắm huyết, châm cứu</li>
                <li>Hút rửa đờm đái phục hồi chức năng hô hấp</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}