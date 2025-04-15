// Layout.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import HoverButton from '../../components/HoverButton';
import 'animate.css';

const ProfileLayout = ({ children, activeTab, onNavigate, onClose, district, dateRange }) => {
  // Animation classes
  const fadeIn = "animate__animated animate__fadeIn";
  const slideInLeft = "animate__animated animate__slideInLeft";

  return (
    <div className={`w-[700px] h-[790px] overflow-y-auto bg-[#f9f9f9] rounded-lg shadow-xl ${fadeIn}`} style={{ animationDuration: '1s', maxHeight: '90vh', overflowY: 'auto' }}>
      <div className="max-w-2xl mx-auto">
        {/* Navigation Tabs */}
        <div className={`flex justify-between items-center p-4 ${slideInLeft}`}>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'text-white bg-[#00a37d]' : 'text-gray-400'}`} 
              onClick={() => onNavigate('profile', district, dateRange)}
            >
              Hồ sơ
            </a>
            <a 
              href="#" 
              className={`px-4 py-2 ${activeTab === 'services' ? 'text-white bg-[#00a37d] rounded' : 'text-gray-400'}`} 
              onClick={() => onNavigate('services', district, dateRange)}
            >
              Dịch vụ
            </a>
            <a 
              href="#" 
              className={`px-4 py-2 ${activeTab === 'schedule' ? 'text-white bg-[#00a37d] rounded' : 'text-gray-400'}`} 
              onClick={() => onNavigate('schedule', district, dateRange)}
            >
              Lịch
            </a>
            <a 
              href="#" 
              className={`px-4 py-2 ${activeTab === 'reviews' ? 'text-white bg-[#00a37d] rounded' : 'text-gray-400'}`} 
              onClick={() => onNavigate('reviews', district, dateRange)}
            >
              Đánh giá
            </a>
            <a 
              href="#" 
              className={`px-4 py-2 ${activeTab === 'messages' ? 'text-white bg-[#00a37d] rounded' : 'text-gray-400'}`} 
              onClick={() => onNavigate('messages', district, dateRange)}
            >
              Nhắn tin
            </a>
          </div>
          <div 
            onClick={onClose}
            className="text-[#00a37d]"
            role="button"
            aria-label="Close profile"
            tabIndex={0}
          >
             <HoverButton text="X" size="medium" showArrow={false} isNested={true} />
          </div>
        </div>

        {/* Content Section */}
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;