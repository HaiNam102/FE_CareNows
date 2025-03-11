import React from "react";
import { FaEnvelope } from "react-icons/fa";
import logo from "../assets/images/Logo.png"; // Import logo

const Footer = () => {
  return (
    <footer className="bg-[#04332B] text-white py-16 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto flex flex-col start">
        {/* Logo */}
        <div className="mb-10">
          <img src={logo} alt="CareNow Logo" className="h-16 w-auto" />
        </div>

        {/* Content Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0">
          {/* Subscription */}
          <div className="w-full md:w-1/3">
            <p className="text-gray-300">Đăng ký để nhận những thông tin mới</p>
            <div className="mt-4 flex items-center border border-gray-400 rounded-lg overflow-hidden w-full max-w-md">
              <input
                type="email"
                placeholder="Nhập địa chỉ Email"
                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-gray-400"
              />
              <button className="bg-white text-black  rounded-lg px-4 py-3">
                <FaEnvelope />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="w-full md:w-1/4">
            <ul className="space-y-2 text-gray-200">
               <li><a href="#" className="hover:text-white">Service</a></li>
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-3">Contact us</h3>
            <p className="text-gray-300">NannynowComp@gmail.com</p>
            <p className="text-gray-300">+84899229928</p>
            <p className="text-gray-300">150 Ton Duc Thang, Hoa Minh, Lien Chieu</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
