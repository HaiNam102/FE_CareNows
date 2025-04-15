// ProfilePage.jsx
import React, { useState } from 'react';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import ProfileContent from './ProfileContent';
import TasksAccordion from './TasksAccordion';
import ReviewsSection from './ReviewsSection';
import ScheduleSection from './ScheduleSection/ScheduleSection';
import TimePicker from '../../components/TimePicker';

const ProfilePage = ({ profile, onClose, onNavigate, district, dateRange }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [scheduleView, setScheduleView] = useState('calendar');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTime, setSelectedTime] = useState({
    startTime: "21:00",
    endTime: "20:00"
  });

  // Tính số ngày thuê
  const calculateRentalDays = () => {
    if (!selectedDateRange) return 0;

    const start = new Date(selectedDateRange[0]);
    const end = new Date(selectedDateRange[1]);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays || 1; // Tối thiểu là 1 ngày
  };

  // Format thông tin ngày và giờ để hiển thị
  const formatDateTime = () => {
    if (!selectedDateRange) {
      return '';
    }

    const startDate = new Date(selectedDateRange[0]);
    const endDate = new Date(selectedDateRange[1]);

    const startDay = String(startDate.getDate()).padStart(2, '0');
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');

    const endDay = String(endDate.getDate()).padStart(2, '0');
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');

    return `${selectedTime.startTime}, ${startDay}/${startMonth} - ${selectedTime.endTime}, ${endDay}/${endMonth}`;
  };

  const handleNavigate = (tab, district, dateRange) => {
    setActiveTab(tab);
    if (tab === 'schedule') {
      setScheduleView('calendar'); 
    }
  };

  const handleSelectTimePickerView = (range) => {
    setSelectedDateRange(range);
    setScheduleView('timePicker');
  };

  // Xử lý khi người dùng chọn thời gian
  const handleTimeSelected = (startTime, endTime) => {
    setSelectedTime({
      startTime,
      endTime
    });
  };

  // Render content dựa trên tab đang active
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent profile={profile} />;
      case 'services':
        return <TasksAccordion profile={profile} />;
      case 'schedule':
        if (scheduleView === 'calendar') {
          return <ScheduleSection profile={profile} onSelectTimePickerView={handleSelectTimePickerView} />;
        } else { 
          return (

            <div className="p-4 relative" style={{ height: '700px' }}> 
              <div className="flex items-center mt-4 mb-7 relative ">
                <button
                  className="flex items-center text-black-500 hover:text-black-700 transition-colors"
                  onClick={() => setScheduleView('calendar')}
                > 
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12H5M5 12L12 19M5 12L12 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg> 
                  <span>Quay lại chọn ngày</span>
                </button>
              </div>
              <h2 className="text-xl font-bold mb-4">Chọn giờ đặt lịch</h2>

              {selectedDateRange && (
                <div className="mt-4 gap-3 mb-4">
                  <p>Ngày bắt đầu: {selectedDateRange[0].toLocaleDateString()}</p>
                  <p>Ngày kết thúc: {selectedDateRange[1].toLocaleDateString()}</p>
                </div>
              )}

              <TimePicker
                onTimeSelected={handleTimeSelected}
              />


              {/* Thanh thông tin cố định ở dưới cùng */}
              {selectedDateRange && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-lg">
                  <div>
                    <div className="font-bold">
                      {formatDateTime()}
                    </div>
                    <div className="flex items-center">
                      Thời gian thuê: <span className="text-green-500 font-medium ml-1">{calculateRentalDays()} ngày</span>
                      <button className="ml-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    className="bg-green-500 text-white font-medium px-8 py-3 rounded-lg"
                    onClick={() => {
                      // Xử lý khi nhấn nút Tiếp tục
                      console.log('Tiếp tục với thông tin:', {
                        dateRange: selectedDateRange,
                        timeRange: selectedTime
                      });
                      // Thêm xử lý chuyển trang hoặc chuyển bước tiếp theo ở đây
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              )}

              {/* Thêm khoảng trống để tránh bị che bởi thanh fixed */}
              <div className="h-24"></div>
            </div>
          );
        }
      case 'reviews':
        return <ReviewsSection profile={profile} />;
      default:
        return <ProfileContent profile={profile} />;
    }
  };

  return (
    <ProfileLayout
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onClose={onClose}
      district={district}
      dateRange={dateRange}
      className="font-['SVN-Gilroy']"
    >
      {renderContent()}
    </ProfileLayout>
  );
};

export default ProfilePage;