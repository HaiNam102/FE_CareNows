import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Clock, FileText, ClipboardList } from 'lucide-react';
import HoverButtonOutline from './HoverButtonOutline';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const CustomerSidebar = () => {
  const location = useLocation();
  const [userData, setUserData] = useState({ name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/customer/getByCustomerId`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data && response.data.data) {
          setUserData({
            name: response.data.data.nameOfCustomer || ''
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
    window.location.href = '/login';
  };

  return (
    <div className="w-[285px]">
      <div>
        <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">
          Xin chào {loading ? '...' : userData.name}!
        </h2>
        <div className="h-[1px] bg-gray-200 w-full"></div>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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
            </Link>
          );
        })}
      </nav>

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