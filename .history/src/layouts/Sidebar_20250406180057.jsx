import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Clock, FileText, ClipboardList, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const userName = "Tan";

  const menuItems = [
    {
      title: 'Hồ sơ cá nhân',
      icon: <User size={20} />,
      path: '/profile'
    },
    {
      title: 'Lịch chăm sóc đã đặt',
      icon: <Clock size={20} />,
      path: '/appointments'
    },
    {
      title: 'Quản lý hồ sơ bệnh nhân',
      icon: <FileText size={20} />,
      path: '/patient-records'
    },
    {
      title: 'Quản lý hồ sơ bệnh nhân',
      icon: <ClipboardList size={20} />,
      path: '/manage-records'
    }
  ];

  return (
    <div className="fixed top-0 left-[141px] h-screen w-[252px] py-8 flex flex-col">
      {/* Welcome message with divider */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold font-['SVN-Gilroy'] mb-4">Xin chào {userName}!</h2>
        <div className="h-[1px] bg-gray-200 w-full"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        {menuItems.map((item, index) => {
          const isSelected = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-1 relative ${
                isSelected 
                  ? 'text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`mr-3 ${isSelected ? 'ml-[-2px]' : ''}`}>
                {item.icon}
              </span>
              <span className="font-['SVN-Gilroy']">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4">
        <button className="flex items-center text-gray-600 hover:text-gray-900">
          <LogOut size={20} className="mr-3" />
          <span className="font-['SVN-Gilroy']">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
