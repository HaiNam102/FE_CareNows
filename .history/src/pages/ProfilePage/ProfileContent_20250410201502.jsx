// ProfileContent.jsx
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import HoverButton from '../../components/HoverButton';

const ProfileContent = ({ profile = {} }) => {
  // Animation classes
  const fadeIn = "animate__animated animate__fadeIn";
  const bounceIn = "animate__animated animate__bounceIn";
  const pulse = "animate__animated animate__pulse";
  const fadeInUp = "animate__animated animate__fadeInUp";
  const zoomIn = "animate__animated animate__zoomIn";
  const heartBeat = "animate__animated animate__heartBeat";
  const slideInRight = "animate__animated animate__slideInRight";

  useEffect(() => {
    // Adding delay to stagger animations if needed
    const animationElements = document.querySelectorAll('.animate__animated');
    animationElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  // Extract properties from profile data with appropriate fallbacks
  const {
    nameOfCareTaker = "Tên không xác định",
    experienceYear = "N/A",
    rating = 5.0,
    numberOfReviews = 0,
    servicePrice = "N/A",
    imgProfile = "",
    introduction = "Không có thông tin giới thiệu",
    ward = "",
    district: profileDistrict = "",
    address = "",
    totalHires = 0,
    completedHires = 0,
  } = profile;

  // Calculate full address if ward and district are available
  const fullAddress = address || (ward && profileDistrict  ? `${ward}, ${profileDistrict}, Đà Nẵng` : "Chưa cập nhật địa chỉ");
  
  // Format experience with "năm kinh nghiệm" suffix if it's not already included
  const formattedExperience = 
    experienceYear && !String(experienceYear).includes("năm") 
      ? `${experienceYear} năm kinh nghiệm` 
      : experienceYear || "Chưa có thông tin kinh nghiệm";

  return (
    <>
      {/* Profile Section */}
      <div className="flex items-center justify-between p-6 border-t font-['SVN-Gilroy']">
        <div className={`${fadeInUp}`} style={{ animationDuration: '1.2s' }}>
          <h1 className="text-2xl font-bold mb-1">
            {nameOfCareTaker}
          </h1>
          <p className="text-gray-500 mb-2">
             {formattedExperience}
          </p>
          <div className={`flex items-center mb-1 ${pulse}`} style={{ animationDuration: '2s', animationIterationCount: '2' }}>
            <span className="text-[#00a37d] flex items-center">
              <FontAwesomeIcon icon={faStar} className="mr-1" /> 
              <span className="font-medium">{rating}</span>
              <span className="text-gray-400 ml-1">({numberOfReviews})</span>
            </span>
          </div>
          <a href="#" className="text-[#00a37d] text-sm underline mr-8">
            Xem tất cả đánh giá
          </a>

          <span className={`bg-[#00a37d] text-white px-4 py-2 mb-2 rounded text-center ${heartBeat}`} style={{ animationDelay: '1s', animationDuration: '1.5s' }}>
            {servicePrice}/h
          </span>
        </div>

        <div className={`flex flex-col items-end ${bounceIn}`} style={{ animationDuration: '1.5s' }}>
          <img 
            src={imgProfile} 
            alt={`Ảnh của ${nameOfCareTaker}`} 
            className="w-40 h-40 rounded-full mb-3 object-cover transition-transform duration-300 transform hover:scale-105" 
          />
        </div>
      </div>

      {/* Introduction Section */}
      <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-bold mb-4">
          Giới thiệu
        </h2>
        <p className="text-gray-700">
          "{introduction || 'Chưa cập nhật thông tin giới thiệu'}"
        </p>
      </div>

      {/* Work Address */}
      <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.5s' }}>
        <h2 className="text-xl font-bold mb-4">
          Địa chỉ làm việc
        </h2>
        <p className="text-gray-700">
          {fullAddress}
        </p>
      </div>

      {/* Statistics */}
      <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.7s' }}>
        <div className="flex justify-between text-center">
          <div className={`flex flex-col items-start ${zoomIn}`} style={{ animationDelay: '1s' }}>
            <p className="text-gray-500 mb-2">
              Tổng số lượt thuê
            </p>
            <div className="flex items-center ">
              <div className="w-1 h-6 bg-red-500 mr-2"></div>
              <p className="text-2xl font-bold">
                {totalHires || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <div className={`flex flex-col items-end p-6 ${slideInRight}`} style={{ animationDuration: '1s', animationDelay: '0.8s' }}>
        <HoverButton text="Đặt lịch ngay" size="small" showArrow={true} />
      </div>
    </>
  );
};

export default ProfileContent;