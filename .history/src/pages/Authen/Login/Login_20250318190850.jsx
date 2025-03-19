import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
// Import the background image
import loginBg from "../../../assets/images/HeroLogin.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getRole } from '../../../utils/auth';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auths/login', {
        username: formData.username,
        password: formData.password
      });

      if (response.data && response.data.token) {
        // Lưu token
        localStorage.setItem('token', response.data.token);
        
        // Giải mã token để lấy role
        const decoded = jwt_decode(response.data.token);
        const role = decoded.role;

        toast.success('Đăng nhập thành công!');
        
        // Điều hướng dựa trên role
        setTimeout(() => {
          switch (role) {
            case 'CARE_TAKER':
              navigate('/caretaker/home');
              break;
            case 'CUSTOMER':
              navigate('/customer/home');
              break;
            case 'ADMIN':
              navigate('/admin/home');
              break;
            default:
              navigate('/');
              break;
          }
        }, 1000);
      }
    } catch (error) {
      // Xử lý các loại lỗi
      if (error.response) {
        switch (error.response.data.code) {
          case 40001:
            toast.error('Tên đăng nhập không tồn tại');
            break;
          case 40002:
            toast.error('Mật khẩu không chính xác');
            break;
          case 40003:
            toast.error('Tài khoản không hợp lệ');
            break;
          case 40004:
            toast.error('Quyền truy cập không hợp lệ');
            break;
          default:
            toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
        }
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="w-full md:flex md:flex-row rounded-lg overflow-hidden shadow-lg bg-white">
          {/* Form Column - Container for both form and image on mobile */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-6 md:px-8 bg-white">
            <div className="w-full max-w-md">
              {/* Google Sign In Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded flex items-center justify-center text-sm md:text-base mb-6">
                <span className="mr-2 text-lg"><FcGoogle /></span> Đăng nhập bằng Google
              </button>
              
              {/* Divider */}
              <div className="relatilave flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600 text-sm md:text-base">hoặc</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-left w-full mb-1 text-sm md:text-base">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded mt-1 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-left w-full mb-1 text-sm md:text-base">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded mt-1 text-sm md:text-base"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 md:py-3 px-4 rounded font-medium text-sm md:text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              {/* Thêm phần đăng ký */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm md:text-base">
                  Chưa có tài khoản? {" "}
                  <span 
                    onClick={() => navigate('/signup')} 
                    className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium"
                  >
                    Đăng ký ngay
                  </span>
                </p>
              </div>
              
              {/* Image displayed below the form on mobile, hidden on desktop */}
              <div 
                className="w-full h-48 bg-cover bg-center bg-no-repeat mt-8 md:hidden" 
                style={{ backgroundImage: `url(${loginBg})` }}
              ></div>
            </div>
          </div>
          
          {/* Image Column - Hidden on mobile, visible on desktop */}
          <div 
            className="hidden md:block md:w-1/2 md:min-h-[600px] bg-cover bg-center" 
            style={{ backgroundImage: `url(${loginBg})` }}
          >
            {/* The image is set as a background - only shown on desktop */}
          </div>
        </div>
      </div>
     
      <ToastContainer />
    </div>
  );
};

export default Login;