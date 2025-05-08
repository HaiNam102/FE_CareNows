import React, { useState, useEffect } from 'react';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import ProfileContent from './ProfileContent';
import TasksAccordion from './TasksAccordion';
import ReviewsSection from './ReviewsSection';
import ScheduleSection from './ScheduleSection/ScheduleSection';
import TimePicker from '../../components/TimePicker';
import NannySchedulePopup from '../../components/NannySchedulePopup';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// SuccessPopup Component
const SuccessPopup = ({ message, onClose }) => {
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsVisible(false);
    onClose();
  }, 6000);

  return () => clearTimeout(timer);
}, [onClose]);

if (!isVisible) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg transform transition-all duration-300 scale-100">
      <div className="flex flex-col items-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-lg font-semibold text-[#00A37D] text-center">{message}</h3>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="mt-4 bg-[#00A37D] text-white px-4 py-2 rounded-lg hover:bg-[#008C66] transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
);
};

// CareRecipientSelector Component
const CareRecipientSelector = ({ onSelectRecipient, onBack, onContinue }) => {
const [recipients, setRecipients] = useState([]);
const [selectedRecipient, setSelectedRecipient] = useState(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/careRecipient/customer', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Dữ liệu từ API careRecipient/customer:', response.data);

      if (response.data.code === 1010) {
        console.log('Danh sách recipients:', response.data.data);
        setRecipients(response.data.data);
      } else {
        toast.error('Không thể tải danh sách bệnh nhân');
      }
    } catch (error) {
      console.error('Error fetching care recipients:', error);
      toast.error('Không thể tải danh sách bệnh nhân');
    } finally {
      setIsLoading(false);
    }
  };

  fetchRecipients();
}, []); // Không cần phụ thuộc, chỉ gọi một lần khi component mount

const handleSelect = (recipient) => {
  setSelectedRecipient(recipient);
  onSelectRecipient(recipient);
};

