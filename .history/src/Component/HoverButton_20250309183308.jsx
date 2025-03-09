import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowFontSize: "14px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "44px", arrowFontSize: "18px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowFontSize: "22px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: hovered && showArrow ? "12px" : "6px", 
        transition: "all 1.5s ease", // Chuyển đổi gap chậm hơn
        padding,
        fontSize,
        height,
        background: "transparent",
        border: "1px solid #333",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      {/* Text span */}
      <span
        style={{
          display: "inline-block",
          padding: "2px 4px",
          borderRadius: "3px",
          backgroundColor: hovered ? "#3498db" : "transparent",
          color: hovered ? "#fff" : "#333",
          transition: "all 2s ease" // Chuyển đổi màu nền và chữ chậm hơn
        }}
      >
        {text}
      </span>
      
      {/* Arrow span */}
      {showArrow && (
        <span
          style={{
            display: "inline-block",
            padding: "2px 4px",
            borderRadius: "3px",
            backgroundColor: hovered ? "#e74c3c" : "transparent",
            color: hovered ? "#fff" : "#333",
            fontSize: arrowFontSize,
            transition: "all 3s ease" // Chuyển đổi màu nền và chữ của mũi tên rất chậm
          }}
        >
          →
        </span>
      )}
    </button>
  );
};

export default HoverButton;