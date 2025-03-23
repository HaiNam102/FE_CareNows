import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "14px", height: "36px", arrowSize: "32px", arrowFontSize: "20px" },
  medium: { padding: "12px 24px", fontSize: "18px", height: "48px", arrowSize: "44px", arrowFontSize: "24px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowSize: "52px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: hovered && showArrow ? "10px" : "2px", transition: "gap 0.4s ease-in-out" }}
    >
      <button
        style={{
          position: "relative",
          padding,
          fontSize,
          fontWeight: "bold",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          borderRadius: "4px",
          border: "2px solid #00a884",
          backgroundColor: hovered ? "transparent" : "#00a884",
          color: hovered ? "#00a884" : "white",
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
            backgroundColor: "#00a884",
            transition: "transform 0.3s ease-in-out",
            transform: hovered ? "translateY(-100%)" : "translateY(0)",
          }}
        ></span>
        <span
          style={{
            position: "relative",
            zIndex: 10,
            transition: "opacity 0.3s ease-in-out",
            opacity: 1,
            color: hovered ? "#00a884" : "white",
          }}
        >
          {text}
        </span>
      </button>
      {showArrow && (
        <div
          style={{
            width: arrowSize,
            height: arrowSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            border: "1px solid #00A37D",
            backgroundColor: hovered ? "transparent" : "#00a884",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <span
            style={{
              color: hovered ? "#00a884" : "white",
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
