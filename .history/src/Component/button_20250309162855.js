import React, { useState } from 'react';
import './Button.css';

const Button = ({ text = "Đăng ký ngay", onClick, className = "" }) => {
  const [animationState, setAnimationState] = useState("default");

  const handleClick = () => {
    // Bắt đầu chuỗi animation
    setAnimationState("empty");
    
    // Sau khi chuyển sang trạng thái empty, bắt đầu animation lướt màu
    setTimeout(() => {
      setAnimationState("sliding");
      
      // Sau khi animation lướt hoàn tất, chuyển sang trạng thái viền
      setTimeout(() => {
        setAnimationState("outlined");
        
        // Gọi hàm onClick được truyền vào component
        if (onClick) onClick();
        
        // Reset lại trạng thái mặc định sau 2 giây
        setTimeout(() => {
          setAnimationState("default");
        }, 2000);
      }, 800); // Thời gian của animation lướt
    }, 300); // Thời gian chuyển từ default sang empty
  };

  return (
    <button 
      className={`custom-button ${animationState} ${className}`}
      onClick={handleClick}
      disabled={animationState !== "default"}
    >
      {animationState === "default" || animationState === "outlined" ? (
        <>
          <span className="button-text">{text}</span>
          <span className="button-arrow">→</span>
        </>
      ) : null}
    </button>
  );
};

export default Button;