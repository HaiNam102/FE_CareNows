import React, { useState, useRef, useEffect } from 'react';
import './ButtonHoverOutlinedcss';

const ButtonHoverOutlined = ({ text = "Đăng ký ngay", onClick, className = "" }) => {
  const [hoverState, setHoverState] = useState("default");
  const timeoutRef = useRef(null);

  // Xử lý khi hover vào button
  const handleMouseEnter = () => {
    // Xóa timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Bắt đầu sequence animation
    setHoverState("empty");
    
    // Sau khoảng thời gian ngắn, chuyển sang trạng thái sliding
    timeoutRef.current = setTimeout(() => {
      setHoverState("sliding");
      
      // Sau khi slide hoàn tất, chuyển sang trạng thái outlined
      timeoutRef.current = setTimeout(() => {
        setHoverState("outlined");
      }, 800); // Thời gian animation slide
    }, 200); // Thời gian để text biến mất
  };

  // Xử lý khi rời chuột khỏi button
  const handleMouseLeave = () => {
    // Xóa timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Quay về trạng thái mặc định
    setHoverState("default");
  };

  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button 
      className={`hover-outlined-button ${hoverState} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Hiển thị text và mũi tên ở trạng thái default và outlined */}
      {(hoverState === "default" || hoverState === "outlined") && (
        <div className={`button-content ${hoverState === "outlined" ? "outlined-text" : ""}`}>
          <span className="button-text">{text}</span>
          <span className="button-arrow">→</span>
        </div>
      )}
      
      {/* Element cho hiệu ứng slide */}
      {hoverState === "sliding" && (
        <div className="slide-effect"></div>
      )}
    </button>
  );
};

export default ButtonHoverOutlined;