import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Clock, FileText, ClipboardList, LogOut, UserPen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const userName = "Tan";

  const menuItems = [
    {
      title: 'Hồ sơ cá nhân',
      icon: <User size={20} />,
      path: '/customer/profile'
    },
    {
      title: 'Lịch chăm sóc đã đặt',
      icon: <Clock size={20} />,
      path: '/customer/booking-history'
    },
    {
      title: 'Quản lý hồ sơ người bệnh',
      icon: <UserPen size={20} />,
      path: '/customer/medical-records'
    },
    {
      title: 'Quản lý hồ sơ bệnh nhân',
      icon: <ClipboardList size={20} />,
      path: '/customer/medical-records-list'
    }
  ];

  return (
    <div className="fixed ml-[141px] w-[285px]">
      {/* Welcome message with divider */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl mr-4">
            <User size={24} />
          </div>
          <div>
            <h2 className="font-bold text-xl">Xin chào, {userName}</h2>
            <p className="text-gray-500">Last login: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isSelected = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-teal-50 text-teal-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 w-5">{item.icon}</span>
                  <span className="font-['SVN-Gilroy']">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="mt-4">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 text-gray-600 hover:bg-gray-50 w-full"
          >
            <LogOut size={20} className="mr-3 w-5" />
            <span className="font-['SVN-Gilroy']">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
