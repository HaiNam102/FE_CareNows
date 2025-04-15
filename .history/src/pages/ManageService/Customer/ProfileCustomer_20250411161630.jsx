import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, PenSquare, Building, User, Calendar, SquarePen } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import axios from 'axios';

const ProfileCustomer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    avatar: null,
    gender: '',
    birthday: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    ward: '',
    joinDate: '',
    savedAddresses: []
  });

  const [editMode, setEditMode] = useState({
    birthday: false,
    gender: false,
    phone: false,
    email: false,
    address: false
  });

  const [editValues, setEditValues] = useState({
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const response = await axios.get('http://localhost:8080/api/customer/getByCustomerId', {
          headers: {
            'Authorization': authToken
          }
        });

        if (response.status === 200 && response.data.data) {
          const customerData = response.data.data;
          setUserData(prevData => ({
            ...prevData,
            name: customerData.nameOfCustomer || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            district: customerData.district || '',
            ward: customerData.ward || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`,
            joinDate: new Date().toLocaleDateString('vi-VN'),
            savedAddresses: [
              {
                id: 1,
                name: customerData.ward || '',
                detail: `${customerData.ward || ''}, ${customerData.district || ''}`
              }
            ]
          }));

          setEditValues({
            birthday: customerData.birthday || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`
          });
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Không thể tải thông tin. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        window.location.href = '/login';
        return;
      }

      // Chuẩn bị dữ liệu theo đúng format CustomerReq
      const updateData = {
        nameOfCustomer: userData.name,
        gender: field === 'gender' ? editValues.gender : userData.gender,
        birthday: field === 'birthday' ? editValues.birthday : userData.birthday,
        phoneNumber: field === 'phone' ? editValues.phone : userData.phone,
        email: field === 'email' ? editValues.email : userData.email,
        ward: field === 'address' ? editValues.address.split(', ')[0] : userData.ward,
        district: field === 'address' ? editValues.address.split(', ')[1] : userData.district
      };

      // Gửi request với token trong header
      const response = await axios.put('http://localhost:8080/api/customer', updateData, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Xử lý response từ server
      if (response.data.code === 200) {
        // Cập nhật state với dữ liệu mới
        const updatedUserData = {
          ...userData,
          [field]: editValues[field]
        };

        // Cập nhật thêm cho trường hợp địa chỉ
        if (field === 'address') {
          const [ward, district] = editValues.address.split(', ');
          updatedUserData.ward = ward;
          updatedUserData.district = district;
          updatedUserData.address = editValues.address;
        }

        setUserData(updatedUserData);
        setEditMode(prev => ({ ...prev, [field]: false }));
        setError(null);
        alert('Cập nhật thông tin thành công!');

        // Refresh dữ liệu từ server
        const refreshResponse = await axios.get('http://localhost:8080/api/customer/getByCustomerId', {
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
          }
        });

        if (refreshResponse.data.code === 200 && refreshResponse.data.data) {
          const customerData = refreshResponse.data.data;
          setUserData(prevData => ({
            ...prevData,
            name: customerData.nameOfCustomer || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            birthday: customerData.birthday || '',
            district: customerData.district || '',
            ward: customerData.ward || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`,
          }));

          setEditValues(prev => ({
            ...prev,
            birthday: customerData.birthday || '',
            gender: customerData.gender || '',
            phone: customerData.phoneNumber || '',
            email: customerData.email || '',
            address: `${customerData.ward || ''}, ${customerData.district || ''}`
          }));
        }
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      
      // Xử lý lỗi 401 - Unauthorized
      if (error.response && error.response.status === 401) {
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        alert(errorMessage);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        // Xử lý các lỗi khác
        const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thất bại';
        setError(errorMessage);
        alert('Cập nhật thất bại: ' + errorMessage);
      }
    }
  };

  return (
    <MainLayout>
      {/* Render your component content here */}
    </MainLayout>
  );
};

export default ProfileCustomer;