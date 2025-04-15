import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import axios from 'axios';

const ProfileCustomer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    savedAddresses: [],
    account_id: null
  });

  const [editMode, setEditMode] = useState({
    birthday: false,
    gender: false,
    phone: false,
    email: false,
    address: false
  });

  const [editValues, setEditValues] = useState({
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
    setEditValues(prev => ({
      ...prev,
      [field]: userData[field] || ''
    }));
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        window.location.href = '/login';
        return;
      }

      // Chuẩn bị dữ liệu theo format CustomerReq
      const updateData = {
        nameOfCustomer: userData.name,
        gender: field === 'gender' ? editValues.gender : userData.gender,
        birthday: field === 'birthday' ? editValues.birthday : userData.birthday,
        phoneNumber: field === 'phone' ? editValues.phone : userData.phone,
        email: field === 'email' ? editValues.email : userData.email,
        ward: field === 'address' ? editValues.address.split(', ')[0] : userData.ward,
        district: field === 'address' ? editValues.address.split(', ')[1] : userData.district,
        accountId: userData.account_id // Đổi từ account_id thành accountId để match với backend
      };

      const response = await axios.put('http://localhost:8080/api/customer', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.code === 200) {
        // Cập nhật state với dữ liệu mới
        setUserData(prevData => {
          const newData = { ...prevData };
          
          if (field === 'address') {
            const [ward, district] = editValues.address.split(', ');
            newData.ward = ward;
            newData.district = district;
            newData.address = editValues.address;
          } else {
            newData[field] = editValues[field];
          }
          
          return newData;
        });

        setEditMode(prev => ({ ...prev, [field]: false }));
        alert('Cập nhật thông tin thành công!');

        // Refresh lại dữ liệu từ server
        const refreshResponse = await axios.get('http://localhost:8080/api/customer/getByCustomerId', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (refreshResponse.data && refreshResponse.data.code === 200) {
          const customerData = refreshResponse.data.data;
          setUserData(prevData => ({
            ...prevData,
            name: customerData.nameOfCustomer || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            birthday: customerData.birthday || '',
            district: customerData.district || '',
            ward: customerData.ward || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`,
            account_id: customerData.accountId // Đổi từ accountId thành account_id khi lưu vào state
          }));
        }
      } else {
        throw new Error(response.data?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      
      if (error.response && error.response.status === 401) {
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        alert(errorMessage);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thất bại';
        setError(errorMessage);
        alert('Cập nhật thất bại: ' + errorMessage);
      }
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(field);
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

        if (response.data && response.data.code === 200) {
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
            ],
            account_id: customerData.accountId // Đổi từ accountId thành account_id khi lưu vào state
          });

          setEditValues({
            birthday: customerData.birthday || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`
          });
        } else {
          throw new Error(response.data?.message || 'Không thể tải thông tin');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError(error.message || 'Không thể tải thông tin. Vui lòng thử lại sau.');
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
          <div className="w-[285px]">
            <div>
              <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào {userData.name}!</h2>
              <div className="h-[1px] bg-gray-200 w-full"></div>
            </div>
            <nav className="mt-4">
              <a className="flex items-center h-[40px] px-4 relative text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]" href="/customer/profile" data-discover="true">
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
              </a>
              <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/booking-history" data-discover="true">
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
                <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
              </a>
              <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records" data-discover="true">
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                </span>
                <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
              </a>
              <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records-list" data-discover="true">
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard-list">
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <path d="M12 11h4"></path>
                    <path d="M12 16h4"></path>
                    <path d="M8 11h.01"></path>
                    <path d="M8 16h.01"></path>
                  </svg>
                </span>
                <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
              </a>
            </nav>
            <div className="px-4 mt-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out mr-3">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
                <span className="font-['SVN-Gilroy']">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Scrollable content */}
        <div className="flex-1">
          <div className="w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              {/* Account Information Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Thông tin tài khoản</h2>
                  <button className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]">
                    <SquarePen size={20} />
                  </button>
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
                          <div className="flex items-center justify-between mt-1">
                            {editMode.birthday ? (
                              <input
                                type="text"
                                value={editValues.birthday}
                                onChange={(e) => handleInputChange('birthday', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={(e) => handleSave('birthday')}
                                onKeyDown={(e) => handleKeyDown(e, 'birthday')}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.birthday}</p>
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleEdit('birthday'); }}
                                  className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Giới tính</p>
                          <div className="flex items-center justify-between mt-1">
                            {editMode.gender ? (
                              <input
                                type="text"
                                value={editValues.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={(e) => handleSave('gender')}
                                onKeyDown={(e) => handleKeyDown(e, 'gender')}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.gender}</p>
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleEdit('gender'); }}
                                  className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Số điện thoại</p>
                          <div className="flex items-center justify-between mt-1">
                            {editMode.phone ? (
                              <input
                                type="tel"
                                value={editValues.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={(e) => handleSave('phone')}
                                onKeyDown={(e) => handleKeyDown(e, 'phone')}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.phone}</p>
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleEdit('phone'); }}
                                  className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 font-['SVN-Gilroy']">Email</p>
                          <div className="flex items-center justify-between mt-1">
                            {editMode.email ? (
                              <input
                                type="email"
                                value={editValues.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={(e) => handleSave('email')}
                                onKeyDown={(e) => handleKeyDown(e, 'email')}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.email}</p>
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleEdit('email'); }}
                                  className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <p className="text-gray-500 font-['SVN-Gilroy']">Địa chỉ</p>
                          <div className="flex items-center justify-between mt-1">
                            {editMode.address ? (
                              <input
                                type="text"
                                value={editValues.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={(e) => handleSave('address')}
                                onKeyDown={(e) => handleKeyDown(e, 'address')}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.address}</p>
                                <button 
                                  onClick={(e) => { e.preventDefault(); handleEdit('address'); }}
                                  className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]"
                                >
                                  <SquarePen size={16} />
                                </button>
                              </>
                            )}
                          </div>
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
                  <button className="px-4 py-2 border border-[rgb(0,107,82)] text-[rgb(0,107,82)] rounded-[8px] hover:bg-[rgb(0,107,82)]/5 transition font-['SVN-Gilroy']">
                    Thêm địa chỉ mới
                  </button>
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
    </MainLayout>
  );
};

export default ProfileCustomer;
