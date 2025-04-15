import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import HoverButton from "../components/HoverButton";
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
    <header className="fixed top-0 right-0 left-[393px] h-[123px] bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-[35px] w-[180px] object-contain" />
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link to="/search" className="text-gray-600 hover:text-gray-900 font-['SVN-Gilroy']">
              Tìm kiếm bảo mẫu
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-gray-900 font-['SVN-Gilroy']">
              Hồ sơ và dịch vụ
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-['SVN-Gilroy']">
              Về CareNows
            </Link>
          </nav>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="https://i.pravatar.cc/300" 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;