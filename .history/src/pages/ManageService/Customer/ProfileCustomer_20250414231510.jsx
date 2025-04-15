import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen, X } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import CustomerSidebar from '../../../components/CustomerSidebar';
import HoverButtonOutline from '../../../components/HoverButtonOutline';
import HoverButton from '../../../components/HoverButton';
import axios from 'axios';

const ProfileCustomer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    avatar: null,
    gender: '',
    birthday: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    ward: '',
    joinDate: '',
    savedAddresses: []
  });

  const [editValues, setEditValues] = useState({
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleOpenModal = () => {
    setEditValues({
      birthday: userData.birthday || '',
      gender: userData.gender || '',
      phone: userData.phone || '',
      email: userData.email || '',
      address: userData.address || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        window.location.href = '/login';
        return;
      }

      const [ward, district] = editValues.address.split(', ');
      const updateData = {
        nameOfCustomer: userData.name,
        gender: editValues.gender,
        birthday: editValues.birthday,
        phoneNumber: editValues.phone,
        email: editValues.email,
        ward: ward,
        district: district
      };

      const response = await axios.put('http://localhost:8080/api/customer', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.data) {
        setUserData(prevData => ({
          ...prevData,
          gender: editValues.gender,
          birthday: editValues.birthday,
          phone: editValues.phone,
          email: editValues.email,
          ward: ward,
          district: district,
          address: editValues.address
        }));

        setShowModal(false);
        alert('Cập nhật thông tin thành công!');

        // Refresh lại dữ liệu từ server
        const refreshResponse = await axios.get('http://localhost:8080/api/customer/getByCustomerId', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (refreshResponse.data?.data) {
          const customerData = refreshResponse.data.data;
          setUserData({
            name: customerData.nameOfCustomer || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            birthday: customerData.birthday || '',
            district: customerData.district || '',
            ward: customerData.ward || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`,
            joinDate: new Date().toLocaleDateString('vi-VN'),
            savedAddresses: [
              {
                id: 1,
                name: customerData.ward || '',
                detail: `${customerData.ward || ''}, ${customerData.district || ''}`
              }
            ]
          });
        }
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      
      if (error.response?.status === 401) {
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        alert(errorMessage);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        const errorMessage = error.response?.data?.message || 'Cập nhật thất bại';
        setError(errorMessage);
        alert('Cập nhật thất bại: ' + errorMessage);
      }
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found');
          window.location.href = '/login';
          return;
        }

        const response = await axios.get('http://localhost:8080/api/customer/getByCustomerId', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data?.data) {
          const customerData = response.data.data;
          setUserData({
            name: customerData.nameOfCustomer || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            birthday: customerData.birthday || '',
            district: customerData.district || '',
            ward: customerData.ward || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`,
            joinDate: new Date().toLocaleDateString('vi-VN'),
            savedAddresses: [
              {
                id: 1,
                name: customerData.ward || '',
                detail: `${customerData.ward || ''}, ${customerData.district || ''}`
              }
            ]
          });

          setEditValues({
            birthday: customerData.birthday || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`
          });
        } else {
          throw new Error('Không thể tải thông tin người dùng');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Không thể tải thông tin. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Đang tải thông tin...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">Lỗi: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex">
        {/* Left side - Fixed position */}
        <div className="w-[280px] flex-shrink-0 pt-8">
          <CustomerSidebar />
        </div>

        {/* Right side - Scrollable content */}
        <div className="flex-1 pl-12">
          <div className="w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              {/* Account Information Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Thông tin tài khoản</h2>
                  <HoverButtonOutline 
                    text="Chỉnh sửa thông tin"
                    onClick={handleOpenModal}
                    showArrow={true}
                    iconType="arrow"
                    variant="primary"
                    size="medium"
                  />
                </div>
                
                <div className="bg-white rounded-[8px] p-6">
                  <div className="flex">
                    {/* Left side - Profile Info */}
                    <div className="w-[252px]">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden">
                          <img 
                            src="https://i.pravatar.cc/300" 
                            alt={userData.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="mt-3 text-xl font-semibold font-['SVN-Gilroy']">{userData.name}</h3>
                        <p className="text-gray-500 text-sm font-['SVN-Gilroy']">Tham gia {userData.joinDate}</p>
                      </div>
                    </div>

                    {/* Right side - User Details */}
                    <div className="flex-1 pl-8">
                      <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Ngày sinh</p>
                          <p className="mt-1 font-['SVN-Gilroy']">{userData.birthday}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Giới tính</p>
                          <p className="mt-1 font-['SVN-Gilroy']">{userData.gender}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Số điện thoại</p>
                          <p className="mt-1 font-['SVN-Gilroy']">{userData.phone}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Email</p>
                          <p className="mt-1 font-['SVN-Gilroy']">{userData.email}</p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-gray-500 font-['SVN-Gilroy']">Địa chỉ</p>
                          <p className="mt-1 font-['SVN-Gilroy']">{userData.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Saved Addresses Section */}
              <div className="mb-96">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Địa chỉ đã lưu</h2>
                  <HoverButtonOutline 
                    text="Thêm địa chỉ mới"
                    showArrow={true}
                    iconType="animated-plus"
                    variant="primary"
                    size="medium"
                  />
                </div>
                
                <div className="space-y-4">
                  {userData.savedAddresses.map((address, index) => (
                    <div key={address.id} className="bg-white rounded-[8px] border border-gray-100 p-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-gray-50 rounded-[8px] mr-4">
                          {index === 0 ? (
                            <Building size={20} className="text-[rgb(0,107,82)]" />
                          ) : (
                            <MapPin size={20} className="text-[rgb(0,107,82)]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium font-['SVN-Gilroy']">{address.name}</h4>
                          <p className="text-gray-500 font-['SVN-Gilroy'] mt-1">{address.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-['SVN-Gilroy']">Chỉnh sửa thông tin</h3>
              <HoverButtonOutline 
                text="X"
                onClick={handleCloseModal}
                showArrow={false}
                variant="primary"
                size="small"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 font-['SVN-Gilroy'] mb-1">Ngày sinh</label>
                <input
                  type="text"
                  value={editValues.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:border-[rgb(0,107,82)]"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-['SVN-Gilroy'] mb-1">Giới tính</label>
                <input
                  type="text"
                  value={editValues.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:border-[rgb(0,107,82)]"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-['SVN-Gilroy'] mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={editValues.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:border-[rgb(0,107,82)]"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-['SVN-Gilroy'] mb-1">Email</label>
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:border-[rgb(0,107,82)]"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-['SVN-Gilroy'] mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={editValues.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:border-[rgb(0,107,82)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-['SVN-Gilroy']"
              >
                Hủy
              </button>
              <HoverButton 
                text="Lưu thay đổi"
                onClick={handleSaveAll}
                showArrow={false}
                variant="primary"
                size="medium"
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProfileCustomer;
