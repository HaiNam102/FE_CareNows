import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
// Import the background image
import loginBg from "../../assets/images/Login.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="w-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg bg-white">
          {/* Form Column */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-md px-4">
              {/* Google Sign In Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded flex items-center justify-center text-sm mb-6">
                <span className="mr-2"><FcGoogle /></span> Đăng nhập bằng google
              </button>
              
              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">hoặc</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-left w-full mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-left w-full mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-medium"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
          
          {/* Image Column */}
          <div 
            className="w-full md:w-1/2 min-h-[300px] md:min-h-[600px] bg-cover" 
            style={{ backgroundImage: `url(${loginBg})` }}
          >
            {/* The image is set as a background */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;