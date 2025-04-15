// ScheduleSection.jsx
import React, { useState } from 'react';
import Calendar from '../../../components/Calendar';
import TimePicker from '../../../components/TimePicker';

const ScheduleSection = ({ profile, onSelectTimePickerView }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const handleSelectDateRange = (range) => {
    setSelectedDateRange(range);
    
    // Lưu thông tin ngày đã chọn và thông báo cho component cha biết để chuyển view
    if (onSelectTimePickerView) {
      onSelectTimePickerView(range);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chọn ngày</h2>
      
      {isCalendarOpen && (
        <Calendar 
          onClose={() => setIsCalendarOpen(false)} 
          onSelectDateRange={handleSelectDateRange} 
        />
      )}

      {selectedDateRange && (
        <div className="mt-4 flex gap-16">
          <p>Ngày bắt đầu: {selectedDateRange[0].toLocaleDateString()}</p>
          <p>Ngày kết thúc: {selectedDateRange[1].toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;