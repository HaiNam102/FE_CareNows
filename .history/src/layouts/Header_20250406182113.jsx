import React, { useState, useEffect } from "react";
import logo from "../assets/images/Logo.png";
import HoverButton from "../components/HoverButton";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Header({ logoOnly = false }) {
  const [activeLink, setActiveLink] = useState("Trang chủ");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Random avatar color
  const getRandomColor = () => {
    const colors = [
      'bg-teal-500', 'bg-blue-500', 'bg-emerald-500', 
      'bg-indigo-500', 'bg-purple-500', 'bg-rose-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserInfo({
          name: decoded.sub || 'User',
          avatarColor: getRandomColor(),
          initial: (decoded.sub || 'U')[0].toUpperCase()
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/');
  };

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (logoOnly) {
    return (
      <div className="w-full">
        <header className="max-w-[1200px] mx-auto">
          <div className="flex justify-center pt-[42px]">
            <img 
              src={logo} 
              alt="CareNow logo" 
              className="h-[35px] w-[180px] object-contain" 
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[40px] bg-white/[0.95] border-b border-teal-500">
      <header className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between py-4">
        {/* Logo và navigation desktop */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="CareNow logo" 
              className="h-[35px] w-[180px] object-contain" 
              onClick={() => navigate('/')}