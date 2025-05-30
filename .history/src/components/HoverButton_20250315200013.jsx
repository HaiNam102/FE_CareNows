import React, { useState } from "react";

const sizes = {
  small: { fontSize: "12px", height: "36px", arrowFontSize: "20px" },
  medium: { fontSize: "16px", height: "44px", arrowFontSize: "24px"},
  large: { fontSize: "20px", height: "56px", arrowFontSize: "24px"}
}; 

const variants = {
  primary: {
    borderColor: "#00A37D",
    backgroundColor: "#00A37D",
    textColor: "white",
    hoverTextColor: "#00A37D"
  },
  secondary: {
    borderColor: "#7F798F",
    backgroundColor: "#7F798F",
    textColor: "white",
    hoverTextColor: "#7F798F"
  }
};

const HoverButton = ({ text, showArrow = true, size = "medium", variant = "primary", onClick, className }) => {
  const [hovered, setHovered] = useState(false);
  const { fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  const { borderColor, backgroundColor, textColor, hoverTextColor } = variants[variant] || variants.primary;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", // Giữ kích thước nguyên vẹn
        alignItems: "center",
        gap: "2px", // Không thay đổi gap khi hover để tránh ảnh hưởng layout
        transition: "none", // Loại bỏ animation gap
        flexShrink: 0, // Ngăn việc co giãn layout
      }}
    >
      {/* Button chính */}
      <button
        onClick={onClick}
        style={{
          fontSize,
          fontWeight: 500,
          fontFamily: "SVN-Gilroy, sans-serif",
          position: "relative",
          transition: "all 0.3s ease-in-out",
          borderRadius: "4px",
          border: `1.5px solid ${borderColor}`,
          backgroundColor: "transparent", // Background sẽ được xử lý bằng span
          color: hovered ? hoverTextColor : textColor,
          cursor: "pointer",
          height, // Chiều cao cố định, không bị padding ảnh hưởng
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px", // Chỉ padding ngang, không ảnh hưởng height
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        className={`${className}`}
      >
        {/* Lớp phủ */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: backgroundColor,
            transition: "transform 0.3s ease-in-out",
            transform: hovered ? "translateY(-100%)" : "translateY(0)",
          }}
        ></span>

        <span
          style={{
            position: "relative",
            zIndex: 10,
            transition: "color 0.3s ease-in-out",
            color: hovered ? hoverTextColor : textColor,
          }}
        >
          {text}
        </span>
      </button>

      {/* Biểu tượng mũi tên */}
      {showArrow && (
        <div
          style={{
            width: height, // Đảm bảo là hình vuông bằng với button
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            border: `1.5px solid ${borderColor}`,
            backgroundColor: "transparent", // Background sẽ xử lý bằng span
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Lớp phủ */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: backgroundColor,
              transition: "transform 0.3s ease-in-out",
              transform: hovered ? "translateY(-100%)" : "translateY(0)",
            }}
          ></span>

          <span
            style={{
              position: "relative",
              zIndex: 10,
              color: hovered ? hoverTextColor : textColor,
              fontSize: arrowFontSize,
              fontWeight: "bold",
              transition: "color 0.3s ease-in-out",
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
