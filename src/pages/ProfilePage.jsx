import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import HoverButton from '../components/HoverButton';
import 'animate.css'; // Import animate.css library

const ProfilePage = ({ profile = {}, onClose, onNavigate, district, dateRange }) => {
  const {
    name = "Tố Uyên",
    role = "Điều dưỡng",
    experience = "5 năm kinh nghiệm",
    rating = 5,
    reviews = 20,
    hourlyRate = "120k",
    image = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    introduction = "Xin chào! Tôi là Tú Uyên, tôi có hơn 5 năm kinh nghiệm chăm sóc bệnh nhân cao tuổi, đặc biệt là người bị Alzheimer và bệnh nhân phục hồi sau phẫu thuật. Tôi luôn tận tâm, chu đáo và mong muốn giúp đỡ bệnh nhân có cuộc sống tốt hơn.",
    address = "15 Trung Nghĩa 2, Hoà Minh, Liên Chiểu, Đà Nẵng 550000",
    totalHires = 50,
    completedHires = 50,
    acceptanceRate = "100%"
  } = profile;

  // Animation classes
  const fadeIn = "animate__animated animate__fadeIn";
  const bounceIn = "animate__animated animate__bounceIn";
  const slideInRight = "animate__animated animate__slideInRight";
  const slideInLeft = "animate__animated animate__slideInLeft";
  const pulse = "animate__animated animate__pulse";
  const fadeInUp = "animate__animated animate__fadeInUp";
  const zoomIn = "animate__animated animate__zoomIn";
  const heartBeat = "animate__animated animate__heartBeat";

  useEffect(() => {
    // Adding delay to stagger animations if needed
    const animationElements = document.querySelectorAll('.animate__animated');
    animationElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return (
    <div className={`w-[700px] h-[790px] overflow-y-auto bg-[#f9f9f9] rounded-lg shadow-xl ${fadeIn}`} style={{ animationDuration: '1s' }}>
      <div className="max-w-2xl mx-auto">
        {/* Navigation Tabs */}
        <div className={`flex justify-between items-center p-4 ${slideInLeft}`}>
          <div className="flex space-x-6">
            <a href="#" className="text-white bg-[#00a37d] px-4 py-2 rounded" onClick={() => onNavigate('profile')}>
              Hồ sơ
            </a>
            <a href="#" className="text-gray-400 px-4 py-2" onClick={() => onNavigate('services')}>
              Dịch vụ
            </a>
            <a href="#" className="text-gray-400 px-4 py-2" onClick={() => onNavigate('schedule')}>
              Lịch
            </a>
            <a href="#" className="text-gray-400 px-4 py-2" onClick={() => onNavigate('reviews')}>
              Đánh giá
            </a>
            <a href="#" className="text-gray-400 px-4 py-2" onClick={() => onNavigate('messages')}>
              Nhắn tin
            </a>
          </div>
          <button 
            onClick={onClose}
            className="text-[#00a37d]"
          >
             <HoverButton text="X" size="medium" showArrow={false} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center justify-between p-6 border-t">
          <div className={`${fadeInUp}`} style={{ animationDuration: '1.2s' }}>
            <h1 className="text-2xl font-bold mb-1">
              {name}
            </h1>
            <p className="text-gray-500 mb-2">
              {role} | {experience}
            </p>
            <div className={`flex items-center mb-1 ${pulse}`} style={{ animationDuration: '2s', animationIterationCount: '2' }}>
              <span className="text-[#00a37d] flex items-center">
                <FontAwesomeIcon icon={faStar} className="mr-1" /> 
                <span className="font-medium">{rating}</span>
                <span className="text-gray-400 ml-1">({reviews})</span>
              </span>
            </div>
            <a href="#" className="text-[#00a37d] text-sm underline mr-8">
              Xem tất cả đánh giá
            </a>

            <span className={`bg-[#00a37d] text-white px-4 py-2 mb-8 rounded text-center ${heartBeat}`} style={{ animationDelay: '1s', animationDuration: '1.5s' }}>
              {hourlyRate}/h
            </span>
          </div>

          <div className={`flex flex-col items-end ${bounceIn}`} style={{ animationDuration: '1.5s' }}>
            <img 
              src={image} 
              alt={`Ảnh của ${name}`} 
              className="w-40 h-40 rounded-full mb-3 object-cover" 
            />
          </div>
        </div>

        {/* Introduction Section */}
        <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold mb-4">
            Giới thiệu
          </h2>
          <p className="text-gray-700">
            "{introduction}"
          </p>
        </div>

        {/* Work Address */}
        <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-bold mb-4">
            Địa chỉ làm việc
          </h2>
          <p className="text-gray-700">
            {address}
          </p>
        </div>

        {/* Statistics */}
        <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.7s' }}>
          <div className="flex justify-between text-center">
            <div className={`flex flex-col items-center ${zoomIn}`} style={{ animationDelay: '1s' }}>
              <p className="text-gray-500 mb-2">
                Tổng số lượt thuê
              </p>
              <div className="flex items-center">
                <div className="w-1 h-6 bg-red-500 mr-2"></div>
                <p className="text-2xl font-bold">
                  {totalHires}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Button */}
        <div className={`flex flex-col items-end  ${slideInRight}`} style={{ animationDuration: '1s', animationDelay: '0.8s' }}>
          <HoverButton text="Đặt lịch ngay" size="medium" showArrow={true} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;