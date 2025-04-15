import React, { useState, useEffect } from 'react';

const Calendar = ({ onClose, onSelectDateRange }) => {
  // Get current date
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectionMode, setSelectionMode] = useState('start'); // 'start' or 'end'

  // Calculate first month (current month)
  const firstMonth = new Date(currentDate);
  firstMonth.setDate(1);
  
  // Calculate second month (next month)
  const secondMonth = new Date(firstMonth);
  secondMonth.setMonth(firstMonth.getMonth() + 1);

  // Navigate months
  const navigateMonths = (direction) => {
    const newDate = new Date(firstMonth);
    newDate.setMonth(firstMonth.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Check if date is today
  const isToday = (date, month, year) => {
    return date === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Check if date is in the past
  const isPastDate = (date, month, year) => {
    const checkDate = new Date(year, month, date);
    checkDate.setHours(0, 0, 0, 0);
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    return checkDate < todayStart;
  };

  // Check if date is selected start date
  const isSelectedStart = (date, month, year) => {
    if (!selectedStartDate) return false;
    return date === selectedStartDate.getDate() && 
           month === selectedStartDate.getMonth() && 
           year === selectedStartDate.getFullYear();
  };

  // Check if date is selected end date
  const isSelectedEnd = (date, month, year) => {
    if (!selectedEndDate) return false;
    return date === selectedEndDate.getDate() && 
           month === selectedEndDate.getMonth() && 
           year === selectedEndDate.getFullYear();
  };

  // Check if date is in the selected range
  const isInRange = (date, month, year) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    
    const currentDate = new Date(year, month, date);
    return currentDate > selectedStartDate && currentDate < selectedEndDate;
  };

  // Handle date click
  const handleDateClick = (date, month, year) => {
    // Don't allow selection of past dates
    if (isPastDate(date, month, year)) return;
    
    const clickedDate = new Date(year, month, date);
    
    if (selectionMode === 'start') {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setSelectionMode('end');
    } else {
      // Make sure end date is after start date
      if (clickedDate < selectedStartDate) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(clickedDate);
        setSelectionMode('start'); // Reset for next selection
      }
    }
  };

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle continue button click
  const handleContinue = () => {
    if (selectedStartDate && selectedEndDate) {
      onSelectDateRange([selectedStartDate, selectedEndDate]);
      onClose();
    } else if (selectedStartDate) {
      // If only start date is selected, use it for both start and end
      onSelectDateRange([selectedStartDate, selectedStartDate]);
      onClose();
    }
  };

  // Generate days for calendar
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfMonth = getFirstDayOfMonth(date);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: null,
        month: null,
        year: null,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add empty cells to complete the grid
    const totalCells = 42; // Always 6 rows * 7 days to keep consistent height
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

  // Format month name in Vietnamese
  const getVietnameseMonthName = (monthIndex) => {
    return `Tháng ${monthIndex + 1}`;
  };

  // Day of week labels in Vietnamese (starting from Monday)
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Generate calendar cells for a month
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
            // Skip rendering for empty cells
            if (day.date === null) {
              return <div key={index} className="h-10"></div>;
            }
            
            const isPast = isPastDate(day.date, day.month, day.year);
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date, day.month, day.year)}
                className={`
                  text-center py-2 rounded h-10 flex items-center justify-center
                  ${isPast ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer text-gray-800'}
                  ${isToday(day.date, day.month, day.year) ? 'bg-green-400' : ''}
                  ${isSelectedStart(day.date, day.month, day.year) ? 'bg-emerald-500 text-white' : ''}
                  ${isSelectedEnd(day.date, day.month, day.year) ? 'bg-emerald-500 text-white' : ''}
                  ${isInRange(day.date, day.month, day.year) ? 'bg-emerald-100' : ''}
                  ${!isToday(day.date, day.month, day.year) && 
                    !isSelectedStart(day.date, day.month, day.year) && 
                    !isSelectedEnd(day.date, day.month, day.year) && 
                    !isInRange(day.date, day.month, day.year) && 
                    !isPast ? 'hover:bg-gray-100' : ''}
                `}
              >
                {day.date}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          {selectionMode === 'start' ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
        </div>
        <button 
          onClick={() => navigateMonths(1)}
          className="p-2 bg-gray-100 rounded border border-transparent hover:bg-gray-200 text-gray-600 hover:border-gray-300"
        >
          &gt;
        </button>
      </div>
      
      <div className="flex flex-row gap-6 mb-6">
        {renderMonth(firstMonth)}
        {renderMonth(secondMonth)}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex text-sm text-gray-600 gap-6">
          {selectedStartDate && 
            <span>Từ: {formatDate(selectedStartDate)} </span>
          }
          {selectedEndDate && 
            <span>đến: {formatDate(selectedEndDate)}</span>
          }
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
              selectedStartDate ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedStartDate}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;