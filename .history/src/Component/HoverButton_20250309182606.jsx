import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowSize: "32px", arrowFontSize: "20px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "44px", arrowSize: "44px", arrowFontSize: "24px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowSize: "56px", arrowFontSize: "28px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;
  
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: hovered && showArrow ? "10px" : "2px", 
        transition: "gap 0.4s ease-in-out",
        padding,
        fontSize,
        height,
        background: "transparent",
        border: "1px solid #333",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      {/* Text container with its own overlay */}
      <span 
        style={{ 
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
          color: hovered ? "#fff" : "#333",
          transition: "color 10s ease-in-out"
        }}
      >
        <span style={{ position: "relative", zIndex: "2" }}>
          {text}
        </span>
        <div 
          style={{ 
            position: "absolute", 
            bottom: hovered ? "0" : "-100%", 
            left: "0", 
            width: "100%", 
            height: "100%", 
            backgroundColor: "#3498db", // Blue color overlay
            transition: "bottom 10s ease-in-out",
            zIndex: "1"
          }}
        />
      </span>
      
      {/* Arrow container with its own separate overlay */}
      {showArrow && (
        <span 
          style={{ 
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "auto",
            height: "100%",
            fontSize: arrowFontSize,
            color: hovered ? "#fff" : "#333",
            transition: "color 10s ease-in-out"
          }}
        >
          <span style={{ position: "relative", zIndex: "2" }}>
            →
          </span>
          <div 
            style={{ 
              position: "absolute", 
              bottom: hovered ? "0" : "-100%", 
              left: "0", 
              width: "100%", 
              height: "100%", 
              backgroundColor: "#3498db", // Blue color overlay
              transition: "bottom 10s ease-in-out",
              zIndex: "1"
            }}
          />
        </span>
      )}
    </button>
  );
};

export default HoverButton;