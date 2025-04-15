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

const HoverButton = ({ text, showArrow = true, size = "medium", variant = "primary", onClick, className, isNested = false }) => {
  const [hovered, setHovered] = useState(false);
  const { fontSize, height, arrowFontSize } = sizes[size] || sizes.medium;
  const { borderColor, backgroundColor, textColor, hoverTextColor } = variants[variant] || variants.primary;

  const getVariant = () => {
    if (variant === "primary") return "border-primary-500 bg-primary-500 text-white";
    if (variant === "secondary") return "border-secondary-500 bg-secondary-500 text-white";
    return "border-primary-500 bg-primary-500 text-white";
  };

  const getSize = () => {
    if (size === "small") return "py-1 px-3 text-xs";
    if (size === "large") return "py-3 px-6 text-lg";
    return "py-2 px-4 text-base";
  };

  const ButtonContent = () => (
    <>
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
    </>
  );

  const commonProps = {
    "data-animation-type": hovered ? 'hover' : 'none',
    "data-hover-text": hoverTextColor,
    className: `${className} ${getVariant()} ${getSize()} md:duration-300 relative overflow-hidden group`,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        transition: "none",
        flexShrink: 0,
      }}
    >
      {isNested ? (
        <div {...commonProps}>
          <ButtonContent />
        </div>
      ) : (
        <button {...commonProps}>
          <ButtonContent />
        </button>
      )}

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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
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
