import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const NannySchedulePopup = ({ careTakerId, selectedDateRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualCareTakerId, setActualCareTakerId] = useState(null);
  
  // Format date as YYYY-MM-DD for API requests
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };
  
  // Set the actual caretaker ID when prop changes
  useEffect(() => {
    if (careTakerId) {
      // Ensure caretaker ID is a number
      const parsedId = typeof careTakerId === 'string' ? parseInt(careTakerId, 10) : careTakerId;
      
      if (!isNaN(parsedId) && parsedId > 0) {
        console.log("NannySchedulePopup using valid caretaker ID:", parsedId);
        setActualCareTakerId(parsedId);
      } else {
        console.error("Invalid caretaker ID format:", careTakerId);
        setError("ID bảo mẫu không hợp lệ");
      } 
    } else {
      console.error("No caretaker ID provided to NannySchedulePopup");
      setError("Không thể xác định ID của bảo mẫu");
    }
  }, [careTakerId]);
  
  // Lấy lịch của bảo mẫu khi popup được mở
  useEffect(() => {
    if (isOpen && actualCareTakerId) {
      fetchNannySchedule();
    }
  }, [isOpen, actualCareTakerId, selectedDateRange]);
  
  // Gọi API để lấy lịch của bảo mẫu - endpoint format: /api/booking/booked-slots/caretaker/{id}
  const fetchNannySchedule = async () => {
    if (!actualCareTakerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log("Fetching booked slots for caretaker ID:", actualCareTakerId);
      
      // Prepare date parameters if selectedDateRange is available
      let params = {};
      
      if (selectedDateRange && selectedDateRange.length > 0) {
        // Gửi tất cả các ngày đã chọn dưới dạng query params
        const daysParam = selectedDateRange.map(date => formatDateForAPI(date)).join(',');
        if (daysParam) {
          console.log(`Filtering booked slots for days: ${daysParam}`);
          params.days = daysParam; 
        } 
      } else {
        // Default: get the current date if no date range specified
        const today = new Date();
        params.days = formatDateForAPI(today);
      }
      
      // Endpoint lấy slots đã đặt của bảo mẫu
      const response = await axios.get(`http://localhost:8080/api/booking/booked-slots/caretaker/${actualCareTakerId}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Raw API Response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Trường hợp API trả về trực tiếp mảng dữ liệu
        processScheduleData(response.data);
      } else if (response.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
        // Trường hợp API trả về dữ liệu trong response.data.data
        processScheduleData(response.data.data);
      } else {
        console.warn("Invalid API response format:", response.data);
        setError("Định dạng dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching caretaker schedule:", err);
      setError("Không thể tải lịch của bảo mẫu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Xử lý dữ liệu lịch đặt
  const processScheduleData = (data) => {
    const scheduleData = data.map(item => {
      console.log("Processing schedule item:", item);
      
      // Format ngày từ YYYY-MM-DD thành DD/MM/YYYY
      const dateParts = item.day ? item.day.split('-') : [];
      const formattedDate = dateParts.length === 3 
        ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
        : item.day || 'Không xác định';
      
      const scheduleItem = {
        id: item.id || Math.random().toString(36).substr(2, 9),
        date: formattedDate,
        startTime: item.timeToStart || 'Không xác định',
        endTime: item.timeToEnd || 'Không xác định',
        status: item.status || 'PENDING'
      };
      
      console.log("Formatted schedule item:", scheduleItem);
      return scheduleItem;
    });
    
    console.log("Final processed schedule data:", scheduleData);
    setScheduledTimes(scheduleData);
  };

  // Nhóm các lịch theo ngày
  const groupedSchedule = useMemo(() => {
    const grouped = {};
    
    scheduledTimes.forEach(schedule => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });
    
    // Chuyển đổi thành mảng để dễ hiển thị
    return Object.entries(grouped).map(([date, schedules]) => ({
      date,
      schedules
    }));
  }, [scheduledTimes]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Show selected dates in button
  const getButtonText = () => {
    if (selectedDateRange && selectedDateRange.length > 0) {
      const formatSimpleDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth()+1}`;
      };
      
      // Nếu chỉ có 1 ngày hoặc 2 ngày được chọn
      if (selectedDateRange.length <= 2) {
        return `Xem lịch đã có (${selectedDateRange.map(date => formatSimpleDate(date)).join(', ')})`;
      }
      
      // Nếu có nhiều hơn 2 ngày được chọn
      return `Xem lịch đã có (${formatSimpleDate(selectedDateRange[0])}, ${formatSimpleDate(selectedDateRange[1])}, +${selectedDateRange.length - 2} ngày khác)`;
    }
    return "Xem lịch bảo mẫu";
  };

  // Style với màu #00A37D
  const primaryColor = "#00A37D";
  const primaryLightColor = "#E6F7F1"; // Màu nền nhạt phù hợp với #00A37D

  const formatStatusText = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Đang chờ';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={togglePopup}
        style={{ backgroundColor: primaryColor }}
        className="hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {getButtonText()}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Lịch làm việc đã đặt
                {selectedDateRange && selectedDateRange.length > 0 && (
                  <span className="block text-sm text-gray-500 mt-1">
                    {selectedDateRange.length <= 3 ? (
                      selectedDateRange.map(date => new Date(date).toLocaleDateString()).join(', ')
                    ) : (
                      <>
                        {selectedDateRange.slice(0, 3).map(date => new Date(date).toLocaleDateString()).join(', ')} 
                        <span 
                          className="text-blue-500 cursor-pointer ml-1" 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Tất cả các ngày đã chọn: ${selectedDateRange.map(date => new Date(date).toLocaleDateString()).join(', ')}`);
                          }}
                        >
                          ...xem tất cả
                        </span>
                      </>
                    )}
                  </span>
                )}
              </h2>
              <div
                onClick={togglePopup}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                role="button"
                aria-label="Close"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : groupedSchedule.length > 0 ? (
                <div className="space-y-4">
                  {groupedSchedule.map((group) => (
                    <div key={group.date} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Header ngày */} 
                      <div style={{ backgroundColor: primaryLightColor }} className="p-3 border-b border-gray-200">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg> 
                          <span style={{ color: primaryColor }} className="font-medium">Ngày: {group.date}</span>
                        </div>
                      </div>
                      
                      {/* Các khung giờ trong ngày */}
                      <div className="divide-y divide-gray-100"> 
                        {group.schedules.map((schedule) => (
                          <div key={schedule.id} className="p-3 hover:bg-gray-50">
                            <div className="flex items-center text-gray-700 mb-1">
                              <svg className="w-4 h-4 mr-2" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Giờ : {schedule.startTime} - {schedule.endTime}</span>
                            </div>
                            <div className="flex justify-end">
                              {/* <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(schedule.status)}`}>
                                {formatStatusText(schedule.status)}
                              </span> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">Không có lịch đặt nào trong khoảng thời gian đã chọn</p>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={togglePopup}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NannySchedulePopup;