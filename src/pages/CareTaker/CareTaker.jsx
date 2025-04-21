import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUserCircle, faMapMarkerAlt, faStethoscope, faCheckCircle, faClock, faUser, faHospital, faHome, faMoneyBill, faInfoCircle, faFileLines, faTimes, faMars, faVenus, faBriefcase, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [currentPage, setCurrentPage] = useState('schedule'); 
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [loadingRecipient, setLoadingRecipient] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [existingDates, setExistingDates] = useState([]);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  useEffect(() => {
    if (currentPage === 'appointments') {
      fetchBookings();
    } else if (currentPage === 'results') {
      fetchPayments();
    } else if (currentPage === 'schedule') {
      fetchCareTakerCalendar();
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
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, [currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để xem lịch hẹn.');
        setLoading(false);
        return;
      }

      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:8080/api/booking/caretaker', config);
      console.log("Response data:", response.data.data);

      // Process the response data
      if (response.data.data && Array.isArray(response.data.data)) {
        // Add status if not present for testing
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
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setPaymentError('Bạn cần đăng nhập để xem lịch sử thanh toán.');
        setPaymentLoading(false);
        return;
      }

      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:8080/api/payment', config);
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
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Send request to accept booking
      await axios.put(`http://localhost:8080/api/booking/${bookingId}/status?status=ACCEPT`, {}, config);

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, serviceProgress: 'ACCEPT' } : booking
        )
      );

      // Show success message
      toast.success('Đã xác nhận đơn thành công');
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Có lỗi xảy ra khi xác nhận đơn. Vui lòng thử lại.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Send request to reject booking
      await axios.put(`http://localhost:8080/api/booking/${bookingId}/status?status=REJECT`, {}, config);

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, serviceProgress: 'REJECT' } : booking
        )
      );

      // Show success message
      toast.success('Đã từ chối đơn thành công');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Có lỗi xảy ra khi từ chối đơn. Vui lòng thử lại.');
    }
  };

  const fetchCareRecipient = async (bookingId) => {
    try {
      setLoadingRecipient(true);
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Bạn cần đăng nhập để xem thông tin.');
        setLoadingRecipient(false);
        return;
      }

      // Configure request with auth header
      // const config = {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // };

      // Fetch care recipient data for this booking
      const response = await axios.get(`http://localhost:8080/api/booking/${bookingId}/care-recipient`);

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
    return `${amount.toLocaleString()}.000 VND`;
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
      const allDates = [...new Set([...existingDates, ...selectedDates])];
      const requestBody = {
        day: allDates
      };
      
      // Send request to save calendar
      await axios.post('http://localhost:8080/api/calendar/create', requestBody, config);
      
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
      const response = await axios.get(`http://localhost:8080/api/calendar/my-calendar`, config);
      console.log("Du lieu la: " + response.data.data);
      if (response.data.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
        // Extract dates from the response
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
      await axios.put(`http://localhost:8080/api/booking/${bookingId}/status?status=COMPLETED`, {}, config);

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
                          <div className="text-xl font-bold"> {booking.servicePrice.toLocaleString()}.000 VND</div>
                        </div>
                      )}
                    </div>

                    {activeTab === 'pending' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium"
                          onClick={() => handleAcceptBooking(booking.id)}
                        >
                          Xác nhận đơn
                        </button>
                        <button
                          className="px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md font-medium"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          Từ chối đơn
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
            <p>Trang thông tin cá nhân đang được phát triển...</p>
          </div>
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
                              {/* <div className="text-gray-500">09:00 - 17:00</div> */}
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

                    <div className="mt-6 text-right">
                      <button
                        className="px-6 py-3 bg-teal-500 text-white rounded-md font-medium flex items-center justify-center w-full"
                        onClick={handleSaveSchedule}
                        disabled={scheduleSaving}
                      >
                        {scheduleSaving ? 'Đang lưu...' : 'Đăng ký lịch làm việc'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
              <div className="flex items-center mb-4">
                <img src="/avatar.png" alt="User avatar" className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h2 className="font-bold text-xl">Xin chào, {userData.name}</h2>
                  <p className="text-gray-500">Last login: {userData.lastLogin}</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'profile' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('profile')}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                  Thông tin cá nhân
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'appointments' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('appointments')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                  Lịch hẹn của tôi
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'results' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('results')}
                >
                  <FontAwesomeIcon icon={faFileLines} className="mr-3" />
                  Lịch sử thanh toán
                </li>
                <li
                  className={`flex items-center cursor-pointer ${currentPage === 'schedule' ? 'text-teal-500 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentPage('schedule')}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                  Lên lịch làm việc
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