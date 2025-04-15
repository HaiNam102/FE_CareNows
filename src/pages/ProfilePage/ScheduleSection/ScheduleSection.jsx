import React, { useState, useEffect } from 'react';
import CareTakerCalendar from '../../../components/CareTakerCalendar';
import NannySchedulePopup from '../../../components/NannySchedulePopup';

const ScheduleSection = ({ profile, onSelectTimePickerView, careTakerId: propCareTakerId, onSelectAvailableDates, availableDates }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showAllDates, setShowAllDates] = useState(false);

  // Debugging function
  const debug = (message, data) => {
    console.log(`[ScheduleSection] ${message}`, data !== undefined ? data : '');
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      debug('Component unmounting, cleaning up state');
    };
  }, []);

  // Reset state when careTakerId changes
  useEffect(() => {
    debug('CareTakerId changed to:', propCareTakerId);
    debug('Resetting selected dates');
    setSelectedDateRange(null);
  }, [propCareTakerId]);

  // Log when component props change
  useEffect(() => {
    debug('Received propCareTakerId:', propCareTakerId);
    debug('Received availableDates:', availableDates ? availableDates.length : 0);
  }, [propCareTakerId, availableDates]);

  const handleSelectDateRange = (range) => {
    debug('Dates selected:', range);
    setSelectedDateRange(range);
    if (onSelectTimePickerView) {
      onSelectTimePickerView(range);
    }
  };

  // Handle when availableDates are loaded from the calendar component
  const handleAvailableDatesLoaded = (dates) => {
    debug('Available dates loaded from calendar:', dates.length);
    if (onSelectAvailableDates) {
      onSelectAvailableDates(dates);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chọn ngày</h2>
      </div>
      
      {isCalendarOpen && propCareTakerId ? (
        <CareTakerCalendar
          onClose={() => setIsCalendarOpen(false)}
          onSelectDateRange={handleSelectDateRange}
          careTakerId={propCareTakerId}
          onAvailableDatesLoaded={handleAvailableDatesLoaded}
          availableDates={availableDates}
        />
      ) : (
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4">Vui lòng chọn một bảo mẫu để xem lịch</div>
        </div>
      )}

      {selectedDateRange && selectedDateRange.length > 0 && (
        <div className="mt-4">
          <p>Ngày đã chọn:</p>
          <div className="flex gap-2 flex-wrap">
            {selectedDateRange.slice(0, 3).map((date, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded">
                {date.toLocaleDateString()}
              </span>
            ))}
            {selectedDateRange.length > 3 && (
              <span className="text-blue-500 cursor-pointer" onClick={() => setShowAllDates(!showAllDates)}>
                ...xem tất cả
              </span>
            )}
          </div>
          {showAllDates && (
            <div className="mt-2">
              {selectedDateRange.map((date, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded mr-1">
                  {date.toLocaleDateString()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;