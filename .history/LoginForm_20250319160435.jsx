import React, { useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password }
      );

      if (response.data.jwt) {
        const token = response.data.jwt;
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // Xử lý navigation dựa trên role
        switch (userRole) {
          case "ROLE_ADMIN":
            toast.success("Đăng nhập thành công!");
            navigate("/AdminHome");
            break;
          case "ROLE_CARETAKER":
            toast.success("Đăng nhập thành công!");
            navigate("/CaretakerHome");
            break;
          case "ROLE_CUSTOMER":
            toast.success("Đăng nhập thành công!");
            navigate("/CustomerHome");
            break;
          default:
            toast.error("Không xác định được quyền truy cập!");
            localStorage.removeItem("token");
        }
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      {/* Render form here */}
    </div>
  );
};

export default LoginForm; 