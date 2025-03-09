import React, { useState } from "react";
const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowSize: "30px", arrowFontSize: "20px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "44px", arrowSize: "41px", arrowFontSize: "24px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowSize: "54px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", justifyContent: "center", height:"100vh",alignItems: "center", gap: hovered && showArrow ? "10px" : "2px", transition: "gap 0.4s ease-in-out" }}
    >
      <button
        style={{
          position: "relative",
          padding,
          fontSize,
          fontWeight: 500,
          fontFamily: "SVN-Gilroy, sans-serif",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          borderRadius: "4px",
          border: "1.5px solid #00A37D",
          backgroundColor: hovered ? "transparent" : "#00A37D",
          color: hovered ? "#00A37D" : "white",
          cursor: "pointer",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#00A37D",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hovered ? "translateY(-100%)" : "translateY(0)",
          }}
        ></span>
        <span
          style={{
            position: "relative",
            zIndex: 10,
            transition: "opacity 0.4s ease-in-out",
            opacity: 1,
            color: hovered ? "#00A37D" : "white",
          }}
        >
          {text}
        </span>
      </button>
      {showArrow && (
        <div
          style={{
            width: arrowSize,
            height: height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            border: "1.5px solid #00A37D",
            backgroundColor: hovered ? "transparent" : "#00A37D",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#00A37D",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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