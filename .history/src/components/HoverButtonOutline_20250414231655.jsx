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
  iconType = "arrow", // "arrow", "plus", "add-circle", "animated-plus", "dots"
  size = "medium", 
  variant = "primary", 
  onClick, 
  className 
}) => {
  const [hovered, setHovered] = useState(false);
  const { fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  const { borderColor, backgroundColor, textColor, hoverTextColor } = variants[variant] || variants.primary;

  // Determine which icon to show based on type and hover state
  const getIcon = () => {
    switch (iconType) {
      case "plus":
        return "+";
      case "add-circle":
        return hovered ? "+" : "○";
      case "dots":
        return hovered ? "+" : "•••";
      case "arrow":
      default:
        return "→";
    }
  };

  // Determine if icon should rotate based on type and hover state
  const shouldRotate = () => {
    if (iconType === "plus") {
      return false; // No rotation for plus anymore
    }
    return false;
  };

  // Render special animated plus icon
  const renderAnimatedPlus = () => {
    return (
      <div style={{ position: "relative", width: "20px", height: "20px" }}>
        {/* Circle */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: `2px solid ${hovered ? hoverTextColor : textColor}`,
            transition: "all 0.4s ease-in-out",
            transform: hovered ? "scale(0.6)" : "scale(1)",
            opacity: hovered ? 0.5 : 1
          }}
        />
        
        {/* Horizontal line - grows from center */}
        <div
          style={{
            position: "absolute",
            top: "9px",
            left: hovered ? "2px" : "10px",
            width: hovered ? "16px" : "0", 
            height: "2px",
            backgroundColor: hovered ? hoverTextColor : textColor,
            transition: "all 0.3s ease-in-out"
          }}
        />
        
        {/* Vertical line - grows from center */}
        <div
          style={{
            position: "absolute",
            top: hovered ? "2px" : "10px",
            left: "9px",
            width: "2px",
            height: hovered ? "16px" : "0",
            backgroundColor: hovered ? hoverTextColor : textColor,
            transition: "all 0.3s ease-in-out"
          }}
        />
      </div>
    );
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

          {iconType === "animated-plus" ? (
            renderAnimatedPlus()
          ) : (
            <span
              style={{
                position: "relative",
                zIndex: 10,
                color: hovered ? hoverTextColor : textColor,
                fontSize: arrowFontSize,
                fontWeight: "bold",
                transition: "all 0.4s ease-in-out",
                transform: shouldRotate() ? "rotate(45deg)" : "rotate(0deg)",
                display: "inline-block"
              }}
            >
              {getIcon()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverButtonOutline; 