// ProfileContent.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import HoverButton from '../../components/HoverButton';
import api, { careTakerApi } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileContent = ({ profile = {}, onCareTakerSelect, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [similarCareTakers, setSimilarCareTakers] = useState([]);
  const [showCareTakerList, setShowCareTakerList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(profile);

  // Always fetch latest profile by id if available
  useEffect(() => {
    if (profile?.careTakerId) {
      careTakerApi.getById(profile.careTakerId)
        .then(res => {
          if (res.data && res.data.data) {
            setProfileData(res.data.data);
            console.log(res)
          }
        })
        .catch(err => {
          // Nếu lỗi thì giữ nguyên profile cũ
        });
    } else {
      setProfileData(profile);
    }
  }, [profile?.careTakerId]);

  // Check if we have a valid profile with careTakerId on mount or when profile changes
  useEffect(() => {
    if (profile && profile.careTakerId && onCareTakerSelect) {
      console.log("Profile has careTakerId:", profile.careTakerId);
      onCareTakerSelect(profile.careTakerId);
    }
  }, [profile?.careTakerId, onCareTakerSelect]);

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
  
  // Handle caretaker selection
  const handleSelectCareTaker = (caretaker) => {
    if (onCareTakerSelect) {
      onCareTakerSelect(caretaker.careTakerId);
    }
    setShowCareTakerList(false);
  };

  const handleBookingClick = () => {
    if (onNavigate) {
      onNavigate('schedule');
    }
  };

  // Extract properties from profile data with appropriate fallbacks
  const {
    nameOfCareTaker = "Tên không xác định",
    experienceYear = "N/A",
    rating = 5.0,
    totalReviewers = 0,
    servicePrice = "N/A",
    imgProfile = "",
    introduceYourself = "Không có thông tin giới thiệu",
    ward = "",
    district: profileDistrict = "",
    address = "",
    totalBookings = 0,
    completedHires = 0,
    careTakerId
  } = profileData || {};

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
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold mr-2">
              {nameOfCareTaker}
            </h1>
            {/* <button 
              onClick={fetchSimilarCareTakers}
              className="text-gray-600 hover:text-green-600 flex items-center"
              title="Xem các bảo mẫu khác"
            >
              <FontAwesomeIcon icon={faExchangeAlt} className="ml-2" />
            </button> */}
          </div>
          <p className="text-gray-500 mb-2">
             {formattedExperience}
          </p>
          <div className={`flex items-center mb-1 ${pulse}`} style={{ animationDuration: '2s', animationIterationCount: '2' }}>
            <span className="text-[#00a37d] flex items-center">
              <FontAwesomeIcon icon={faStar} className="mr-1" /> 
              <span className="font-medium">{rating}</span>
              <span className="text-gray-400 ml-1">({totalReviewers
})</span>
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

      {/* Similar CareTakers List */}
      {showCareTakerList && (
        <div className="p-6 border-t border-b">
          <h3 className="text-lg font-medium mb-4">Bảo mẫu tương tự trong khu vực</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {similarCareTakers.length > 0 ? (
                <div className="space-y-4">
                  {similarCareTakers.map((caretaker) => (
                    <div 
                      key={caretaker.careTakerId}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSelectCareTaker(caretaker)}
                    >
                      <img 
                        src={caretaker.imgProfile} 
                        alt={caretaker.nameOfCareTaker} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="font-medium">{caretaker.nameOfCareTaker}</div>
                        <div className="text-sm text-gray-500">{caretaker.experienceYear} năm kinh nghiệm</div>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <div className="flex items-center text-[#00a37d]">
                          <FontAwesomeIcon icon={faStar} className="mr-1" size="sm" />
                          <span>{caretaker.rating}</span>
                        </div>
                        <div className="text-sm font-semibold">{caretaker.servicePrice}/h</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Không tìm thấy bảo mẫu tương tự trong khu vực này</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Introduction Section */}
      <div className={`p-6 border-t ${fadeIn}`} style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-bold mb-4">
          Giới thiệu
        </h2>
        <p className="text-gray-700">
          "{introduceYourself || 'Chưa cập nhật thông tin giới thiệu'}"
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
                {totalBookings || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <div className={`flex flex-col items-end p-6 ${slideInRight}`} style={{ animationDuration: '1s', animationDelay: '0.8s' }}>
        <HoverButton 
          text="Đặt lịch ngay" 
          size="medium" 
          showArrow={true} 
          onClick={handleBookingClick}
        />
      </div>
    </>
  );
};

export default ProfileContent;