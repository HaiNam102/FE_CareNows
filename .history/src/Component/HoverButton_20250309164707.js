import React, { useState } from "react";

const HoverButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "12px 24px",
        fontSize: "18px",
        fontWeight: "bold",
        transition: "all 0.4s ease-in-out",
        overflow: "hidden",
        borderRadius: "8px",
        border: "2px solid #00a884",
        backgroundColor: hovered ? "transparent" : "#00a884",
        color: hovered ? "#00a884" : "white",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#00a884",
          transition: "transform 0.4s ease-in-out",
          transform: hovered ? "translateY(-100%)" : "translateY(0)",
        }}
      ></span>
      <span
        style={{
          position: "relative",
          zIndex: 10,
          transition: "opacity 0.4s ease-in-out",
          opacity: 1,
          color: "#00a884",
        }}
      >
        Đăng ký ngay
      </span>
    </button>
  );
};

export default HoverButton;
