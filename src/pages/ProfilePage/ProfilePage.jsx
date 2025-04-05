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
  const [bookingStep, setBookingStep] = useState('select-time');
  const [careType, setCareType] = useState(''); // 'home' or 'hospital'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    // Home care fields
    homeAddress: '',
    // Hospital care fields
    hospitalName: '',
    hospitalAddress: '',
    floor: '',
    roomNumber: ''
  });

  const calculateRentalDays = () => {
    if (!selectedDateRange) return 0;

    const start = new Date(selectedDateRange[0]);
    const end = new Date(selectedDateRange[1]);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays || 1;
  };

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
      setBookingStep('select-time'); // Reset booking step when switching tabs
    }
  };

  const handleSelectTimePickerView = (range) => {
    setSelectedDateRange(range);
    setScheduleView('timePicker');
  };

  const handleTimeSelected = (startTime, endTime) => {
    setSelectedTime({
      startTime,
      endTime
    });
  };

  // Handle continue button click
  const handleContinue = () => {
    console.log('Tiếp tục với thông tin:', {
      dateRange: selectedDateRange,
      timeRange: selectedTime
    });

    // Instead of going directly to booking details, show care type selection
    setBookingStep('care-type-selection');
  };

  const handleCareTypeSelection = (type) => {
    setCareType(type);
    setBookingStep('booking-details');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleConfirmBooking = () => {
    // Get selected dates in required format (YYYY-MM-DD)
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    // Format date range into array of date strings
    const days = [];
    if (selectedDateRange && selectedDateRange.length === 2) {
      const startDate = new Date(selectedDateRange[0]);
      const endDate = new Date(selectedDateRange[1]);
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        days.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  
    // Format time with seconds
    const formatTime = (timeString) => {
      return timeString + ":00";
    };
  
    // Prepare request body exactly as seen in Postman
    const requestBody = {
      placeName: careType === 'home' ? "Chung Cư Gold" : formData.hospitalName,
      locationType: careType === 'home' ? "HOME" : "HOSPITAL",
      bookingAddress: careType === 'home' ? formData.homeAddress : formData.hospitalAddress,
      descriptionPlace: careType === 'home' ? "" : `Tầng ${formData.floor}, Phòng ${formData.roomNumber}`,
      days: days,
      timeToStart: formatTime(selectedTime.startTime),
      timeToEnd: formatTime(selectedTime.endTime)
    };
  
    console.log("Sending request:", requestBody);
  
    // Here, ensure that careTakerId is passed correctly, for example from props or state
    const careTakerId = profile?.id || 1; // Replace `profile?.id` with actual dynamic value
  
    // Make the API call with exact URL and request body
    const token = localStorage.getItem('token'); // hoặc lấy từ state/context

    fetch(`http://localhost:8080/api/booking?careTakerId=${careTakerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Thêm token xác thực
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error("API error response:", text);
          throw new Error('API call failed');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful:', data);
      alert('Đặt lịch thành công!');
      onClose(); // Close the modal/navigate away
    })
    .catch(error => {
      console.error('Error during booking:', error);
      alert('Đặt lịch thất bại. Vui lòng thử lại!');
    });
  };
  
  // Render the care type selection view
  const renderCareTypeSelectionView = () => {
    return (
      <div className="bg-gray-100 p-4" style={{ minHeight: '700px' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mt-4 mb-7">
            <button
              className="flex items-center text-black-500 hover:text-black-700 transition-colors"
              onClick={() => setBookingStep('select-time')}
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
              <span>Quay lại chọn giờ</span>
            </button>
          </div>

          {/* Home Care Section */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="overflow-hidden rounded-t-lg" style={{ height: "300px" }}>
              <img
                src="https://pkgdvietuc.com/wp-content/uploads/2024/06/phong-kham-viet-uc-cham-soc-nguoi-benh-bi-sot-tai-nha.webp"
                alt="A caregiver assisting an elderly person at home"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Chăm sóc tại nhà</h2>
              <p className="text-gray-500 mb-4">Chăm sóc tại nhà - Tiện lợi</p>
              <p className="text-gray-700 mb-6">
                Dịch vụ chăm sóc tại nhà của CareNow mang đến sự chăm sóc tận tình ngay tại ngôi nhà của bạn.
                Với đội ngũ bảo mẫu chuyên nghiệp, chúng tôi cung cấp dịch vụ chăm sóc cho trẻ em, người già, mẹ
                sau sinh và các bệnh nhân cần sự chăm sóc đặc biệt. Chúng tôi luôn sẵn sàng đến tận nơi, giúp bạn
                yên tâm hơn về sức khỏe của người thân yêu.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
                  onClick={() => handleCareTypeSelection('home')}
                >
                  Tiếp tục
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Hospital Care Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-hidden rounded-t-lg" style={{ height: "300px" }}>
              <img
                src="https://giupviecgiaphu.com/upload/news/3.3-nguyen-tac-cham-soc-nguoi-benh-trong-benh-vien-0892.jpg"
                alt="A caregiver assisting an elderly person in a hospital"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Chăm sóc tại bệnh viện</h2>
              <p className="text-gray-500 mb-4">Chăm sóc tại bệnh viện - Chuyên nghiệp</p>
              <p className="text-gray-700 mb-6">
                Dịch vụ chăm sóc tại bệnh viện của CareNow hỗ trợ bệnh nhân trong môi trường y tế chuyên nghiệp.
                Đội ngũ bảo mẫu và chuyên viên y tế của chúng tôi sẽ giúp bệnh nhân phục hồi nhanh chóng, giảm
                sát sức khỏe, hỗ trợ ăn uống, vệ sinh và các nhu cầu y tế khác trong suốt thời gian nằm viện.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
                  onClick={() => handleCareTypeSelection('hospital')}
                >
                  Tiếp tục
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the booking details view
  const renderBookingDetailsView = () => {
    return (
      <div className="p-4" style={{ minHeight: '700px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-grow">
          <div className="flex items-center mt-4 mb-7">
            <button
              className="flex items-center text-black-500 hover:text-black-700 transition-colors"
              onClick={() => setBookingStep('care-type-selection')}
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
              <span>Quay lại chọn dịch vụ</span>
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">Chi tiết đặt lịch</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Thông tin đã chọn</h3>
            <div className="text-sm">
              <p className="mb-1">Thời gian: {formatDateTime()}</p>
              <p className="mb-1">Số ngày thuê: {calculateRentalDays()} ngày</p>
              <p>Loại dịch vụ: {careType === 'home' ? 'Chăm sóc tại nhà' : 'Chăm sóc tại bệnh viện'}</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên của bạn</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Conditional fields based on care type */}
            {careType === 'home' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập địa chỉ nhà cụ thể</label>
                <input
                  type="text"
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập địa chỉ nhà cụ thể"
                />
              </div>
            )}

            {careType === 'hospital' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên bệnh viện</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập tên bệnh viện"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhập địa chỉ bệnh viện cụ thể</label>
                  <input
                    type="text"
                    name="hospitalAddress"
                    value={formData.hospitalAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập địa chỉ bệnh viện cụ thể"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tầng</label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Nhập số tầng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng</label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Nhập số phòng"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Thêm ghi chú nếu có"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bottom bar (not fixed) */}
        <div className="mt-auto border-t border-gray-200 p-4 bg-white flex justify-between items-center shadow-sm">
          <div>
            <div className="font-bold">
              {formatDateTime()}
            </div>
            <div className="flex items-center">
              Thời gian thuê: <span className="text-green-500 font-medium ml-1">{calculateRentalDays()} ngày</span>
            </div>
          </div>
          <button
            className="bg-green-500 text-white font-medium px-8 py-3 rounded-lg"
            onClick={() => setBookingStep('confirmation')}
          >
            Xác nhận đặt lịch
          </button>
        </div>
      </div>
    );
  };

  // Render the confirmation step view
  const renderConfirmationView = () => {
    return (
      <div className="p-4 flex flex-col" style={{ minHeight: '700px' }}>
        <div className="flex items-center mt-4 mb-7">
          <button
            className="flex items-center text-black-500 hover:text-black-700 transition-colors"
            onClick={() => setBookingStep('booking-details')}
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
            <span>Quay lại</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-green-600 mb-4">Xác nhận và thanh toán</h1>

          {/* Place details section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Vị trí làm việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  {careType === 'home' ? (
                    <>
                      <h3 className="font-medium">Chăm sóc tại nhà</h3>
                      <p className="text-gray-600 text-sm">{formData.homeAddress}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium">{formData.hospitalName}</h3>
                      <p className="text-gray-600 text-sm">{formData.hospitalAddress}</p>
                      <p className="text-gray-600 text-sm">Tầng {formData.floor}, Phòng {formData.roomNumber}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{formData.name}</h3>
                  <p className="text-gray-600 text-sm">{formData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time details section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Thông tin công việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Thời gian làm việc</h3>
                  <p className="text-sm text-gray-600">Thứ hai, {formatDateTime()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Làm trong</h3>
                  <p className="text-sm text-gray-600">4 giờ, 14:00 đến 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service details section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Chi tiết công việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Chăm sóc người bệnh</h3>
                  <p className="text-sm text-gray-600">
                    {careType === 'home'
                      ? 'Bệnh nhân chăm sóc tại nhà, hỗ trợ trong sinh hoạt và theo dõi sức khỏe.'
                      : 'Bệnh nhân chăm sóc tại bệnh viện, cần hỗ trợ và theo dõi 24/7.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total section */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Tổng cộng</h2>
              <span className="text-xl font-bold text-green-600">480,000</span>
            </div>
          </div>

          {/* Confirm button */}
          <button
  className="w-full bg-green-600 text-white font-medium py-3 rounded-lg"
  onClick={handleConfirmBooking}
>
  Thanh toán
</button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent profile={profile} />;
      case 'services':
        return <TasksAccordion profile={profile} />;
      case 'schedule':
        if (scheduleView === 'calendar') {
          return <ScheduleSection profile={profile} onSelectTimePickerView={handleSelectTimePickerView} />;
        } else if (scheduleView === 'timePicker') {
          if (bookingStep === 'select-time') {
            return (
              <div className="p-4 flex flex-col" style={{ minHeight: '700px' }}>
                <div className="flex-grow">
                  <div className="flex items-center mt-4 mb-7">
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

                  <TimePicker onTimeSelected={handleTimeSelected} />
                </div>

                {/* Bottom bar (not fixed) */}
                {selectedDateRange && (
                  <div className="mt-auto border-t border-gray-200 p-4 bg-white flex justify-between items-center shadow-sm">
                    <div>
                      <div className="font-bold">{formatDateTime()}</div>
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
                      onClick={handleContinue}
                    >
                      Tiếp tục
                    </button>
                  </div>
                )}
              </div>
            );
          } else if (bookingStep === 'care-type-selection') {
            return renderCareTypeSelectionView();
          } else if (bookingStep === 'booking-details') {
            return renderBookingDetailsView();
          } else if (bookingStep === 'confirmation') {
            return renderConfirmationView();
          }
        }
        return null;
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
    >
      {renderContent()}
    </ProfileLayout>
  );
};

export default ProfilePage;
