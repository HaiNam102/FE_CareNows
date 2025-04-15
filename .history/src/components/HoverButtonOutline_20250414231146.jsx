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
    textColor: "#00A37D",
    hoverTextColor: "white"
  },
  secondary: {
    borderColor: "#7F798F",
    backgroundColor: "#7F798F",
    textColor: "#7F798F",
    hoverTextColor: "white"
  }
};

const HoverButtonOutline = ({ 
  text, 
  showArrow = true, 
  iconType = "arrow", // "arrow" or "plus"
  size = "medium", 
  variant = "primary", 
  onClick, 
  className 
}) => {
  const [hovered, setHovered] = useState(false);
  const { fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  const { borderColor, backgroundColor, textColor, hoverTextColor } = variants[variant] || variants.primary;

  // Determine which icon to show
  const getIcon = () => {
    switch (iconType) {
      case "plus":
        return "+";
      case "arrow":
      default:
        return "→";
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: hovered ? "8px" : "2px", // Gap increases when hovered
        transition: "all 0.3s ease-in-out",
        flexShrink: 0,
      }}
    >
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
          backgroundColor: "transparent",
          color: hovered ? hoverTextColor : textColor,
          cursor: "pointer",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        className={`${className}`}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: backgroundColor,
            transition: "transform 0.3s ease-in-out",
            transform: hovered ? "translateY(0)" : "translateY(-100%)", // Slide down from top
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

      {showArrow && (
        <div
          style={{
            width: height,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            border: `1.5px solid ${borderColor}`,
            backgroundColor: "transparent",
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: backgroundColor,
              transition: "transform 0.3s ease-in-out",
              transform: hovered ? "translateY(0)" : "translateY(-100%)", // Slide down from top
            }}
          ></span>

          <span
            style={{
              position: "relative",
              zIndex: 10,
              color: hovered ? hoverTextColor : textColor,
              fontSize: arrowFontSize,
              fontWeight: "bold",
              transition: "all 0.3s ease-in-out",
              transform: iconType === "plus" && hovered ? "rotate(45deg)" : "rotate(0deg)", // Rotate plus icon on hover
              display: "inline-block"
            }}
          >
            {getIcon()}
          </span>
        </div>
      )}
    </div>
  );
};

export default HoverButtonOutline; 