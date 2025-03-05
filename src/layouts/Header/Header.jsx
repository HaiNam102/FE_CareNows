import React from 'react';
import './App.css'; // Make sure to create an App.css file for styles

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-green">Care</span>
        <span className="logo-red">Now</span>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li>Trang chủ</li>
          <li>Lịch của tôi</li>
          <li>Về CareNow</li>
        </ul>
      </nav>
      <div className="auth">
        <span>Đăng nhập</span>
        <button className="register-button">Đăng ký ngay</button>
      </div>
    </header>
  );
};

export default Header;