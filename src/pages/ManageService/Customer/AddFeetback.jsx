import React, { useState } from 'react';
import { Star, X, Send, User } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // Nhập toast từ react-toastify
import api, { careTakerApi } from '../../../services/api';

export default function AddFeedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

  const careTakerId = 2; // Giả sử careTakerId được cố định là 2 như trong ảnh
  // Trong thực tế, bạn có thể truyền careTakerId qua props hoặc lấy từ context/state

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setShowConfirmation(false);
    setRating(0);
    setFeedback('');
    setSubmittedData(null);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (rating === 0 || !feedback.trim()) {
      toast.warn('Vui lòng chọn số sao và nhập nhận xét!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    const requestBody = {
      feedback: feedback,
      rating: rating,
    };

    try {
      const response = await careTakerApi.addReview(careTakerId, requestBody) ;
      console.log('API Response:', response.data);

      if (response.data.code === 1011) {
        setSubmittedData(response.data.data);
        setShowConfirmation(true);
        toast.success('Gửi đánh giá thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response.data.message || 'Gửi đánh giá thất bại');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error(err.message || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-0">
      <button
        onClick={openModal}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Đánh giá
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {showConfirmation ? 'Đánh giá thành công' : 'Đánh giá chăm sóc viên'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {showConfirmation ? (
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <User size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="font-medium text-gray-800">
                    {submittedData?.care_taker?.nameOfCareTaker || 'Không xác định'}
                  </h4>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex mb-2">
                    <div className="font-medium w-32 text-gray-600">Đánh giá:</div>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={
                            index < (submittedData?.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex mb-2">
                    <div className="font-medium w-32 text-gray-600">Nhận xét:</div>
                    <div className="text-gray-800">{submittedData?.feedback || 'Không có nhận xét'}</div>
                  </div>
                  <div className="flex">
                    <div className="font-medium w-32 text-gray-600">Ngày đánh giá:</div>
                    <div className="text-gray-800">
                      {submittedData?.createdAt
                        ? new Date(submittedData.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Không xác định'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg w-full transition-colors duration-300"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <div className="p-6">
                {/* Thông tin chăm sóc viên */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <User size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="font-medium text-gray-800">
                    {submittedData?.care_taker?.nameOfCareTaker || 'Nguyen Thi Lan'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {submittedData?.care_taker?.experienceYear || 6} năm kinh nghiệm
                  </p>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá của bạn
                  </label>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <Star
                          key={index}
                          size={32}
                          className={`cursor-pointer mx-1 ${
                            ratingValue <= (hover || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét của bạn
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ chăm sóc..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-700"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || !feedback.trim() || isLoading}
                  className={`w-full rounded-lg py-2 px-4 flex items-center justify-center font-medium ${
                    rating === 0 || !feedback.trim() || isLoading
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  } transition-colors duration-300`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                        />
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Gửi đánh giá
                    </>
                  )}
                  
                </button>
              </div>
            )}
          </div>
        </div>
      )}
       <ToastContainer/>
    </div>
  );
  
}