return (
  <div className="p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col min-h-[700px] transition-all duration-300">
    <div className="flex items-center mb-6">
      <button
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        onClick={onBack}
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

    <h2 className="text-2xl font-bold text-gray-800 mb-6">Chọn bệnh nhân</h2>

    {isLoading ? (
      <div className="flex justify-center my-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00A37D]"></div>
      </div>
    ) : recipients.length > 0 ? (
      <div className="space-y-4">
        {recipients.map((recipient) => (
          <div
            key={recipient.careRecipientId}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRecipient?.careRecipientId === recipient.careRecipientId
                ? 'border-[#00A37D] bg-[#00A37D] bg-opacity-10'
                : 'border-gray-200'
            }`}
            onClick={() => handleSelect(recipient)}
          >
            <h3 className="font-semibold text-gray-800">{recipient.name}</h3> 
            <p className="text-sm text-gray-600">Giới tính: {recipient.gender === "FEMALE" ? "Nữ" : "Nam"}</p>
            <p className="text-sm text-gray-600">Số tuổi: {recipient.yearOld}</p>
            <p className="text-sm text-gray-600">Tình trạng: {recipient.specialDetail}</p> 
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">Không có bệnh nhân nào được đăng ký</p>
    )}

    <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end">
      <button
        className="bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={() => {
          if (!selectedRecipient) {
            toast.error('Vui lòng chọn một bệnh nhân trước khi tiếp tục');
            return;
          }
          onContinue();
        }}
        disabled={!selectedRecipient}
      >
        Tiếp tục
      </button>
    </div>
  </div>
);
};

// ProfilePage Component
const ProfilePage = ({ profile, onClose, onNavigate, district, dateRange }) => {
  const location = useLocation();
  const navigate = useNavigate();
const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
const [scheduleView, setScheduleView] = useState('recipientSelection');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTime, setSelectedTime] = useState({
  startTime: '19:00',
  endTime: '20:00',
  });
const [bookingStep, setBookingStep] = useState('select-recipient');
const [careType, setCareType] = useState('');
  const [careTakerId, setCareTakerId] = useState(null);
const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [formData, setFormData] = useState({
  placeName: '',
  bookingAddress: '',
    notes: '',
    floor: '',
  roomNumber: '',
  });
  const [showAllDates, setShowAllDates] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
const [formErrors, setFormErrors] = useState({});
const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const idFromUrl = urlParams.get('id');

    if (idFromUrl) {
      navigate('/searchResult', { replace: true });
    }
}, [location.search, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const idFromUrl = urlParams.get('id');
    
    if (idFromUrl) {
      const parsedId = parseInt(idFromUrl, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        setCareTakerId(parsedId);
        return;
      }
    }
    
    if (profile?.careTakerId) {
      const parsedId = parseInt(profile.careTakerId, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        setCareTakerId(parsedId);
        return;
      }
    }
    
    if (profile?.id) {
      const parsedId = parseInt(profile.id, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        setCareTakerId(parsedId);
        return;
      }
    }

    setCareTakerId(null);
  }, [profile, location.search]);

  useEffect(() => {
    if (!careTakerId || activeTab !== 'schedule') {
      setIsLoadingDates(false);
      return;
    }
  
    setAvailableDates([]);
    setIsLoadingDates(true);
  
    const fetchAvailableDates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/calendar/caretaker/${careTakerId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
          const dates = response.data.data
            .filter((item) => item && item.day)
            .map((item) => {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(item.day)) return null;
              const [year, month, day] = item.day.split('-').map(Number);
              const date = new Date(year, month - 1, day);
              return isNaN(date.getTime()) ? null : date;
            })
            .filter((date) => date !== null);
  
          setAvailableDates(dates);
        } else {
          toast.error('Không thể tải lịch làm việc');
        }
      } catch (error) {
        console.error('Error fetching caretaker schedule:', error);
        toast.error('Không thể tải lịch làm việc');
      } finally {
        setIsLoadingDates(false);
      }
    };
  
    fetchAvailableDates();
  }, [careTakerId, activeTab]); // Chỉ gọi khi activeTab là 'schedule'

  const handleSelectCareTaker = (newCareTakerId) => {
    if (newCareTakerId) {
      const parsedId = parseInt(newCareTakerId, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
          setCareTakerId(parsedId);
          navigate(`?id=${parsedId}`);
      } else {
      toast.error('ID bảo mẫu không hợp lệ');
      }
    } else {
      setCareTakerId(null);
      setAvailableDates([]);
    setSelectedDateRange(null);
      navigate('');
    }
  };

  const calculateRentalDays = () => {
    if (!selectedDateRange || selectedDateRange.length === 0) return 0;
    return selectedDateRange.length;
  };

  const formatDateTime = () => {
  if (!selectedDateRange || selectedDateRange.length === 0) return '';

  const formattedDates = selectedDateRange.map(date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }).join(', ');

  return `${selectedTime.startTime} đến ${selectedTime.endTime} trong ngày ${formattedDates}`;
};

  const handleNavigate = (tab, district, dateRange) => {
    setActiveTab(tab);
    if (tab === 'schedule') {
    setScheduleView('recipientSelection');
    setBookingStep('select-recipient');
    }
  };

  const handleCareTypeSelection = (type) => {
    setCareType(type);
    setBookingStep('booking-details');
    setScheduleView('bookingDetails');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  setFormErrors((prev) => ({
    ...prev,
    [name]: '',
  }));
};

const validateForm = () => {
  const errors = {};
  if (careType === 'home') {
    if (!formData.bookingAddress.trim()) {
      errors.bookingAddress = 'Vui lòng nhập địa chỉ nhà cụ thể';
      toast.error('Vui lòng nhập địa chỉ nhà cụ thể');
    }
    if (!formData.notes.trim()) {
      errors.notes = 'Vui lòng nhập ghi chú';
      toast.error('Vui lòng nhập ghi chú');
    }
  } else if (careType === 'hospital') {
    if (!formData.placeName.trim()) {
      errors.placeName = 'Vui lòng nhập tên bệnh viện';
      toast.error('Vui lòng nhập tên bệnh viện');
    }
    if (!formData.bookingAddress.trim()) {
      errors.bookingAddress = 'Vui lòng nhập địa chỉ bệnh viện cụ thể';
      toast.error('Vui lòng nhập địa chỉ bệnh viện cụ thể');
    }
    if (!formData.floor.trim()) {
      errors.floor = 'Vui lòng nhập số tầng';
      toast.error('Vui lòng nhập số tầng');
    }
    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Vui lòng nhập số phòng';
      toast.error('Vui lòng nhập số phòng');
    }
    if (!formData.notes.trim()) {
      errors.notes = 'Vui lòng nhập ghi chú';
      toast.error('Vui lòng nhập ghi chú');
    }
  }
  setFormErrors(errors);
  return errors;
};

const handleContinueToCareTypeSelection = () => {
  setBookingStep('care-type-selection');
  setScheduleView('careTypeSelection');
};

const handleContinueToBookingDetails = () => {
  const errors = validateForm();
  if (Object.keys(errors).length === 0) {
    setBookingStep('booking-details');
    setScheduleView('bookingDetails');
  }
  };

  const handleContinueToSchedule = () => {
  const errors = validateForm();
  if (Object.keys(errors).length === 0) {
    setBookingStep('select-date');
    setScheduleView('calendar');
  }
  };

  const handleSelectTimePickerView = (range) => {
  if (!range || range.length === 0) {
    toast.error('Vui lòng chọn ít nhất một ngày');
    return;
  }
    setSelectedDateRange(range);
    setScheduleView('timePicker');
    setBookingStep('select-time');
  };

  const handleTimeSelected = (startTime, endTime) => {
    setSelectedTime({
      startTime,
    endTime,
    });
  };

  const handleContinueToConfirmation = () => {
  if (!selectedTime.startTime || !selectedTime.endTime) {
    toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
    return;
  }
    setBookingStep('confirmation');
    setScheduleView('confirmation');
  };

const calculateTotalPrice = () => {
  const pricePerHour = 120;
  const startTime = selectedTime.startTime.split(':').map(Number);
  const endTime = selectedTime.endTime.split(':').map(Number);

  let hours = 0;
  if (endTime[0] < startTime[0]) {
    hours = (24 - startTime[0] + endTime[0]) + (endTime[1] - startTime[1]) / 60;
  } else {
    hours = (endTime[0] - startTime[0]) + (endTime[1] - startTime[1]) / 60;
  }

  const days = selectedDateRange ? selectedDateRange.length : 0;
  return pricePerHour * hours * days;
};

const handleConfirmBooking = async () => {
    if (!careTakerId) {
    toast.error('Vui lòng chọn bảo mẫu');
    return;
  }
  if (!selectedRecipient) {
    toast.error('Vui lòng chọn bệnh nhân');
    return;
  }
  if (!selectedDateRange || selectedDateRange.length === 0) {
    toast.error('Vui lòng chọn ngày đặt lịch');
    return;
  }
  if (!selectedTime.startTime || !selectedTime.endTime) {
    toast.error('Vui lòng chọn thời gian');
    return;
  }
  
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
      return;
    }
  
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
  const days = selectedDateRange.map((date) => formatDate(date));

  try {
    const requestBody = {
      placeName: careType === 'home' ? (formData.placeName || 'Nhà riêng') : formData.placeName,
      locationType: careType === 'home' ? 'HOME' : 'HOSPITAL',
      bookingAddress: formData.bookingAddress,
      descriptionPlace: careType === 'home' ? 'Nhà riêng' : `Tầng ${formData.floor}, Phòng ${formData.roomNumber}`,
      days: days,
      timeToStart: `${selectedTime.startTime}:00`,
      timeToEnd: `${selectedTime.endTime}:00`,
      jobDescription: formData.notes,
      careRecipientId: selectedRecipient.careRecipientId,
      price: calculateTotalPrice(),
    };
  
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/booking?careTakerId=${careTakerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đặt lịch thất bại');
    }

    toast.success('Đặt lịch thành công!');
    setShowSuccessPopup(true);
  } catch (error) {
   
    toast.error(error.message || 'Đặt lịch thất bại. Vui lòng thử lại!');
    console.error('Booking error:', error);
  }
  };

  const handleAvailableDates = (dates) => {
    setAvailableDates(dates);
  };

const renderRecipientSelectionView = () => {
  return (
    <CareRecipientSelector
      onSelectRecipient={(recipient) => setSelectedRecipient(recipient)}
      onBack={() => setActiveTab('profile')}
      onContinue={handleContinueToCareTypeSelection}
    />
  );
  };

  const renderCareTypeSelectionView = () => {
    const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAvailableDates = availableDates.filter((date) => {
      const dateToCompare = new Date(date);
      dateToCompare.setHours(0, 0, 0, 0);
    return dateToCompare >= today;
    });

    return (
    <div className="p-6 bg-gray-50 min-h-[700px]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => {
              setBookingStep('select-recipient');
              setScheduleView('recipientSelection');
            }}
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
            <span>Quay lại chọn bệnh nhân</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <img
                src="https://pkgdvietuc.com/wp-content/uploads/2024/06/phong-kham-viet-uc-cham-soc-nguoi-benh-bi-sot-tai-nha.webp"
              alt="Care at home"
              className="w-full h-48 object-cover"
              />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#00A37D] mb-3">Chăm sóc tại nhà</h2>
              <p className="text-gray-600 mb-4">
                Dịch vụ chăm sóc tại nhà mang đến sự tiện lợi và tận tâm ngay tại nơi bạn ở.
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Ngày làm việc có sẵn ({filteredAvailableDates.length}):</h3>
                {isLoadingDates ? (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00A37D]"></div>
                  </div>
                ) : filteredAvailableDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filteredAvailableDates.slice(0, 6).map((date, index) => (
                      <span
                        key={index}
                        className="bg-[#00A37D] bg-opacity-10 px-2 py-1 rounded-full text-sm text-[#00A37D]"
                      >
                        {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                      </span>
                    ))}
                    {filteredAvailableDates.length > 6 && (
                      <span className="text-[#00A37D] text-sm">
                        +{filteredAvailableDates.length - 6} ngày khác
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">Không có ngày làm việc nào</p>
                )}
              </div>
                <button
                className="w-full bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300"
                onClick={() => handleCareTypeSelection('home')}
              >
                Chọn dịch vụ
                </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <img
                src="https://giupviecgiaphu.com/upload/news/3.3-nguyen-tac-cham-soc-nguoi-benh-trong-benh-vien-0892.jpg"
              alt="Care at hospital"
              className="w-full h-48 object-cover"
              />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#00A37D] mb-3">Chăm sóc tại bệnh viện</h2>
              <p className="text-gray-600 mb-4">
                Dịch vụ chăm sóc chuyên nghiệp tại bệnh viện, hỗ trợ bệnh nhân phục hồi nhanh chóng.
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Ngày làm việc có sẵn ({filteredAvailableDates.length}):</h3>
                {isLoadingDates ? (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00A37D]"></div>
                  </div>
                ) : filteredAvailableDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filteredAvailableDates.slice(0, 6).map((date, index) => (
                      <span
                        key={index}
                        className="bg-[#00A37D] bg-opacity-10 px-2 py-1 rounded-full text-sm text-[#00A37D]"
                      >
                        {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                      </span>
                    ))}
                    {filteredAvailableDates.length > 6 && (
                      <span className="text-[#00A37D] text-sm">
                        +{filteredAvailableDates.length - 6} ngày khác
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">Không có ngày làm việc nào</p>
                )}
              </div>
                <button
                className="w-full bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300"
                  onClick={() => handleCareTypeSelection('hospital')}
                >
                Chọn dịch vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingDetailsView = () => {
    return (
    <div className="p-6 bg-gray-50 rounded-lg flex flex-col min-h-[700px] transition-all duration-300">
      <div className="flex items-center mb-6">
            <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => {
                setBookingStep('care-type-selection');
                setScheduleView('careTypeSelection');
              }}
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết đặt lịch</h2>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            {careType === 'home' && (
          <>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tòa nhà (nếu có)
              </label>
                <input
                  type="text"
                name="placeName"
                value={formData.placeName}
                  onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                  formErrors.placeName ? 'border-red-500' : ''
                }`}
                placeholder="Nhập tên tòa nhà (nếu có)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ nhà cụ thể *
              </label>
              <input
                type="text"
                name="bookingAddress"
                value={formData.bookingAddress}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                  formErrors.bookingAddress ? 'border-red-500' : ''
                }`}
                  placeholder="Nhập địa chỉ nhà cụ thể"
                />
              {formErrors.bookingAddress && (
                <p className="text-red-500 text-sm mt-1">{formErrors.bookingAddress}</p>
              )}
              </div>
          </>
            )}

            {careType === 'hospital' && (
              <>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên bệnh viện *
              </label>
                  <input
                    type="text"
                name="placeName"
                value={formData.placeName}
                    onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                  formErrors.placeName ? 'border-red-500' : ''
                }`}
                    placeholder="Nhập tên bệnh viện"
                  />
              {formErrors.placeName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.placeName}</p>
              )}
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ bệnh viện cụ thể *
              </label>
                  <input
                    type="text"
                name="bookingAddress"
                value={formData.bookingAddress}
                    onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                  formErrors.bookingAddress ? 'border-red-500' : ''
                }`}
                    placeholder="Nhập địa chỉ bệnh viện cụ thể"
                  />
              {formErrors.bookingAddress && (
                <p className="text-red-500 text-sm mt-1">{formErrors.bookingAddress}</p>
              )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tầng *
                </label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                    formErrors.floor ? 'border-red-500' : ''
                  }`}
                      placeholder="Nhập số tầng"
                    />
                {formErrors.floor && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.floor}</p>
                )}
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng *
                </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
                    formErrors.roomNumber ? 'border-red-500' : ''
                  }`}
                      placeholder="Nhập số phòng"
                    />
                {formErrors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.roomNumber}</p>
                )}
                  </div>
                </div>
              </>
            )}

            <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú *</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A37D] hover:border-[#A7F3D0] transition-all duration-300 ${
              formErrors.notes ? 'border-red-500' : ''
            }`}
                rows="4"
                placeholder="Thêm ghi chú nếu có"
          />
          {formErrors.notes && <p className="text-red-500 text-sm mt-1">{formErrors.notes}</p>}
          </div>
        </div>

      <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end">
          <button
          className="bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300"
            onClick={handleContinueToSchedule}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  };

  const renderScheduleSelectionView = () => {
    return (
    <div className="p-6 bg-gray-50 flex flex-col min-h-[700px] transition-all duration-300">
      <div className="flex items-center mb-6">
            <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => {
                setBookingStep('booking-details');
                setScheduleView('bookingDetails');
              }}
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
          <span>Quay lại chi tiết đặt lịch</span>
            </button>
          </div>

          <ScheduleSection
            profile={profile}
            onSelectTimePickerView={handleSelectTimePickerView}
            careTakerId={careTakerId}
            availableDates={availableDates}
            onSelectAvailableDates={handleAvailableDates}
          />
      </div>
    );
  };

  const renderTimePickerView = () => {
    return (
    <div className="p-6 bg-gray-50 flex flex-col min-h-[700px] transition-all duration-300">
      <div className="flex items-center mb-6">
            <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => {
                setScheduleView('calendar');
                setBookingStep('select-date');
              }}
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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chọn giờ đặt lịch</h2>
            <NannySchedulePopup careTakerId={careTakerId} selectedDateRange={selectedDateRange} />
          </div>

          {selectedDateRange && selectedDateRange.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-700 font-medium">Ngày đã chọn:</p>
              <div className="flex gap-2 flex-wrap">
            {showAllDates ? (
              <>
                {selectedDateRange.map((date, index) => (
                  <span
                    key={index}
                    className="bg-[#00A37D] bg-opacity-10 px-3 py-1 rounded-full text-sm text-[#00A37D]"
                  >
                    {date.toLocaleDateString()}
                  </span>
                ))}
                <span
                  className="text-[#00A37D] cursor-pointer text-sm"
                  onClick={() => setShowAllDates(false)}
                >
                  Thu gọn
                </span>
              </>
            ) : (
              <>
                {selectedDateRange.slice(0, 3).map((date, index) => (
                  <span
                    key={index}
                    className="bg-[#00A37D] bg-opacity-10 px-3 py-1 rounded-full text-sm text-[#00A37D]"
                  >
                    {date.toLocaleDateString()}
                  </span>
                ))}
                {selectedDateRange.length > 3 && (
                  <span
                    className="text-[#00A37D] cursor-pointer text-sm"
                    onClick={() => setShowAllDates(true)}
                  >
                    +{selectedDateRange.length - 3} ngày khác
                  </span>
                )}
              </>
                )}
              </div>
            </div>
          )}

          <TimePicker onTimeSelected={handleTimeSelected} />

        {selectedDateRange && (
        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
            {/* <div className="font-bold text-gray-800">{formatDateTime()}</div> */}
            <div className="flex items-center text-gray-600">
              Thời gian thuê:{' '}
              <span className="text-[#00A37D] font-medium ml-1">{calculateRentalDays()} ngày</span>
              </div>
            </div>
            <button
            className="bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300"
              onClick={() => {
              if (!selectedTime.startTime || !selectedTime.endTime) {
                toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
                return;
              }
                handleContinueToConfirmation();
              }}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderConfirmationView = () => {
    return (
    <div className="p-6 bg-gray-50 flex flex-col min-h-[700px] transition-all duration-300">
      <div className="flex items-center mb-6">
          <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => {
              setBookingStep('select-time');
              setScheduleView('timePicker');
            }}
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

      <div className=" rounded-xl  p-6">
        <h1 className="text-2xl font-bold text-[#00A37D] mb-6">Xác nhận và thanh toán</h1>

          <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Vị trí làm việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-[#00A37D] bg-opacity-10 rounded-full p-2 mr-3">
                <svg
                  className="w-5 h-5 text-[#00A37D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  </svg>
                </div>
                <div>
                  {careType === 'home' ? (
                    <>
                    <h3 className="font-medium text-gray-800">
                      {formData.placeName || 'Nhà riêng'}
                    </h3>
                    <p className="text-gray-600 text-sm">{formData.bookingAddress}</p>
                    </>
                  ) : (
                    <>
                    <h3 className="font-medium text-gray-800">{formData.placeName}</h3>
                    <p className="text-gray-600 text-sm">{formData.bookingAddress}</p>
                    <p className="text-gray-600 text-sm">
                      Tầng {formData.floor}, Phòng {formData.roomNumber}
                    </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                  </svg>
                </div>
                <div>
                <h3 className="font-medium text-gray-800">{selectedRecipient?.name}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Thông tin công việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                  </svg>
                </div>
                <div>
                <h3 className="font-medium text-gray-800">Thời gian làm việc</h3>
                  <p className="text-sm text-gray-600">{formatDateTime()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2 mr-3">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  </svg>
                </div>
                <div>
                <h3 className="font-medium text-gray-800">Làm trong</h3>
                  <p className="text-sm text-gray-600">{calculateRentalDays()} ngày</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết công việc</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                  </svg>
                </div>
                <div>
                <h3 className="font-medium text-gray-800">Ghi chú công việc</h3>
                <p className="text-sm text-gray-600">{formData.notes}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Tổng cộng</h2>
            <span className="text-xl font-bold text-[#00A37D]">
              {calculateTotalPrice().toLocaleString()}.000 VNĐ
            </span>
            </div>
          </div>

          <button
          className="w-full bg-gradient-to-r from-[#00A37D] to-[#00C495] text-white font-medium py-2 px-6 rounded-lg hover:from-[#008C66] hover:to-[#00A37D] transition-all duration-300"
            onClick={handleConfirmBooking}
          >
            Gửi yêu cầu với bảo mẫu
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent 
          profile={profile} 
          onCareTakerSelect={handleSelectCareTaker} 
          onNavigate={handleNavigate}
        />;
      case 'services':
        return <TasksAccordion profile={profile} />;
      case 'schedule':
      if (scheduleView === 'recipientSelection') {
        return renderRecipientSelectionView();
      } else if (scheduleView === 'careTypeSelection') {
          return renderCareTypeSelectionView();
        } else if (scheduleView === 'bookingDetails') {
          return renderBookingDetailsView();
        } else if (scheduleView === 'calendar') {
          return renderScheduleSelectionView();
        } else if (scheduleView === 'timePicker') {
          return renderTimePickerView();
        } else if (scheduleView === 'confirmation') {
          return renderConfirmationView();
        }
        return null;
      case 'reviews':
        return <ReviewsSection profile={profile} careTakerId={careTakerId} />;
      default:
        return <ProfileContent profile={profile} onCareTakerSelect={handleSelectCareTaker} />;
    }
  };

  return (
  <>
    <ProfileLayout
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onClose={onClose}
      district={district}
      dateRange={dateRange}
    >
      {renderContent()}
    </ProfileLayout>
    {showSuccessPopup && (
      <SuccessPopup
        message="Đặt lịch thành công, bảo mẫu sẽ xác nhận đơn với bạn sớm nhé"
        onClose={onClose}
      />
    )}
    <ToastContainer/>
  </>
  );
};

export default ProfilePage;