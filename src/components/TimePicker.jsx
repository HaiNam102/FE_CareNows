import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TimePicker = ({ onTimeSelected }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes >= 30 ? 0 : 30;
    const roundedHour = minutes >= 30 ? now.getHours() + 1 : now.getHours();
    const time = new Date(now.setHours(roundedHour, roundedMinutes, 0, 0));
    return {
      label: `${roundedHour.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`,
      value: time,
    };
  });
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes >= 30 ? 0 : 30;
    const roundedHour = minutes >= 30 ? now.getHours() + 2 : now.getHours() + 1;
    const time = new Date(now.setHours(roundedHour, roundedMinutes, 0, 0));
    return {
      label: `${roundedHour.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`,
      value: time,
    };
  });
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  // Cập nhật thời gian hiện tại mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Tạo danh sách thời gian với khoảng cách 30 phút
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const timeObj = new Date();
        timeObj.setHours(hour, minute, 0, 0);
        options.push({
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          value: timeObj,
          disabled: false, // Không vô hiệu hóa bất kỳ tùy chọn nào
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleStartTimeSelect = (option) => {
    setStartTime(option);
    setShowStartDropdown(false);
    // Kiểm tra nếu endTime nhỏ hơn startTime
    if (endTime && option.value > endTime.value) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu');
      setEndTime(null);
      if (onTimeSelected) {
        onTimeSelected(option.label, null);
      }
    } else {
      if (onTimeSelected) {
        onTimeSelected(option.label, endTime ? endTime.label : null);
      }
    }
  };

  const handleEndTimeSelect = (option) => {
    // Kiểm tra nếu endTime nhỏ hơn startTime
    if (startTime && option.value <= startTime.value) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }
    setEndTime(option);
    setShowEndDropdown(false);
    if (onTimeSelected) {
      onTimeSelected(startTime ? startTime.label : null, option.label);
    }
  };

  const formatDisplayTime = (time) => {
    if (!time) return '';
    return time.label;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pr-0 pl-0">
      <div className="flex flex-row gap-2 mb-4">
        {/* Chọn giờ bắt đầu */}
        <div className="w-1/2">
          <div className="border rounded-lg shadow">
            <div className="p-3 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
            </div>
            <div className="relative">
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => setShowStartDropdown(!showStartDropdown)}
              >
                <span className="font-medium text-lg">
                  {startTime ? formatDisplayTime(startTime) : 'Chọn giờ'}
                </span>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>

              {showStartDropdown && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {timeOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 hover:bg-[#E6F5F0] flex items-center ${
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed text-gray-400'
                          : 'cursor-pointer'
                      } ${
                        startTime && startTime.label === option.label ? 'bg-[#E6F5F0]' : ''
                      }`}
                      onClick={() => !option.disabled && handleStartTimeSelect(option)}
                    >
                      <div className="mr-2 w-5 h-5 flex items-center justify-center">
                        {startTime && startTime.label === option.label ? (
                          <div className="w-4 h-4 bg-[#00A37D] rounded-full"></div>
                        ) : (
                          <div
                            className={`w-4 h-4 border rounded-full ${
                              option.disabled ? 'border-gray-300' : 'border-gray-400'
                            }`}
                          ></div>
                        )}
                      </div>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mũi tên */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-full p-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </div>
        </div>

        {/* Chọn giờ kết thúc */}
        <div className="w-1/2">
          <div className="border rounded-lg shadow">
            <div className="p-3 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
            </div>
            <div className="relative">
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => setShowEndDropdown(!showEndDropdown)}
              >
                <span className="font-medium text-lg">
                  {endTime ? formatDisplayTime(endTime) : 'Chọn giờ'}
                </span>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>

              {showEndDropdown && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {timeOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 hover:bg-[#E6F5F0] flex items-center ${
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed text-gray-400'
                          : 'cursor-pointer'
                      } ${endTime && endTime.label === option.label ? 'bg-[#E6F5F0]' : ''}`}
                      onClick={() => !option.disabled && handleEndTimeSelect(option)}
                    >
                      <div className="mr-2 w-5 h-5 flex items-center justify-center">
                        {endTime && endTime.label === option.label ? (
                          <div className="w-4 h-4 bg-[#00A37D] rounded-full"></div>
                        ) : (
                          <div
                            className={`w-4 h-4 border rounded-full ${
                              option.disabled ? 'border-gray-300' : 'border-gray-400'
                            }`}
                          ></div>
                        )}
                      </div>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;