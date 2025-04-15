import React, { useState } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen } from 'lucide-react';
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex pt-[123px]">
        {/* Left side - Fixed position */}
        <div className="w-[426px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Right side - Scrollable content */}
        <div className="flex-1">
          <main className="mx-auto w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              {/* Account Information Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Thông tin tài khoản</h2>
                  <button className="text-[rgb(0,107,82)] hover:text-[rgb(0,87,62)]">
                    <SquarePen size={20} />
                  </button>
                </div>
                
                <div className="bg-[#F9FAFB] rounded-[8px] p-6">
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
                        <div className="bg-white rounded-[8px] p-6">
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

                        <div className="bg-white rounded-[8px] p-6">
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileCustomer;
