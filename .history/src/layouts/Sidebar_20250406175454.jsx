import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  User,
  Clock,
  FileText,
  ClipboardList,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.role.toLowerCase();
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const navItems = [
    { 
      path: '/customer/profile', 
      label: 'Hồ sơ cá nhân', 
      icon: <User size={20} />, 
      roles: ['customer'] 
    },
    { 
      path: '/customer/appointments', 
      label: 'Lịch chăm sóc đã đặt', 
      icon: <Clock size={20} />, 
      roles: ['customer'] 
    },
    { 
      path: '/customer/medical-records', 
      label: 'Quản lý hồ sơ bệnh nhân', 
      icon: <FileText size={20} />, 
      roles: ['customer'] 
    },
    { 
      path: '/customer/medical-records-list', 
      label: 'Quản lý hồ sơ bệnh nhân', 
      icon: <ClipboardList size={20} />, 
      roles: ['customer'] 
    }
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  const logoutHandler = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={`fixed left-0 top-0 z-40 h-screen bg-white transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
         style={{ marginLeft: '141px', width: '252px' }}>
      <div className="h-full flex flex-col py-8">
        {/* Welcome Message */}
        <div className="px-4 mb-8">
          <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Xin chào Tan!</h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {filteredNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-base font-['SVN-Gilroy'] ${
                    location.pathname === item.path
                      ? 'bg-[#00A3FF] bg-opacity-10 text-[#00A3FF] border-l-4 border-[#00A3FF]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        {userRole && (
          <div className="px-4">
            <button
              onClick={logoutHandler}
              className="flex w-full items-center p-2 text-base font-['SVN-Gilroy'] text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-3"><LogOut size={20} /></span>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile close button */}
      <button 
        className="lg:hidden absolute top-3 right-3 p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        onClick={toggleSidebar}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Sidebar;
