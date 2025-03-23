import React, { useState, useRef } from 'react';
import './Button.css';

const Button = ({ text = "Đăng ký ngay", onClick, className = "" }) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Xóa timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button 
      className={`custom-button ${isHovering ? 'hovering' : 'default'} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={`button-content ${isHovering ? 'hidden' : 'visible'}`}>
        <span className="button-text">{text}</span>
        <span className="button-arrow">→</span>
      </div>
      <div className={`button-slide-effect ${isHovering ? 'active' : ''}`}></div>
    </button>
  );
};

export default Button;