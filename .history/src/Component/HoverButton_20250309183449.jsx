import React, { useState } from "react";

const sizes = {
  small: { padding: "8px 16px", fontSize: "12px", height: "36px", arrowFontSize: "14px" },
  medium: { padding: "12px 24px", fontSize: "16px", height: "44px", arrowFontSize: "18px" },
  large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowFontSize: "22px" }
};

const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
  const [hovered, setHovered] = useState(false);
  const { padding, fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  
  // Shared styles for both text and arrow container
  const containerStyle = {
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
    color: hovered ? "#fff" : "#333",
    transition: "color 1.5s ease-in-out"
  };
  
  // Shared styles for overlay
  const overlayStyle = {
    position: "absolute", 
    bottom: hovered ? "0" : "-100%", 
    left: "0", 
    width: "100%", 
    height: "100%", 
    backgroundColor: "#3498db", 
    transition: "bottom 1.5s ease-in-out",
    zIndex: "1"
  };
  
  // Shared styles for content
  const contentStyle = {
    position: "relative",
    zIndex: "2"
  };
  
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: hovered && showArrow ? "20px" : "5px", // Larger gap change to see clearly
        transition: "gap 1.5s ease-in-out",
        padding,
        fontSize,
        height,
        background: "transparent",
        border: "1px solid #333",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      {/* Text container with overlay */}
      <span style={containerStyle}>
        <span style={contentStyle}>
          {text}
        </span>
        <div style={overlayStyle} />
      </span>
      
      {/* Arrow container with overlay - identical to text */}
      {showArrow && (
        <span style={{...containerStyle, fontSize: arrowFontSize}}>
          <span style={contentStyle}>
            →
          </span>
          <div style={overlayStyle} />
        </span>
      )}
    </button>
  );
};

export default HoverButton;