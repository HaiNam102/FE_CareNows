import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUserCircle, faMapMarkerAlt, faStethoscope, faCheckCircle, faClock, faUser, faHospital, faHome, faMoneyBill, faInfoCircle, faFileLines, faTimes, faMars, faVenus, faBriefcase, faCalendarCheck, faCalendarWeek, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CareTakerProfile from './CareTakerProfile';
import DashboardCareTaker from './DashboardCareTaker';

// Đọc currentPage từ localStorage nếu có
const getInitialPage = () => {
  return localStorage.getItem('caretaker_currentPage') || 'profile';
};

const CareTaker = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [paymentTab, setPaymentTab] = useState('unpaid');
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [userData, setUserData] = useState({ name: '', lastLogin: '' });
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [loadingRecipient, setLoadingRecipient] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [existingDates, setExistingDates] = useState([]);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [calendarView, setCalendarView] = useState('month');
  const [deletingCalendar, setDeletingCalendar] = useState(false);
  const [careTakerId, setCareTakerId] = useState(null);
  const [processingBookingId, setProcessingBookingId] = useState(null);

  useEffect(() => {
    if (currentPage === 'appointments') {
      fetchBookings();
    } else if (currentPage === 'results') {
      fetchPayments();
    } else if (currentPage === 'schedule') {
      fetchCareTakerCalendar();
    } else if (currentPage === 'calendar') {
      fetchCareTakerCalendar();
      fetchCalendarBookings();
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        if (decoded) {
          setUserData({
            name: decoded.username || 'User',
            lastLogin: new Date().toLocaleDateString('vi-VN')
          });
          // Set careTakerId from token
          if (decoded.user_id) {
            setCareTakerId(decoded.user_id);
          }
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, [currentPage, currentMonth]);

  // Khi chuyển tab, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('caretaker_currentPage', currentPage);
  }, [currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/booking/caretaker');
      console.log("Response data:", response.data.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        const enhancedData = response.data.data.map((booking, index) => ({
          ...booking,
          id: booking.bookingId || index,
          status: booking.serviceProgress || (index % 3 === 0 ? 'PENDING' : index % 3 === 1 ? 'ACCEPT' : 'REJECT')
        }));

        console.log("Enhanced bookings:", enhancedData);
        setBookings(enhancedData);
      } else {
        console.log("Response is not an array or is empty");
        setBookings([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPaymentLoading(true);
      const response = await api.get('/payment');
      console.log("Payment response data:", response.data.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        // Lọc những booking đã hoàn thành và có thể thanh toán
        const completedBookings = response.data.data.filter(booking =>
          booking.bookingStatus === 'COMPLETED' || booking.bookingStatus === 'ACCEPT'
        );
        console.log(completedBookings);
        setPayments(completedBookings);
      } else if (response.data && Array.isArray(response.data.data)) {
        // Lọc những booking đã hoàn thành và có thể thanh toán
        const completedBookings = response.data.data.filter(booking =>
          booking.bookingStatus === 'COMPLETED' || booking.bookingStatus === 'ACCEPT'
        );
        setPayments(completedBookings);
      } else {
        console.log("Payment response is not an array or is empty");
        setPayments([]);
      }
      setPaymentLoading(false);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPaymentError('Không thể tải dữ liệu lịch sử thanh toán. Vui lòng thử lại sau.');
      setPaymentLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    setProcessingBookingId(bookingId);
    try {
      await api.put(`/booking/${bookingId}/status?status=ACCEPT`);
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, serviceProgress: 'ACCEPT' } : booking
        )
      );
      toast.success('Đã xác nhận đơn thành công');
      setActiveTab('accepted');
      fetchBookings();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận đơn. Vui lòng thử lại.');
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    setProcessingBookingId(bookingId);
    try {
      await api.put(`/booking/${bookingId}/status?status=REJECT`);
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, serviceProgress: 'REJECT' } : booking
        )
      );
      toast.success('Đã từ chối đơn thành công');
      setActiveTab('rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi từ chối đơn. Vui lòng thử lại.');
    } finally {
      setProcessingBookingId(null);
    }
  };

  const fetchCareRecipient = async (bookingId) => {
    try {
      setLoadingRecipient(true);
      const response = await api.get(`/booking/${bookingId}/care-recipient`);
      if (response.data.data) {
        setSelectedRecipient(response.data.data);
      } else {
        toast.error('Không thể tải thông tin người được chăm sóc.');
      }
      setLoadingRecipient(false);
    } catch (error) {
      console.error('Error fetching care recipient:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin người được chăm sóc.');
      setLoadingRecipient(false);
    }
  };

  const handleShowRecipientDetails = (bookingId) => {
    fetchCareRecipient(bookingId);
    setShowRecipientModal(true);
  };

  // Format time display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert HH:MM:SS to HH:MM
    return timeString.substring(0, 5);
  };

  // Format date range display
  const formatDateRange = (days) => {
    if (!days || days.length === 0) return '';

    // If only one day
    if (days.length === 1) {
      return new Date(days[0]).toLocaleDateString('vi-VN');
    }

    // If multiple consecutive days
    const firstDay = new Date(days[0]);
    const lastDay = new Date(days[days.length - 1]);

    return `${firstDay.toLocaleDateString('vi-VN')} - ${lastDay.toLocaleDateString('vi-VN')}`;
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'pending') return booking.status === 'PENDING';
    if (activeTab === 'accepted') return booking.status === 'ACCEPT';
    if (activeTab === 'rejected') return booking.status === 'REJECT';
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    return true;
  });

  // Filter payments based on payment tab
  const filteredPayments = payments.filter(payment => {
    if (paymentTab === 'unpaid') return payment.status === false || payment.status === undefined;
    if (paymentTab === 'paid') return payment.status === true;
    return true;
  });

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 VND';
    return `${amount.toLocaleString()} VND`;
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toLocaleDateString('en-CA'); // 'yyyy-mm-dd'
    if (selectedDates.includes(dateStr)) {
      // If already in selected dates, remove it
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      // If not in selected dates, add it
      setSelectedDates([...selectedDates, dateStr]);
    }
  };
  
  
  const handleSaveSchedule = async () => {
    if (selectedDates.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một ngày làm việc.');
      return;
    }
    
    try {
      setScheduleSaving(true);
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Bạn cần đăng nhập để lưu lịch làm việc.');
        setScheduleSaving(false);
        return;
      }
      
      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Prepare request body - combine existing and newly selected dates
      const allDates = [...new Set([...selectedDates])];
      const requestBody = {
        day: allDates
      };
      
      // Send request to save calendar
      await api.post('/calendar/create', requestBody, config);
      
      toast.success('Lịch làm việc đã được cập nhật thành công.');
      setScheduleSaving(false);
      
      // Update existing dates after save
      setExistingDates(allDates);
      // Clear selected dates after saving
      setSelectedDates([]);
    } catch (error) {
      console.error('Error saving work schedule:', error);
      toast.error('Có lỗi xảy ra khi lưu lịch làm việc. Vui lòng thử lại sau.');
      setScheduleSaving(false);
    }
  };

  // Function to fetch caretaker's existing calendar
  const fetchCareTakerCalendar = async () => {
    try {
      setLoadingCalendar(true);
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Bạn cần đăng nhập để xem lịch làm việc.');
        setLoadingCalendar(false);
        return;
      }
      
      // Get the caretaker ID from the token
      const decodedToken = jwtDecode(token);
      const careTakerId = decodedToken.user_id;
      
      if (!careTakerId) {
        console.error('Không thể xác định ID bảo mẫu từ token.');
        setLoadingCalendar(false);
        return;
      }
      
      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Fetch the caretaker's calendar
      const response = await api.get('/calendar/my-calendar', config);
      console.log("Du lieu la: ", response.data.data);
      if (response.data.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
        // Store full calendar entries
        setCalendarEntries(response.data.data);
        
        // Extract dates from the response for highlighting
        const dates = response.data.data
          .filter(item => item && item.day)
          .map(item => item.day);
        
        // Store existing dates separately instead of selected dates
        setExistingDates(dates);
        // Clear selected dates to start fresh
        setSelectedDates([]);
        
        console.log('Fetched caretaker calendar:', dates);
      }
      
      setLoadingCalendar(false);
    } catch (error) {
      console.error('Error fetching caretaker calendar:', error);
      toast.error('Có lỗi xảy ra khi tải lịch làm việc. Vui lòng thử lại sau.');
      setLoadingCalendar(false);
    }
  };

  const handleDeleteCalendarEntry = async (calendarId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngày này khỏi lịch làm việc không?')) {
      try {
        setDeletingCalendar(true);
        
        // Get the authentication token
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Bạn cần đăng nhập để xóa lịch làm việc.');
          setDeletingCalendar(false);
          return;
        }
        
        // Configure request with auth header
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Send request to delete calendar entry
        await api.delete(`/calendar/delete/${calendarId}`, config);
        
        // Update local state
        const updatedEntries = calendarEntries.filter(entry => entry.calendarId !== calendarId);
        setCalendarEntries(updatedEntries);
        
        // Update existing dates list
        const updatedDates = updatedEntries.map(entry => entry.day);
        setExistingDates(updatedDates);
        
        toast.success('Đã xóa ngày làm việc thành công.');
        setDeletingCalendar(false);
      } catch (error) {
        console.error('Error deleting calendar entry:', error);
        toast.error('Có lỗi xảy ra khi xóa lịch làm việc. Vui lòng thử lại sau.');
        setDeletingCalendar(false);
      }
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Send request to complete booking
      await api.put(`/booking/${bookingId}/status?status=COMPLETED`, {}, config);

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, serviceProgress: 'COMPLETED' } : booking
        )
      );

      // Show success message
      toast.success('Đã hoàn thành đơn thành công');
      
      // Switch to completed tab to show the booking
      setActiveTab('completed');
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Có lỗi xảy ra khi hoàn thành đơn. Vui lòng thử lại.');
    }
  };

  const fetchCalendarBookings = async () => {
    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Bạn cần đăng nhập để xem lịch làm việc.');
        return;
      }
      
      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Get start and end dates for the current month
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Format dates for API
      const startDateStr = startDate.toLocaleDateString('en-CA');
      const endDateStr = endDate.toLocaleDateString('en-CA');
      
      // Fetch bookings for the current month
      const response = await api.get(`/booking/caretaker?fromDate=${startDateStr}&toDate=${endDateStr}`, config);
      
      if (response.data && Array.isArray(response.data.data)) {
        setCalendarBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching calendar bookings:', error);
      toast.error('Có lỗi xảy ra khi tải lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month) => {
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                         'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return monthNames[month];
  };

  const isDateInBookings = (date) => {
    return calendarBookings.some(booking => 
      booking.days && booking.days.includes(date.toLocaleDateString('en-CA'))
    );
  };

  const isDateInSchedule = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    return existingDates.includes(dateStr);
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    return calendarBookings.filter(booking => booking.days && booking.days.includes(dateStr));
  };

  // Add these helper functions for week-based display

  // Group dates by week
  const groupDatesByWeek = (dateEntries) => {
    const grouped = {};
    
    dateEntries.forEach(entry => {
      const date = new Date(entry.day);
      // Get the first day of the week (Monday)
      const firstDayOfWeek = new Date(date);
      const day = date.getDay();
      // Adjust for week starting on Monday (0 = Monday, 6 = Sunday)
      const diff = day === 0 ? 6 : day - 1;
      firstDayOfWeek.setDate(date.getDate() - diff);
      
      // Format as YYYY-MM-DD
      const weekKey = firstDayOfWeek.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      grouped[weekKey].push(entry);
    });
    
    // Sort entries within each week
    Object.keys(grouped).forEach(week => {
      grouped[week].sort((a, b) => new Date(a.day) - new Date(b.day));
    });
    
    return grouped;
  };
  
  // Format the week range for display (e.g., "10 - 16 Tháng 5, 2023")
  const formatWeekRange = (weekStartStr) => {
    const weekStart = new Date(weekStartStr);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    
    if (weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear()) {
      // Same month: "10 - 16 Tháng 5, 2023"
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`;
    } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
      // Different month, same year: "28 Tháng 4 - 4 Tháng 5, 2023"
      return `${weekStart.getDate()} ${weekStart.toLocaleDateString('vi-VN', { month: 'long' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`;
    } else {
      // Different year: "30 Tháng 12, 2022 - 5 Tháng 1, 2023"
      return `${weekStart.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })} - ${weekEnd.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
  };

  // Get day of week in Vietnamese
  const getVietnameseDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayOfWeek];
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Adjust first day of week (assuming Sunday is 0)
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday = 0, Sunday = 6
    
    const days = [];
    const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    // Add days from previous month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={handlePrevMonth}
          >
            &lt; Tháng trước
          </button>
          <h2 className="text-xl font-semibold">{getMonthName(month)} {year}</h2>
          <button 
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={handleNextMonth}
          >
            Tháng sau &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-semibold py-2 border-b">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-28 bg-gray-100 p-1"></div>;
            }
            
            const isToday = day.toDateString() === new Date().toDateString();
            const hasBooking = isDateInBookings(day);
            const isScheduled = isDateInSchedule(day);
            const dayBookings = getBookingsForDate(day);
            
            return (
              <div 
                key={index} 
                className={`h-28 p-1 border relative overflow-hidden ${
                  isToday ? 'bg-blue-50 border-blue-500' : ''
                } ${isScheduled ? 'bg-teal-50' : ''}`}
              >
                <div className="flex justify-between">
                  <span className={`font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex">
                    {isScheduled && (
                      <div className="h-2 w-2 rounded-full bg-teal-500 mr-1"></div>
                    )}
                    {hasBooking && (
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                </div>
                
                <div className="mt-1 text-xs overflow-y-auto max-h-20">
                  {dayBookings.map((booking, idx) => (
                    <div 
                      key={idx} 
                      className="mb-1 p-1 bg-orange-100 rounded truncate text-xs"
                      title={`${booking.customerName}: ${formatTime(booking.timeToStart)} - ${formatTime(booking.timeToEnd)}`}
                    >
                      {formatTime(booking.timeToStart)} - {booking.customerName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex gap-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-teal-500 mr-2"></div>
            <span className="text-sm">Ngày làm việc đã đăng ký</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">Cuộc hẹn đã xác nhận</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Hôm nay</span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'appointments':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Quản lý cuộc hẹn</h1>
            <div className="flex mb-6 border-b">
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'pending' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('pending')}
              >
                Yêu cầu đặt lịch
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'accepted' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('accepted')}
              >
                Đơn đã đồng ý
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'completed' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('completed')}
              >
                Đơn hoàn thành
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'rejected' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('rejected')}
              >
                Đơn đã hủy
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">Không có đơn nào trong mục này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="border-b pb-3 mb-4">
                      <h3 className="font-bold">Đơn hàng của {booking.customerName}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="text-teal-500 mr-3 w-5" />
                        <span>{booking.customerName}</span>
                      </div>

                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-teal-500 mr-3 w-5" />
                        <span>
                          {booking.days && booking.days.length > 0
                            ? formatDateRange(booking.days)
                            : 'Chưa có ngày cụ thể'}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-teal-500 mr-3 w-5" />
                        <span>
                          {formatTime(booking.timeToStart)} đến {formatTime(booking.timeToEnd)}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <FontAwesomeIcon icon={booking.locationType === 'HOSPITAL' ? faHospital : faHome} className="text-teal-500 mr-3 w-5 mt-1" />
                        <div>
                          <div>{booking.placeName}</div>
                          <div className="text-gray-600">{booking.bookingAddress}</div>
                          {booking.descriptionPlace && (
                            <div className="text-gray-500 text-sm">{booking.descriptionPlace}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-teal-500 mr-3 w-5 mt-1" />
                        <div className="text-gray-700">{booking.jobDescription}</div>
                      </div>

                      {booking.servicePrice && (
                        <div className="border-t pt-3 mt-3">
                          <div className="font-medium">Estimate earnings:</div>
                          <div className="text-xl font-bold"> {booking.servicePrice.toLocaleString()} VND</div>
                        </div>
                      )}
                    </div>

                    {activeTab === 'pending' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium"
                          onClick={() => handleAcceptBooking(booking.id)}
                          disabled={processingBookingId === booking.id}
                        >
                          {processingBookingId === booking.id ? 'Đang xử lý...' : 'Xác nhận đơn'}
                        </button>
                        <button
                          className="px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md font-medium"
                          onClick={() => handleRejectBooking(booking.id)}
                          disabled={processingBookingId === booking.id}
                        >
                          {processingBookingId === booking.id ? 'Đang xử lý...' : 'Từ chối đơn'}
                        </button>
                      </div>
                    )}

                    {activeTab === 'accepted' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium" onClick={() => handleShowRecipientDetails(booking.id)}>
                          Xem chi tiết
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md font-medium" onClick={() => handleCompleteBooking(booking.id)}>
                          Hoàn thành
                        </button>
                      </div>
                    )}

                    {activeTab === 'completed' && (
                      <div className="mt-4 flex justify-end">
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium" onClick={() => handleShowRecipientDetails(booking.id)}>
                          Xem chi tiết
                        </button>
                      </div>
                    )}

                    {activeTab === 'rejected' && (
                      <div className="mt-4 text-right">
                        <span className="text-gray-500">Đã từ chối đơn này</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'profile':
        return (
          <CareTakerProfile careTakerId={careTakerId} />
        );
      
      case 'dashboard':
          return (
            <DashboardCareTaker />
       );
        
      case 'results':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Lịch sử thanh toán</h1>

            <div className="flex mb-6 border-b">
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${paymentTab === 'unpaid' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setPaymentTab('unpaid')}
              >
                Chưa thanh toán
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${paymentTab === 'paid' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
                onClick={() => setPaymentTab('paid')}
              >
                Đã thanh toán
              </button>
            </div>

            {/* Payment List */}
            {paymentLoading ? (
              <div className="text-center py-8">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : paymentError ? (
              <div className="text-center py-8 text-red-500">
                <p>{paymentError}</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">Không có lịch sử thanh toán nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã thanh toán
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày thanh toán
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phương thức thanh toán
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id || payment.bookingId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.id || payment.bookingId || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {payment.createAt && payment.createAt.length > 0
                              ? payment.createAt
                              : 'Chưa có ngày cụ thể'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {payment.updateAt && payment.updateAt.length > 0
                              ? payment.updateAt
                              : 'Chưa có ngày cụ thể'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(payment.price || payment.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {payment.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod || 'Chuyển khoản ngân hàng'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'schedule':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Lên lịch làm việc</h1>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Chọn những ngày bạn có thể làm việc. Nhấp vào ngày trên lịch để chọn hoặc bỏ chọn.
              </p>

              {loadingCalendar ? (
                <div className="text-center py-8">
                  <p>Đang tải lịch làm việc...</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-4">
                    <h2 className="text-lg font-semibold mb-3">Chọn ngày làm việc</h2>
                    <div className="border p-4 rounded-lg bg-gray-50">
                      <DatePicker
                        inline
                        minDate={new Date()}
                        highlightDates={[
                          ...existingDates.map(dateStr => new Date(dateStr)),
                          ...selectedDates.map(dateStr => new Date(dateStr))
                        ]}
                        onSelect={(date) => handleDateSelect(date)}
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-teal-100 border border-teal-500 mr-2"></div>
                        <span>Ngày đã đăng ký trước đó</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-4">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">Ngày đã chọn</h2>
                      <div className="border p-4 rounded-lg bg-gray-50 min-h-[150px]">
                        {selectedDates.length > 0 ? (
                          <div className="space-y-2">
                            {selectedDates.map((dateStr) => (
                              <div key={dateStr} className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faCalendarCheck} className="text-teal-500 mr-2" />
                                  <span>{new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <button
                                  className="text-red-500"
                                  onClick={() => setSelectedDates(selectedDates.filter(d => d !== dateStr))}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Chưa có ngày nào được chọn</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <button
                          className="px-6 py-3 bg-teal-500 text-white rounded-md font-medium flex items-center justify-center w-full"
                          onClick={handleSaveSchedule}
                          disabled={scheduleSaving}
                        >
                          {scheduleSaving ? 'Đang lưu...' : 'Đăng ký lịch làm việc'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-3">Lịch làm việc đã đăng ký</h2>
                      <div className="border p-4 rounded-lg bg-gray-50 max-h-[350px] overflow-y-auto">
                        {calendarEntries.length > 0 ? (
                          (() => {
                            // Filter to only keep entries from today onwards
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Set to beginning of today
                            
                            const futureEntries = calendarEntries.filter(entry => {
                              const entryDate = new Date(entry.day);
                              entryDate.setHours(0, 0, 0, 0);
                              return entryDate >= today;
                            });
                            
                            if (futureEntries.length === 0) {
                              return (
                                <div className="flex items-center justify-center h-[100px] text-gray-500">
                                  <p>Không có ngày làm việc nào trong tương lai</p>
                                </div>
                              );
                            }
                            
                            const groupedEntries = groupDatesByWeek(futureEntries);
                            
                            return (
                              <div>
                                {Object.entries(groupedEntries)
                                  .sort(([weekA], [weekB]) => new Date(weekA) - new Date(weekB))
                                  .map(([weekStart, entries]) => (
                                    <div key={weekStart} className="border-b last:border-b-0">
                                      <div className="bg-teal-50 px-4 py-2 font-medium text-teal-700 border-b">
                                        {formatWeekRange(weekStart)}
                                      </div>
                                      <div className="p-2">
                                        {entries.map((entry) => (
                                          <div key={entry.calendarId} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md">
                                            <div className="flex items-center">
                                              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                                                <span className="text-xs font-semibold text-teal-700">
                                                  {new Date(entry.day).getDate()}
                                                </span>
                                              </div>
                                              <div>
                                                <div className="font-medium">{getVietnameseDayOfWeek(entry.day)}</div>
                                                <div className="text-sm text-gray-500">
                                                  {new Date(entry.day).toLocaleDateString('vi-VN', { 
                                                    day: 'numeric', 
                                                    month: 'numeric', 
                                                    year: 'numeric' 
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                            <button
                                              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                              onClick={() => handleDeleteCalendarEntry(entry.calendarId)}
                                              disabled={deletingCalendar}
                                              title="Xóa ngày này"
                                            >
                                              <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex items-center justify-center h-[100px] text-gray-500">
                            <p>Chưa có ngày làm việc nào được đăng ký</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Lịch làm việc</h1>
            
            <p className="text-gray-600 mb-4">
              Quản lý lịch làm việc và xem các cuộc hẹn đã được xác nhận. Ngày có màu xanh nhạt là những ngày bạn đã đăng ký có thể làm việc.
            </p>
            
            {loadingCalendar ? (
              <div className="text-center py-8">
                <p>Đang tải lịch làm việc...</p>
              </div>
            ) : (
              <div>
                {renderCalendar()}
                
                <div className="mt-8 border-t pt-4">
                  <h2 className="text-lg font-semibold mb-4">Cập nhật lịch làm việc</h2>
                  <p className="text-gray-600 mb-4">
                    Sử dụng lịch dưới đây để thêm hoặc xóa ngày làm việc của bạn.
                  </p>
                  
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-4">
                      <div className="border p-4 rounded-lg bg-gray-50">
                        <DatePicker
                          inline
                          minDate={new Date()}
                          highlightDates={[
                            ...existingDates.map(dateStr => new Date(dateStr)),
                            ...selectedDates.map(dateStr => new Date(dateStr))
                          ]}
                          onSelect={(date) => handleDateSelect(date)}
                          className="w-full"
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-teal-100 border border-teal-500 mr-2"></div>
                          <span>Ngày đã đăng ký trước đó</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 md:pl-4">
                      <h2 className="text-lg font-semibold mb-3">Ngày đã chọn</h2>
                      <div className="border p-4 rounded-lg bg-gray-50 min-h-[300px]">
                        {selectedDates.length > 0 ? (
                          <div className="space-y-2">
                            {selectedDates.map((dateStr) => (
                              <div key={dateStr} className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faCalendarCheck} className="text-teal-500 mr-2" />
                                  <span>{new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <button
                                  className="text-red-500"
                                  onClick={() => setSelectedDates(selectedDates.filter(d => d !== dateStr))}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Chưa có ngày nào được chọn</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <button
                          className="px-6 py-3 bg-teal-500 text-white rounded-md font-medium flex items-center justify-center w-full"
                          onClick={handleSaveSchedule}
                          disabled={scheduleSaving}
                        >
                          {scheduleSaving ? 'Đang lưu...' : 'Cập nhật lịch làm việc'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const RecipientModal = () => {
    if (!showRecipientModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Thông tin người được chăm sóc</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowRecipientModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {loadingRecipient ? (
            <div className="text-center py-8">
              <p>Đang tải thông tin...</p>
            </div>
          ) : !selectedRecipient ? (
            <div className="text-center py-8">
              <p className="text-red-500">Không tìm thấy thông tin người được chăm sóc.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-teal-500 text-white rounded-full flex items-center justify-center text-3xl">
                  <FontAwesomeIcon icon={selectedRecipient.gender === 'MALE' ? faMars : faVenus} />
                </div>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500 text-sm">Tên</p>
                <p className="font-medium text-lg">{selectedRecipient.name}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500 text-sm">Giới tính</p>
                <p className="font-medium">
                  {selectedRecipient.gender === 'MALE' ? 'Nam' :
                    selectedRecipient.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-500 text-sm">Tuổi</p>
                <p className="font-medium">{selectedRecipient.yearOld} tuổi</p>
              </div>

              {selectedRecipient.specialDetail && (
                <div>
                  <p className="text-gray-500 text-sm">Thông tin đặc biệt</p>
                  <p className="font-medium">{selectedRecipient.specialDetail}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium"
              onClick={() => setShowRecipientModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 mb-6 lg:mb-0 lg:mr-6">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              {/* <div className="flex items-center mb-4">
                <img src="/avatar.png" alt="User avatar" className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h2 className="font-bold text-xl">Xin chào, {userData.name}</h2>
                  <p className="text-gray-500">Last login: {userData.lastLogin}</p>
                </div>
              </div> */}
              <ul className="space-y-3">
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'profile' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('profile')}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                  Thông tin cá nhân
                </li>

                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'dashboard' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                  Dashboard
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'appointments' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('appointments')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                  Lịch hẹn của tôi
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'calendar' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('calendar')}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} className="mr-3" />
                  Lịch làm việc
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'schedule' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('schedule')}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                  Đăng ký lịch
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'results' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('results')}
                >
                  <FontAwesomeIcon icon={faFileLines} className="mr-3" />
                  Lịch sử thanh toán
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* Render the recipient modal */}
      <RecipientModal />
    </div>
  );
};

export default CareTaker;