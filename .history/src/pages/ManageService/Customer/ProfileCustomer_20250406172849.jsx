import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Edit, PenSquare, Building, User, Calendar } from 'lucide-react';
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import { jwtDecode } from 'jwt-decode';

const ProfileCustomer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal-info');
  const [userData, setUserData] = useState({
    name: 'Nguyễn Nhật Tân',
    avatar: null,
    gender: 'Nam',
    birthday: '28-02-2001',
    phone: '0899229928',
    email: 'vananh4zzz51@gmail.com',
    address: '15 Trưng Nghĩa 2, Hòa Minh, Liên Chiểu, Đà Nẵng',
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt={userData.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      userData.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin size={16} className="mr-1" />
                      {userData.address}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-8">
                  <button 
                    onClick={() => setActiveTab('personal-info')}
                    className={`px-2 py-2 font-medium ${activeTab === 'personal-info' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-teal-500'}`}
                  >
                    Thông tin tài khoản
                  </button>
                  <button 
                    onClick={() => setActiveTab('saved-addresses')}
                    className={`px-2 py-2 font-medium ${activeTab === 'saved-addresses' 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-500 hover:text-teal-500'}`}
                  >
                    Địa chỉ đã lưu
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal-info' && (
                  <div className="space-y-6 animate__animated animate__fadeIn">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Họ và tên</p>
                            <p className="font-medium">{userData.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Ngày sinh</p>
                            <p className="font-medium">{userData.birthday}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{userData.phone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Mail size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{userData.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin size={20} className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Địa chỉ</p>
                            <p className="font-medium">{userData.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="flex items-center text-teal-600 font-medium">
                        <Edit size={16} className="mr-1" />
                        Chỉnh sửa thông tin
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Saved Addresses Tab */}
                {activeTab === 'saved-addresses' && (
                  <div className="space-y-6 animate__animated animate__fadeIn">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Địa chỉ đã lưu</h2>
                      <button className="flex items-center text-teal-600 font-medium">
                        <PenSquare size={16} className="mr-1" />
                        Thêm địa chỉ mới
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {userData.savedAddresses.map(address => (
                        <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start">
                            <Building size={20} className="text-gray-400 mr-3 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium">{address.name}</p>
                              <p className="text-gray-500 text-sm mt-1">{address.detail}</p>
                            </div>
                            <button className="text-teal-600 hover:text-teal-700">
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
