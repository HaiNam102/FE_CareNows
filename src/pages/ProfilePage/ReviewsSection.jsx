import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import Pagination from '../../components/Pagination';

const ReviewsSection = ({ careTakerId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0); // 0: Tất cả, 1-5: Lọc theo số sao
  const reviewsPerPage = 5;

  useEffect(() => {
    if (!careTakerId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/careTakerFeedBack?careTaker_id=${careTakerId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const data = response.data;
        if (data.code === 1010 && Array.isArray(data.data)) {
          const formattedReviews = data.data.map((item) => ({
            id: item.feedback_id,
            name: item.customerName,
            date: new Date(item.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
            rating: item.rating,
            comment: item.feedback,
          }));
          setReviews(formattedReviews);
        } else {
          console.error('Unexpected data format:', data);
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [careTakerId]);

  // Lọc đánh giá theo số sao được chọn
  const filteredReviews = selectedRating === 0
    ? reviews
    : reviews.filter((review) => review.rating === selectedRating);

  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const totalReviewers = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalReviewers / reviews.length).toFixed(1) : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi chọn bộ lọc số sao
  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-['SVN-Gilroy'] flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đánh giá</h2>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center">
            <Star className="text-[#00A37D] fill-[#00A37D] mr-2" size={28} />
            <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
          </div>
          <span className="text-lg text-gray-600">• {reviews.length} lượt đánh giá</span>
        </div>

        {/* Star Rating Filter */}
        <div className="flex justify-center space-x-2">
          {[0, 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`flex items-center px-3 py-1 rounded-full border transition-colors duration-200 ${
                selectedRating === rating
                  ? 'bg-[#00A37D] text-white border-[#00A37D]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {rating === 0 ? (
                <span>Tất cả</span>
              ) : (
                <>
                  <span className="mr-1">{rating}</span>
                  <Star
                    size={16}
                    className={`${
                      selectedRating === rating
                        ? 'text-white fill-white'
                        : 'text-[#00A37D] fill-[#00A37D]'
                    }`}
                  />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 flex-grow">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                    <img
                      src="https://via.placeholder.com/60"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = 'https://picsum.photos/60')}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < review.rating ? 'text-[#00A37D] fill-[#00A37D]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">
              {selectedRating === 0
                ? 'Chưa có đánh giá nào.'
                : `Không có đánh giá nào với ${selectedRating} sao.`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalReviews > reviewsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;