import React, { useState } from "react";

const HoverButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: hovered ? "8px" : "2px", transition: "gap 0.3s ease-in-out" }}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: "bold",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          borderRadius: "4px",
          border: "2px solid #00a884",
          backgroundColor: hovered ? "transparent" : "#00a884",
          color: hovered ? "#00a884" : "white",
          cursor: "pointer",
          height: "48px",
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
          Đăng ký ngay
        </span>
      </button>
      <div
        style={{
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          border: "2px solid #00a884",
          backgroundColor: hovered ? "transparent" : "#00a884",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <span
          style={{
            color: hovered ? "#00a884" : "white",
            fontSize: "24px",
            transition: "color 0.3s ease-in-out",
          }}
        >
          →
        </span>
      </div>
    </div>
  );
};

export default HoverButton;
