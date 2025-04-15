import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen } from 'lucide-react';
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import { jwtDecode } from 'jwt-decode';

const ProfileCustomer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    // Get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // In a real app, you would fetch user data from an API here
        console.log('User data from token:', decoded);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 mt-20">
          <div className="max-w-4xl mx-auto">
            {/* Account Information Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Thông tin tài khoản</h2>
              </div>
              
              <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm p-6">
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
                      <p className="text-gray-500 text-sm font-['SVN-Gilroy']">tham gia {userData.joinDate}</p>
                    </div>
                  </div>

                  {/* Right side - User Details */}
                  <div className="flex-1 pl-8">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <p className="text-gray-500 font-['SVN-Gilroy']">Ngày sinh</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-['SVN-Gilroy']">{userData.birthday}</p>
                          <SquarePen size={16} className="text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-['SVN-Gilroy']">Giới tính</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-['SVN-Gilroy']">{userData.gender}</p>
                          <SquarePen size={16} className="text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-['SVN-Gilroy']">Số điện thoại</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-['SVN-Gilroy']">{userData.phone}</p>
                          <SquarePen size={16} className="text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-['SVN-Gilroy']">Email</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-['SVN-Gilroy']">{userData.email}</p>
                          <SquarePen size={16} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500 font-['SVN-Gilroy']">Địa chỉ</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-['SVN-Gilroy']">{userData.address}</p>
                          <SquarePen size={16} className="text-gray-400" />
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
                <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-[8px] hover:bg-teal-50 transition font-['SVN-Gilroy']">
                  Thêm địa chỉ mới
                </button>
              </div>
              
              <div className="space-y-4">
                {userData.savedAddresses.map(address => (
                  <div key={address.id} className="bg-white rounded-[8px] border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-gray-100 rounded-[8px] mr-4">
                        <MapPin size={20} className="text-gray-500" />
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
        
        <Footer />
      </div>
    </div>
  );
};

export default ProfileCustomer;
