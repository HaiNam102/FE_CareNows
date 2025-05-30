import React, { useState } from "react";

const sizes = {
  small: { padding: "0px 16px", fontSize: "14px", height: "36px", arrowSize: "32px", arrowFontSize: "20px" },
  medium: { padding: "0px 24px", fontSize: "18px", height: "48px", arrowSize: "45px", arrowFontSize: "24px" },
  large: { padding: "0px 32px", fontSize: "20px", height: "56px", arrowSize: "52px", arrowFontSize: "28px" }
  
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: hovered && showArrow ? "10px" : "2px", transition: "gap 0.4s ease-in-out", alignItems: "center", justifyContent: "center",height:"100vh" }}
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
            transition: "all 0.3s ease-in-out",
            padding: "0px 4px", 
          }}
        >
          <span
            style={{
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
