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
              onClick={() => navigate('/')}style={{ cursor: 'pointer' }}
              />
              
              <nav className="hidden md:flex items-center ml-10 space-x-10">
                {["Trang chủ", "Lịch của tôi", "Về CareNow"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className={`text-[16px] font-medium font-['SVN-Gilroy'] ${
                      activeLink === link
                        ? "text-[#006B52] border-b-2 border-[#006B52] pb-2"
                        : "text-black"
                    }`}
                    onClick={() => setActiveLink(link)}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
            
            {isMobile && (
              <button className="md:hidden p-2 z-20" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                <div className="w-6 h-0.5 bg-black"></div>
              </button>
            )}
          </div>
  
          {/* Mobile menu */}
          <div className={`md:hidden fixed top-0 left-0 h-screen bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-20 p-6 pt-20 ${
            isMenuOpen && isMobile ? "translate-x-0" : "-translate-x-full"
          }`}>
            <nav className="flex flex-col items-start space-y-6 w-full">
              {["Trang chủ", "Lịch của tôi", "Về CareNow"].map((link) => (
                <div key={link} className="flex flex-col items-start">
                  <a
                    href="#"
                    className={`text-[16px] font-medium font-['SVN-Gilroy'] ${
                      activeLink === link
                        ? "text-[#006B52]"
                        : "text-black"
                    }`}
                    onClick={() => {
                      setActiveLink(link);
                      setIsMenuOpen(false);
                    }}
                  >
                    {link}
                  </a>
                  {activeLink === link && (
                    <div className="w-20 h-0.5 bg-[#006B52] mt-1"></div>
                  )}
                </div>
              ))}
            </nav>
            
            <div className="flex flex-col items-start space-y-6 mt-10 w-full">
              <a href="#" className="text-[16px] font-medium font-['SVN-Gilroy']" onClick={() => {
                navigate("/login");
              }}>
                Đăng nhập
              </a>
              <div>
                <HoverButton text="Đăng ký ngay" size="medium" showArrow={true} />
              </div>
            </div>
          </div>
  
          {/* Overlay when menu is open */}
          {isMenuOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-0"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
  
          {/* Desktop buttons/avatar */}
{/* Desktop buttons/avatar */}
<div className="hidden md:flex md:items-center md:space-x-6">
          {isLoggedIn ? (
            <div className="relative group">
              <button className={`w-10 h-10 rounded-full ${userInfo?.avatarColor} 
                text-white font-semibold flex items-center justify-center
                cursor-pointer hover:opacity-90 transition-opacity`}>
                {userInfo?.initial}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-300">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Thông tin cá nhân
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Cài đặt
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <a href="#" className="text-[16px] font-medium font-['SVN-Gilroy']" 
                onClick={() => navigate("/login")}>
                Đăng nhập
              </a>
              <div className="flex-shrink-0 min-w-[180px]">
                <HoverButton text="Đăng ký ngay" size="medium" showArrow={true} />
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;