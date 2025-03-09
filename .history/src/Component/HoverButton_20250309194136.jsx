import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowFontSize: "20px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "44px", arrowFontSize: "24px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;

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
          padding,
          fontSize,
          fontWeight: 500,
          fontFamily: "SVN-Gilroy, sans-serif",
          transition: "all 0.3s ease-in-out",
          borderRadius: "12px",
          border: "2px solid transparent", // Luôn có border để tránh giật layout
          backgroundColor: hovered ? "transparent" : "#00A37D",
          color: hovered ? "#00A37D" : "white",
          cursor: "pointer",
          height, // Đảm bảo chiều cao cố định
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "180px",
          boxSizing: "border-box", // Tránh border làm thay đổi kích thước
        }}
      >
        {text}
      </button>

      {/* Biểu tượng mũi tên */}
      {showArrow && (
        <div
          style={{
            width: height, // Đảm bảo là một hình vuông
            height, // Không có sai lệch kích thước
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: "2px solid transparent", // Giữ border ngay cả khi chưa hover
            backgroundColor: hovered ? "transparent" : "#00A37D",
            transition: "all 0.3s ease-in-out",
            boxSizing: "border-box", // Đảm bảo border không làm to lên
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
