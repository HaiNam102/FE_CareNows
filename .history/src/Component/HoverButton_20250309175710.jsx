import React, { useState } from "react";

  const sizes = {
    small: { padding: "8px 16px", fontSize: "14px", height: "36px", arrowSize: "36px", arrowFontSize: "20px" },
    medium: { padding: "12px 24px", fontSize: "18px", height: "44px", arrowSize: "44px", arrowFontSize: "24px" },
    large: { padding: "16px 32px", fontSize: "20px", height: "56px", arrowSize: "56px", arrowFontSize: "28px" }
  };
  
  const HoverButton = ({ text, showArrow = true, size = "medium" }) => {
    const [hovered, setHovered] = useState(false);
    const { padding, fontSize, height, arrowSize, arrowFontSize } = sizes[size] || sizes.medium;
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ display: "flex", alignItems: "center", gap: hovered && showArrow ? "8px" : "0px", transition: "gap 0.3s ease-in-out" }}
        >
          <button
            style={{
              position: "relative",
              padding,
              fontSize,
              fontWeight: 600,
              fontFamily: "SVN-Gilroy, sans-serif",
              transition: "all 0.4s ease-in-out",
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
          ></span>
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
                border: "2px solid #00a884",
                backgroundColor: hovered ? "transparent" : "#00a884",
                transition: "all 0.4s ease-in-out",
                position: "relative",
                overflow: "hidden"
              }}
            ></span>
            >
                →
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

export default HoverButton;