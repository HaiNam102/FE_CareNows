import React, { useState } from "react";

const HoverButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative px-6 py-3 text-lg font-semibold transition-all duration-300 overflow-hidden border-2 rounded-lg 
        ${hovered ? "border-green-600 text-green-600 bg-transparent" : "bg-green-600 text-white border-green-600"}`}
    >
      <span
        className={`absolute inset-0 bg-green-600 transition-transform duration-300 ${hovered ? "translate-y-full" : "translate-y-0"}`}
      ></span>
      <span className={`relative z-10 transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
        Đăng ký ngay
      </span>
    </button>
  );
};

export default HoverButton;