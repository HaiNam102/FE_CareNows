import React, { useState } from "react";

const sizes = {
  small: { fontSize: "12px", height: "36px", arrowFontSize: "20px" },
  medium: { fontSize: "16px", height: "44px", arrowFontSize: "24px" },
  large: { fontSize: "20px", height: "56px", arrowFontSize: "24px" }
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
          position: "relative",
          transition: "all 0.3s ease-in-out",
          borderRadius: "4px",
          border: "1.5px solid #00A37D",
          backgroundColor: "transparent", // Background sẽ được xử lý bằng span
          color: hovered ? "#00A37D" : "white",
          cursor: "pointer",
          height, // Chiều cao cố định, không bị padding ảnh hưởng
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px", // Chỉ padding ngang, không ảnh hưởng height
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Lớp phủ */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#00A37D",
            transition: "transform 0.3s ease-in-out",
            transform: hovered ? "translateY(-100%)" : "translateY(0)",
          }}
        ></span>

        <span
          style={{
            position: "relative",
            zIndex: 10,
            transition: "color 0.3s ease-in-out",
            color: hovered ? "#00A37D" : "white",
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
            border: "1.5px solid #00A37D",
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
              backgroundColor: "#00A37D",
              transition: "transform 0.3s ease-in-out",
              transform: hovered ? "translateY(-100%)" : "translateY(0)",
            }}
          ></span>

          <span
            style={{
              position: "relative",
              zIndex: 10,
              color: hovered ? "#00A37D" : "white",
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
