import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const ReviewsSection=()=>{
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from API
  useEffect(() => {
    fetch('http://localhost:5000/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data); // API trả về mảng trực tiếp
        } else if (Array.isArray(data.reviews)) {
          setReviews(data.reviews); // API trả về { reviews: [...] }
        } else {
          console.error("Dữ liệu không đúng định dạng:", data);
          setReviews([]);
        }
      })      
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

  return (
    <div className="max-w-2xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-4">Đánh giá</h2>
      
      {/* Rating summary */}
      <div className="flex items-center justify-center mb-6">
        <Star className="text-green-500 fill-green-500" size={24} />
        <span className="text-xl font-bold mx-2">{averageRating}</span>
        <span className="text-xl">• {reviews.length} lượt đánh giá</span>
      </div>
      
      <hr className="border-gray-200" />
      
      {/* Reviews list */}
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <div key={review.id} className="py-6">
            <div className="flex items-start">
              {/* Profile picture */}
              <div className="mr-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="/api/placeholder/60/60" 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Review content */}
              <div className="flex-1">
                <div className="mb-1">
                  <h3 className="text-xl font-semibold">{review.name}</h3>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </div>
                
                {/* Star rating */}
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={24} 
                      className={`${i < review.rating ? "text-green-500 fill-green-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                
                {/* Review text */}
                <p className="text-lg">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <hr className="border-gray-200" />
    </div>
  );
}

export default ReviewsSection;
