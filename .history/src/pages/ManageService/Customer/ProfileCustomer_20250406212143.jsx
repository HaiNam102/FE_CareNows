import React, { useState } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';

const ProfileCustomer = () => {
  const [userData, setUserData] = useState({
    name: 'Nguyễn Nhật Tân',
    avatar: null,
    gender: 'Nam',
    birthday: '28/02/2001',
    phone: '0899229928',
    email: 'vananhbvt2k3@gmail.com',
    address: '15 Trưng Nghĩa 2, Hòa Minh, Liên Chiểu',
    joinDate: '28/02/2025',
    savedAddresses: [
      {
        id: 1,
        name: '15 Trưng Nghĩa 2',
        detail: '15 Trưng Nghĩa 2, Phường Hòa Minh, Quận Liên Chiểu, TP Đà Nẵng'
      },
      {
        id: 2,
        name: 'Bệnh viện Đà Nẵng',
        detail: '124 Hải Phòng, Thạch Thang, Hải Châu, Đà Nẵng'
      }
    ]
  });

  const [editMode, setEditMode] = useState({
    birthday: false,
    gender: false,
    phone: false,
    email: false,
    address: false
  });

  const handleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  return (
    <MainLayout>
      <div className="flex">
        {/* Left side - Fixed position */}
        <div className="w-[280px] flex-shrink-0 pt-8">
          <div className="w-[285px]">
            <div>
              <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào Tan!</h2>
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
                                value={userData.birthday}
                                onChange={(e) => handleSave('birthday', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={() => setEditMode(prev => ({ ...prev, birthday: false }))}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.birthday}</p>
                                <button 
                                  onClick={() => handleEdit('birthday')}
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
                                value={userData.gender}
                                onChange={(e) => handleSave('gender', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={() => setEditMode(prev => ({ ...prev, gender: false }))}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.gender}</p>
                                <button 
                                  onClick={() => handleEdit('gender')}
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
                                value={userData.phone}
                                onChange={(e) => handleSave('phone', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={() => setEditMode(prev => ({ ...prev, phone: false }))}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.phone}</p>
                                <button 
                                  onClick={() => handleEdit('phone')}
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
                                value={userData.email}
                                onChange={(e) => handleSave('email', e.target.value)}
                                className="border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={() => setEditMode(prev => ({ ...prev, email: false }))}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.email}</p>
                                <button 
                                  onClick={() => handleEdit('email')}
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
                                value={userData.address}
                                onChange={(e) => handleSave('address', e.target.value)}
                                className="w-full border-b border-[rgb(0,107,82)] outline-none font-['SVN-Gilroy']"
                                onBlur={() => setEditMode(prev => ({ ...prev, address: false }))}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="font-['SVN-Gilroy']">{userData.address}</p>
                                <button 
                                  onClick={() => handleEdit('address')}
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
