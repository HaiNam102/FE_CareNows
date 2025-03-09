import React, { useState } from "react";

const sizes = {
  small: { fontSize: "12px", height: "36px", arrowFontSize: "20px" },
  medium: { fontSize: "16px", height: "44px", arrowFontSize: "24px" },
  large: { fontSize: "20px", height: "56px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: hovered && showArrow ? "10px" : "2px",
        transition: "gap 0.4s ease-in-out",
      }}
    >
      {/* Button chính */}
      <button
        style={{
          fontSize,
          fontWeight: 500,
          fontFamily: "SVN-Gilroy, sans-serif",
          transition: "all 0.3s ease-in-out",
          borderRadius: "8px",
          border: "1.5px solid #00A37D",
          backgroundColor: hovered ? "transparent" : "#00A37D",
          color: hovered ? "#00A37D" : "white",
          cursor: "pointer",
          height, // Đặt chiều cao cố định
          width: "auto", // Chiều rộng tự động theo nội dung
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px", // Chỉ có padding ngang, không ảnh hưởng chiều cao
          boxSizing: "border-box",
        }}
      >
        {text}
      </button>

      {/* Biểu tượng mũi tên */}
      {showArrow && (
        <div
          style={{
            width: height, // Là hình vuông bằng với chiều cao của button
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            border: "1.5px solid #00A37D",
            backgroundColor: hovered ? "transparent" : "#00A37D",
            transition: "all 0.3s ease-in-out",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              color: hovered ? "#00A37D" : "white",
              fontSize: arrowFontSize,
              fontWeight: "bold",
              transition: "color 0.4s ease-in-out",
            }}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
};

export default HoverButton;
