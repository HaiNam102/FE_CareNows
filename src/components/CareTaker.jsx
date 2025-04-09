import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUserCircle, faMapMarkerAlt, faStethoscope, faCheckCircle, faClock, faUser, faHospital, faHome, faMoneyBill, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CareTaker = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'accepted', 'rejected'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({ name: '', lastLogin: '' });

  useEffect(() => {
    fetchBookings();
    
    // Attempt to get user info from token
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        if (decoded) {
          setUserData({
            name:decoded.username || 'User',
            lastLogin: new Date().toLocaleDateString('vi-VN')
          });
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

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
    if (activeTab === 'pending') return booking.serviceProgress === 'PENDING';
    if (activeTab === 'accepted') return booking.serviceProgress === 'ACCEPT';
    if (activeTab === 'rejected') return booking.serviceProgress === 'REJECT';
    return true;
  });

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
                <li className="flex items-center text-teal-500 font-medium">
                  <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                  Thông tin cá nhân
                </li>
                <li className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                  Lịch hẹn khám của tôi
                </li>
                <li className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faStethoscope} className="mr-3" />
                  Kết quả khám bệnh
                </li>
                <li className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                  Đặt lịch khám mới
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <h1 className="text-2xl font-bold mb-6">Quản lý cuộc hẹn</h1>

            {/* Status Tabs */}
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
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'rejected' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`} 
                onClick={() => setActiveTab('rejected')}
              >
                Đơn đã hủy
              </button>
            </div>

            {/* Booking List */}
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
                  <div key={booking.bookingId} className="bg-white rounded-lg shadow-md p-4">
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
                          <div className="text-xl font-bold"> {booking.servicePrice.toLocaleString()}00 VND</div>
                        </div>
                      )}
                    </div>

                    {activeTab === 'pending' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button 
                          className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium"
                          onClick={() => handleAcceptBooking(booking.bookingId)}
                        >
                          Xác nhận đơn
                        </button>
                        <button 
                          className="px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md font-medium"
                          onClick={() => handleRejectBooking(booking.bookingId)}
                        >
                          Từ chối đơn
                        </button>
                      </div>
                    )}
                    
                    {activeTab === 'accepted' && (
                      <div className="mt-4 flex justify-end">
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium">
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
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CareTaker; 