import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SignUpCareTaker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    experienceYear: '',
    gender: '',
    dob: '',
    imgProfile: null,
    imgCccd: null,
    selectedOptionDetailIds: []
  });
  const [acceptTraining, setAcceptTraining] = useState(false);
  const [acceptTest, setAcceptTest] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.username || !formData.email || 
          !formData.phone || !formData.password || !formData.experienceYear ||
          !formData.gender || !formData.dob) {
        toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      if (!formData.imgProfile || !formData.imgCccd) {
        toast.error('Vui lòng tải lên ảnh đại diện và CCCD!');
        return;
      }

      if (!acceptTraining || !acceptTest) {
        toast.error('Vui lòng đồng ý với điều khoản khóa học!');
        return;
      }

      const registerDTO = {
        userName: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phone,
        nameOfUser: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        city: "Đà Nẵng",
        roleName: "CARETAKER",
        experienceYear: parseInt(formData.experienceYear),
        selectedOptionDetailIds: formData.selectedOptionDetailIds
      };

      const formDataToSend = new FormData();
      
      formDataToSend.append('registerDTO', 
        new Blob([JSON.stringify(registerDTO)], { type: 'application/json' })
      );

      formDataToSend.append('imgProfile', formData.imgProfile);
      formDataToSend.append('imgCccd', formData.imgCccd);

      const response = await axios.post(
        'http://localhost:8080/api/auths/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.code === 20000) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message || 'Đăng ký thất bại');
      }

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.code) {
        // Xử lý các mã lỗi cụ thể từ backend
        switch (error.response.data.code) {
          case 40001:
            toast.error('Tên đăng nhập đã tồn tại');
            break;
          case 40002:
            toast.error('Email đã được sử dụng');
            break;
          default:
            toast.error(error.response.data.message || 'Có lỗi xảy ra khi đăng ký');
        }
      } else {
        toast.error('Không thể kết nối đến server');
      }
    }
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default SignUpCareTaker; 