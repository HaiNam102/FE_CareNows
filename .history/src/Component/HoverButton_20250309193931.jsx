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
          border: "none", // Xóa viền để tránh chênh lệch kích thước
          backgroundColor: hovered ? "transparent" : "#00A37D",
          color: hovered ? "#00A37D" : "white",
          cursor: "pointer",
          height, // Giữ chiều cao cố định
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "180px",
          boxSizing: "border-box", // Đảm bảo padding không làm tăng size
        }}
      >
        {text}
      </button>

      {/* Biểu tượng mũi tên */}
      {showArrow && (
        <div
          style={{
            width: height, // Đảm bảo là một hình vuông đúng kích thước
            height, // Không có sai lệch
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: "none", // Loại bỏ viền để không làm lệch kích thước
            backgroundColor: hovered ? "transparent" : "#00A37D",
            transition: "all 0.3s ease-in-out",
            boxSizing: "border-box", // Ngăn chặn sự thay đổi do padding
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
