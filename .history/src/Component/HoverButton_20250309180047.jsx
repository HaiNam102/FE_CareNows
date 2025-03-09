import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowSize: "32px", arrowFontSize: "20px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "32px", arrowSize: "44px", arrowFontSize: "24px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowSize: "52px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: hovered && showArrow ? "10px" : "2px", transition: "gap 2s ease-in-out" }}
    >
      <button
        style={{
          position: "relative",
          padding,
          fontSize,
          fontWeight: 500,
          fontFamily: "SVN-Gilroy, sans-serif",
          transition: "all 2s ease-in-out",
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
            transition: "transform 2s ease-in-out",
            transform: hovered ? "translateY(-100%)" : "translateY(0)",
          }}
        ></span>
        <span
          style={{
            position: "relative",
            zIndex: 10,
            transition: "opacity 2s ease-in-out",
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
            height: arrowSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            border: "1.5px solid #00A37D",
            backgroundColor: hovered ? "transparent" : "#00A37D",
            transition: "all 2s ease-in-out",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#00A37D",
              transition: "transform 2s ease-in-out",
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