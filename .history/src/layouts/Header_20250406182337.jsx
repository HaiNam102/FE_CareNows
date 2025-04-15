style={{ cursor: 'pointer' }}
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

        {/* Desktop buttons/avatar */}style={{ cursor: 'pointer' }}
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