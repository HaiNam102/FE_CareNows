import React, { useState, useEffect } from 'react';
import { User, MapPin, Star, Calendar, Phone, Mail, Edit3, Camera, Award, Clock, Users, Heart, MessageCircle } from 'lucide-react';

const CareTakerProfile = ({ careTakerId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!careTakerId) {
      setLoading(false);
      setError('CareTaker ID not available.');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/careTaker/getCareTakerId/${careTakerId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const result = await response.json();
        if (result.code === 1010 && result.message === "Get successful") {
          setProfileData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load profile');
        }
      } catch (err) {
        setError(err.message);
        setProfileData({
          careTakerId: careTakerId,
          nameOfCareTaker: "Trần Thị Bình",
          experienceYear: 5,
          servicePrice: "80000",
          image: "https://res.cloudinary.com/daowidkvi/image/upload/v1747899258/18..-Nguy%E1%BB%85n-Thanh-Ph%C6%B0%C6%A1ng-1ng-scaled_kjqrrp.jpg",
          introduceYourself: "Experienced nanny",
          workableArea: "Ba Đình",
          ward: "Hoa Minh",
          district: "Liên Chiểu",
          rating: 0.0,
          numberOfReviews: 0,
          totalBookings: 15,
          careTakerFeedBackRes: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [careTakerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg animate-fadeIn">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-6 text-lg font-medium">Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice)) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(numericPrice) + ' VNĐ';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-200 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Hồ sơ chăm sóc
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Thông tin chi tiết về người chăm sóc</p>
          </div>
          {/* <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg">
            <Edit3 className="w-5 h-5" />
            <span>Chỉnh sửa</span>
          </button> */}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">

        <div className="px-6 py-12 bg-gradient-to-br from-teal-50 to-emerald-100 lg:px-10 lg:py-19">
  <div className="flex flex-col lg:flex-row lg:items-start -mt-20 lg:space-x-6">
    {/* Avatar */}
    <div className="relative mb-6 lg:mb-0 mx-auto lg:mx-0 group">
      <div className="w-36 h-36 rounded-full bg-white p-1 shadow-lg border-white transform group-hover:scale-105 transition-transform duration-300">
        <img
          src={profileData?.image || 'https://via.placeholder.com/150'}
          alt={profileData?.nameOfCareTaker}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <button className="absolute bottom-2 right-2 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-all duration-200 shadow-md transform hover:scale-110">
        <Camera className="w-5 h-5" />
      </button>
    </div>
    {/* Basic Info */}
    <div className="flex-1 pt-12">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{profileData?.nameOfCareTaker}</h2>
          {/* <p className="text-gray-600 mb-4 text-base leading-relaxed max-w-xl">{profileData?.introduceYourself}</p> */}

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              {renderStars(profileData?.rating || 0)}
              <span className="text-base font-medium text-gray-800">
                {profileData?.rating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-gray-500 text-sm">
                ({profileData?.numberOfReviews || 0} đánh giá)
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-teal-500" />
            <span className="text-base">
              {`${profileData?.workableArea ? profileData.workableArea + ', ' : ''} ${profileData?.ward ? profileData.ward + ', ' : ''}${profileData?.district ? profileData.district + ', ' : ''}`}
            </span>
          </div>
        </div>

        {/* Monthly Income Section */}
        {/* <div className="mt-4 lg:mt-0 lg:ml-6 bg-gradient-to-br from-teal-300 to-emerald-400 rounded-lg p-4 shadow-md text-white">
          <p className="text-sm font-medium">Thu nhập tháng này</p>
          <p className="text-2xl font-bold">
            {formatPrice((profileData?.servicePrice || 0))}
          </p>
        </div> */}
      </div>
    </div>
  </div>
</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-md hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{profileData?.experienceYear || 0}</h3>
            <p className="text-gray-600 text-base">Năm kinh nghiệm</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-md hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{profileData?.totalBookings || 0}</h3>
            <p className="text-gray-600 text-base">Tổng số ca làm</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-md hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{formatPrice(profileData?.servicePrice || 0)}</h3>
            <p className="text-gray-600 text-base">Giá dịch vụ/giờ</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Phone className="w-6 h-6 mr-3 text-teal-500" />
              Thông tin liên hệ và giới thiệu
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="w-6 h-6 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-lg">{profileData?.phoneNumber || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-6 h-6 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-lg">{profileData?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                {/* <Mail className="w-6 h-6 text-teal-500 mr-4" /> */}
                <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Giới thiệu bản thân</p>
                <p className="font-medium text-lg leading-relaxed">{profileData?.introduceYourself || 'Chưa có thông tin giới thiệu.'}</p>
              </div>
              </div>
              
              
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-teal-500" />
              Thông tin địa chỉ 
            </h3>
            <div className="space-y-4">
             
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ cụ thể</p>
                  <p className="font-medium text-lg">{profileData?.workableArea || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Xã/Phường</p>
                  <p className="font-medium text-lg">{profileData?.ward || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Quận/Huyện</p>
                  <p className="font-medium text-lg">{profileData?.district || 'Chưa cập nhật'}</p>
                </div>
              </div>
              {/* <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Kinh nghiệm</p>
                <p className="font-medium text-lg">{profileData?.experienceYear || 0} năm</p>
              </div> */}
              {/* <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-700">Giá dịch vụ</p>
                <p className="font-bold text-xl text-teal-600">{formatPrice(profileData?.servicePrice || 0)}/giờ</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md mt-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 mr-3 text-teal-500" />
            Đánh giá từ khách hàng
          </h3>
          {profileData?.careTakerFeedBackRes?.length > 0 ? (
            <div className="space-y-6">
              {profileData.careTakerFeedBackRes.map((review, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg text-gray-900">{''+review.customerName}</h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating || 0)}
                        </div>
                      </div>
                      <div className="text-gray-600 text-base leading-relaxed">{review.feedback || review.reviewContent || 'Nội dung đánh giá trống.'}</div>
                      {/* <p className="text-gray-600 text-base leading-relaxed">{''+review.createdAt}</p> */}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Chưa có đánh giá nào</p>
              <p className="text-gray-400 mt-2 text-sm">Hãy là người đầu tiên đánh giá dịch vụ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareTakerProfile;