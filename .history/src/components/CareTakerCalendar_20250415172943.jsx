import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CareTakerCalendar = ({ onClose, onSelectDateRange, careTakerId, onAvailableDatesLoaded, availableDates: propAvailableDates }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualCareTakerId, setActualCareTakerId] = useState(null);
  const [selectionMode, setSelectionMode] = useState('range');

  useEffect(() => {
    // Reset error state when ID changes
    setError(null);
    
    if (careTakerId) {
      // Ensure careTakerId is a number
      const parsedId = typeof careTakerId === 'string' ? parseInt(careTakerId, 10) : careTakerId;
      
      if (!isNaN(parsedId) && parsedId > 0) {
        console.log(`CareTakerCalendar: Using valid careTakerId: ${parsedId} (${typeof parsedId})`);
        // Reset state when careTakerId changes
        setAvailableDates([]);
        setSelectedDates([]);
        setStartDate(null);
        setEndDate(null);
        setActualCareTakerId(parsedId);
        setIsLoading(true); // Start loading state for calendar
      } else {
        console.error(`CareTakerCalendar: Invalid careTakerId format: ${careTakerId} (${typeof careTakerId})`);
        setError("ID của bảo mẫu không hợp lệ, vui lòng quay lại và chọn bảo mẫu khác");
        setIsLoading(false);
      }
    } else {
      console.error("CareTakerCalendar: No careTakerId provided to calendar component");
      setError("Không thể xem lịch - không tìm thấy thông tin bảo mẫu");
      setIsLoading(false);
    }
  }, [careTakerId]);
  
  // Reset selected dates when caretaker changes - no longer needed as we do this above
  /*useEffect(() => {
    if (actualCareTakerId) {
      // Only reset if we have a valid ID
      setSelectedDates([]);
      setStartDate(null);
      setEndDate(null);
    }
  }, [actualCareTakerId]);*/

  const firstMonth = new Date(currentDate);
  firstMonth.setDate(1);

  const secondMonth = new Date(firstMonth);
  secondMonth.setMonth(firstMonth.getMonth() + 1);

  useEffect(() => {
    // If availableDates were provided as props, use them
    if (propAvailableDates && propAvailableDates.length > 0) {
      console.log("CareTakerCalendar: Using provided availableDates from props:", propAvailableDates);
      setAvailableDates(propAvailableDates);
      setIsLoading(false);
      return;
    }

    if (!actualCareTakerId) {
      setIsLoading(false);
      return;
    }

    // Lưu lại ID hiện tại để so sánh sau khi API trả về
    const currentCareTakerId = actualCareTakerId;

    const fetchAvailableDates = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log(`CareTakerCalendar: Fetching calendar for careTakerId: ${actualCareTakerId} (${typeof actualCareTakerId})`);

        const response = await axios.get(`http://localhost:8080/api/calendar/caretaker/${actualCareTakerId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("CareTakerCalendar: Full API Response:", response.data);

        // Kiểm tra xem careTakerId có thay đổi trong quá trình fetch không
        if (currentCareTakerId !== actualCareTakerId) {
          console.log("CareTakerCalendar: CareTaker ID changed during fetch, ignoring stale results");
          return;
        }

        if (response.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
          console.log("CareTakerCalendar: Raw response data:", response.data.data);

          const dates = response.data.data
            .filter(item => item && item.day)
            .map(item => {
              console.log("CareTakerCalendar: Processing date item:", item);
              return item.day;
            });

          console.log("CareTakerCalendar: Extracted dates:", dates);

          const availableDateObjects = dates.map(dateString => {
            try {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                console.warn("CareTakerCalendar: Invalid date format:", dateString);
                return null;
              }

              const [year, month, day] = dateString.split('-').map(Number);
              const date = new Date(year, month - 1, day);

              if (isNaN(date.getTime())) {
                console.warn("CareTakerCalendar: Invalid date created:", dateString);
                return null;
              }

              return date;
            } catch (err) {
              console.error("CareTakerCalendar: Error parsing date:", dateString, err);
              return null;
            }
          }).filter(date => date !== null);

          console.log("CareTakerCalendar: Final available dates:", availableDateObjects);
          setAvailableDates(availableDateObjects);
          
          // Gửi danh sách ngày có sẵn lên component cha
          if (onAvailableDatesLoaded) {
            console.log("CareTakerCalendar: Sending available dates to parent component");
            onAvailableDatesLoaded(availableDateObjects);
          }
        } else {
          console.warn("CareTakerCalendar: Unexpected API response structure:", response.data);
          setError("Định dạng dữ liệu không hợp lệ");
        }
        setIsLoading(false);
      } catch (error) {
        // Kiểm tra xem careTakerId có thay đổi trong quá trình fetch không
        if (currentCareTakerId !== actualCareTakerId) {
          console.log("CareTakerCalendar: CareTaker ID changed during fetch error handling, ignoring error");
          return;
        }
        
        console.error("CareTakerCalendar: Error fetching caretaker's schedule:", error);
        console.error("CareTakerCalendar: API call failed for careTakerId:", actualCareTakerId);
        setError(error.response?.data?.message || "Không thể tải lịch của bảo mẫu. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchAvailableDates();
  }, [actualCareTakerId, onAvailableDatesLoaded, propAvailableDates]);

  const isAvailable = (date, month, year) => {
    if (availableDates.length === 0) {
      return false;
    }

    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const formattedDate = date.toString().padStart(2, '0');
    const dateToCheck = `${year}-${formattedMonth}-${formattedDate}`;

    return availableDates.some(availableDate => {
      const availableMonth = (availableDate.getMonth() + 1).toString().padStart(2, '0');
      const availableDay = availableDate.getDate().toString().padStart(2, '0');
      const formattedAvailableDate = `${availableDate.getFullYear()}-${availableMonth}-${availableDay}`;
      return formattedAvailableDate === dateToCheck;
    });
  };

  const isDateBetween = (date, start, end) => {
    if (!start || !end) return false;
    const time = date.getTime();
    return time >= start.getTime() && time <= end.getTime();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isDateSelected = (date) => {
    return selectedDates.some(d => isSameDay(d, date));
  };

  const addDate = (date) => {
    if (!isDateSelected(date)) {
      setSelectedDates(prev => [...prev, date].sort((a, b) => a - b));
    }
  };

  const removeDate = (date) => {
    setSelectedDates(prev => prev.filter(d => !isSameDay(d, date)));
  };

  const toggleDateSelection = (date) => {
    if (isDateSelected(date)) {
      removeDate(date);
    } else {
      addDate(date);
    }
  };

  const addDateRange = (start, end) => {
    if (!start || !end) return;

    const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start];

    const newDates = [];
    const currentDate = new Date(rangeStart);

    while (currentDate <= rangeEnd) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();

      if (isAvailable(day, month, year) && !isPastDate(day, month, year)) {
        newDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSelectedDates(prev => {
      const oldDatesOutsideRange = prev.filter(oldDate => {
        return oldDate < rangeStart || oldDate > rangeEnd;
      });
      return [...oldDatesOutsideRange, ...newDates].sort((a, b) => a - b);
    });
  };

  const toggleSelectionMode = () => {
    setSelectionMode(prev => prev === 'range' ? 'individual' : 'range');
    if (selectionMode === 'range') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleDateClick = (date, month, year) => {
    console.log(`Clicked on date: ${year}-${month+1}-${date}`);

    if (isPastDate(date, month, year)) {
      console.log("Date is in the past, not selectable");
      return;
    }

    if (!isAvailable(date, month, year)) {
      console.log("Date is not available, not selectable");
      return;
    }

    const clickedDate = new Date(year, month, date);
    console.log("Clicked date:", clickedDate);

    if (selectionMode === 'individual') {
      toggleDateSelection(clickedDate);
    } else {
      if (!startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
        setSelectedDates([clickedDate]);
      } else if (!endDate) {
        setEndDate(clickedDate);
        addDateRange(startDate, clickedDate);
      } else {
        setStartDate(clickedDate);
        setEndDate(null);
        setSelectedDates([clickedDate]);
      }
    }
  };

  const handleContinue = () => {
    if (selectedDates.length > 0) {
      const sortedDates = [...selectedDates].sort((a, b) => a - b);
      onSelectDateRange(sortedDates);
      onClose();
    }
  };

  const handleClearAll = () => {
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const isSelected = (date, month, year) => {
    const checkDate = new Date(year, month, date);
    return selectedDates.some(d => isSameDay(d, checkDate));
  };

  const isPastDate = (date, month, year) => {
    const checkDate = new Date(year, month, date);
    checkDate.setHours(0, 0, 0, 0);
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    return checkDate < todayStart;
  };

  const isRangeEnd = (date, month, year) => {
    const checkDate = new Date(year, month, date);
    return (startDate && isSameDay(checkDate, startDate)) ||
           (endDate && isSameDay(checkDate, endDate));
  };

  const navigateMonths = (direction) => {
    const newDate = new Date(firstMonth);
    newDate.setMonth(firstMonth.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date, month, year) => {
    return date === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const getVietnameseMonthName = (monthIndex) => {
    return `Tháng ${monthIndex + 1}`;
  };

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfMonth = getFirstDayOfMonth(date);

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: null,
        month: null,
        year: null,
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month,
        year,
        isCurrentMonth: true
      });
    }

    const totalCells = 42;
    const remainingCells = totalCells - days.length;

    for (let i = 0; i < remainingCells; i++) {
      days.push({
        date: null,
        month: null,
        year: null,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const isDateInRange = (date, month, year) => {
    if (!startDate || !endDate) return false;

    const checkDate = new Date(year, month, date);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    const [start, end] = rangeStart <= rangeEnd ? [rangeStart, rangeEnd] : [rangeEnd, rangeStart];

    return checkDate > start && checkDate < end;
  };

  const renderMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = generateCalendarDays(date);

    return (
      <div className="w-full px-2">
        <div className="text-xl font-semibold mb-4 text-center text-gray-800">
          {getVietnameseMonthName(month)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-medium py-1 text-gray-600">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            if (day.date === null) {
              return <div key={index} className="h-10"></div>;
            }

            const isPast = isPastDate(day.date, day.month, day.year);
            const available = isAvailable(day.date, day.month, day.year);
            const selected = isSelected(day.date, day.month, day.year);
            const isRange = isRangeEnd(day.date, day.month, day.year);
            const isMiddleOfRange = selectionMode === 'range' && isDateInRange(day.date, day.month, day.year);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date, day.month, day.year)}
                className={`
                  text-center py-2 rounded h-10 flex items-center justify-center transition-all
                  ${isPast ? 'text-gray-400 cursor-not-allowed' :
                    available ? 'cursor-pointer text-gray-900 bg-green-100 hover:bg-green-200' : 'text-gray-400 cursor-not-allowed opacity-50 bg-gray-100'}
                  ${isToday(day.date, day.month, day.year) ? 'ring-2 ring-green-500' : ''}
                  ${isRange && selectionMode === 'range' ? 'bg-emerald-600 text-white ring-2 ring-emerald-700' : ''}
                  ${isMiddleOfRange ? 'bg-emerald-400 text-white' : ''}
                  ${selected && !isRange && !isMiddleOfRange ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                  ${selectionMode === 'range' && isRange ? 'relative z-10' : ''}
                `}
              >
                {day.date}
                {selectionMode === 'range' && startDate && endDate && (
                  <>
                    {isSameDay(new Date(year, month, day.date), startDate) && (
                      <div className="absolute inset-0 rounded-l bg-emerald-600 -z-10"></div>
                    )}
                    {isSameDay(new Date(year, month, day.date), endDate) && (
                      <div className="absolute inset-0 rounded-r bg-emerald-600 -z-10"></div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-l border-1px p-4 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonths(-1)}
          className="p-2 bg-gray-100 rounded border border-transparent hover:bg-gray-200 text-gray-600 hover:border-gray-300"
        >
          &lt;
        </button>
        <div className="text-lg font-semibold text-gray-800">
          Chọn ngày làm việc
        </div>
        <button
          onClick={() => navigateMonths(1)}
          className="p-2 bg-gray-100 rounded border border-transparent hover:bg-gray-200 text-gray-600 hover:border-gray-300"
        >
          &gt;
        </button>
      </div>

      <div className="mb-4 flex justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSelectionMode}
            className={`px-3 py-1 rounded text-sm ${selectionMode === 'range' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Chọn khoảng ngày
          </button>
          <button
            onClick={toggleSelectionMode}
            className={`px-3 py-1 rounded text-sm ml-2 ${selectionMode === 'individual' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Chọn từng ngày
          </button>
        </div>
        {selectedDates.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {renderMonth(firstMonth)}
        {renderMonth(secondMonth)}
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 border border-emerald-500 rounded mr-3 text-gray-700">
              30
            </div>
            <span>Ngày có sẵn - có thể đặt lịch</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded mr-3 text-white">
              30
            </div>
            <span>Ngày đã chọn</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 opacity-50 rounded mr-3 text-gray-400">
              30
            </div>
            <span>Ngày không có sẵn - không thể đặt lịch</span>
          </div>
          {selectionMode === 'range' && (
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 border-2 border-emerald-600 rounded mr-3 text-gray-700">
                30
              </div>
              <span>Ngày bắt đầu/kết thúc khoảng chọn</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex text-sm text-gray-800 ">
          {selectedDates.length > 0 && (
            <span>
              {selectedDates.length > 1
                ? `Đã chọn ${selectedDates.length} ngày`
                : `Đã chọn: ${formatDate(selectedDates[0])}`}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleContinue}
            className={`px-4 py-2 rounded text-white ${
              selectedDates.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={selectedDates.length === 0}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareTakerCalendar;