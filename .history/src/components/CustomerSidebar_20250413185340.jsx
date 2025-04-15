import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Clock, FileText, ClipboardList, LogOut } from 'lucide-react';
import HoverButtonOutline from './HoverButtonOutline';

const CustomerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      icon: <FileText size={20} />,
      path: '/customer/medical-records'
    },
    {
      title: 'Quản lý hồ sơ bệnh nhân',
      icon: <ClipboardList size={20} />,
      path: '/customer/medical-records-list'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="fixed ml-[141px] w-[285px]">
      {/* Welcome message with divider */}
      <div>
        <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">
          Xin chào {userName}!
        </h2>
        <div className="h-[1px] bg-gray-200 w-full"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center h-[40px] px-4 relative ${
                isSelected 
                  ? 'text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`mr-3 ${isSelected ? 'ml-[-2px]' : ''}`}>
                {item.icon}
              </span>
              <span className="font-['SVN-Gilroy']">{item.title}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 mt-4">
        <HoverButtonOutline 
          text="Đăng xuất"
          onClick={handleLogout}
          showArrow={false}
          variant="secondary"
          size="medium"
          className="w-full justify-start"
        />
      </div>
    </div>
  );
};

export default CustomerSidebar; 