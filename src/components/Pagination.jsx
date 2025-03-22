import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    let pages = [];
    // Hiển thị tối đa 5 số trang
    if (totalPages <= 5) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu và trang cuối
      if (currentPage <= 3) {
        // Nếu đang ở gần trang đầu
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Nếu đang ở gần trang cuối
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        {pageNumbers.map(number => (
          <a 
            key={number}
            className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer ${
              number === currentPage ? 'bg-[#00a37d] text-white' : 'bg-white text-gray-700'
            }`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </a>
        ))}
        <span className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md">
          {currentPage}/{totalPages}
        </span>
      </nav>
    </div>
  );
};

export default Pagination;