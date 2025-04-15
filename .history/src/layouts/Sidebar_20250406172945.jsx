import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  Home, 
  Calendar, 
  User, 
  Search, 
  Settings, 
  Briefcase, 
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
    { path: '/', label: 'Home', icon: <Home size={20} />, roles: ['admin', 'care_taker', 'customer', null] },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} />, roles: ['admin', 'care_taker', 'customer'] },
    { path: '/customer/profile', label: 'Hồ sơ cá nhân', icon: <User size={20} />, roles: ['customer'] },
    { path: '/profilePage', label: 'Profile', icon: <User size={20} />, roles: ['admin', 'care_taker'] },
    { path: '/searchResult', label: 'Search', icon: <Search size={20} />, roles: ['admin', 'care_taker', 'customer'] },
    { path: '/admin/home', label: 'Admin Dashboard', icon: <Settings size={20} />, roles: ['admin'] },
    { path: '/caretaker/home', label: 'My Services', icon: <Briefcase size={20} />, roles: ['care_taker'] },
    { path: '/customer/home', label: 'My Bookings', icon: <ClipboardList size={20} />, roles: ['customer'] },
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
    <div className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="h-full flex flex-col justify-between overflow-y-auto py-4 px-3">
        <div>
          <div className="flex items-center justify-center mb-5 p-2">
            <h2 className="text-xl font-bold text-teal-600">CareNow</h2>
          </div>
          
          <ul className="space-y-2">
            {filteredNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 text-base font-normal rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-teal-100 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {userRole && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={logoutHandler}
              className="flex w-full items-center p-2 text-base font-normal text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <span className="mr-3"><LogOut size={20} /></span>
              <span>Logout</span>
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
