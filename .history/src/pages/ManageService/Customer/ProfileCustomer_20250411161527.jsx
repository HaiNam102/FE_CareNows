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

      const