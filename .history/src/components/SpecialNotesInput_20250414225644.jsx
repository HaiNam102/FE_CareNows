import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import CustomerSidebar from '../../../components/CustomerSidebar';
import HoverButtonOutline from "../../../components/HoverButtonOutline";
import SpecialNotesInput from '../../../components/SpecialNotesInput'; // Import component mới
import { PenSquare, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const calculateAge = (birthDate) => {
  if (!birthDate) return '';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Modal component for adding new care recipient
const AddCareRecipientModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'MALE',
    yearOld: '',
    specialDetail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thay đổi từ component ghi chú đặc biệt
  const handleSpecialDetailChange = (value) => {
    setFormData(prev => ({
      ...prev,
      specialDetail: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/careRecipient/customer`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.code === 1011) {
        onClose();
        alert('Thêm hồ sơ thành công!');
        if (onSuccess) onSuccess();
        // Sử dụng callback thay vì reload
        // window.location.href = window.location.href;
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thêm hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Thêm hồ sơ người bệnh</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
              <input
                type="number"
                name="yearOld"
                value={formData.yearOld}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
                min="0"
                max="120"
                placeholder="Nhập tuổi"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
              <SpecialNotesInput
                value={formData.specialDetail}
                onChange={handleSpecialDetailChange}
                placeholder="Chọn hoặc nhập ghi chú về tình trạng bệnh nhân"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00A37D] text-white rounded-md hover:bg-[#008666] disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add EditCareRecipientModal component
const EditCareRecipientModal = ({ isOpen, onClose, onSuccess, recipient }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'MALE',
    yearOld: '',
    specialDetail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form data when recipient changes
  useEffect(() => {
    if (recipient) {
      setFormData({
        name: recipient.name || '',
        gender: recipient.gender || 'MALE',
        yearOld: recipient.yearOld || '',
        specialDetail: recipient.specialDetail || ''
      });
    }
  }, [recipient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thay đổi từ component ghi chú đặc biệt
  const handleSpecialDetailChange = (value) => {
    setFormData(prev => ({
      ...prev,
      specialDetail: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const careRecipientId = recipient.careRecipientId || recipient.care_recipient_id;
      
      const response = await axios.put(`${API_URL}/careRecipient/${careRecipientId}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Sửa phần này để xử lý chính xác response
      console.log("API Response:", response.data);
      
      // Thông báo thành công và đóng modal
      alert('Cập nhật thông tin thành công!');
      onClose();
      
      // Sử dụng callback function thay vì reload trực tiếp
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback nếu không có callback
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err) {
      console.error('Error updating care recipient:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Cập nhật hồ sơ người bệnh</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
              <input
                type="number"
                name="yearOld"
                value={formData.yearOld}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                required
                min="0"
                max="120"
                placeholder="Nhập tuổi"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
              <SpecialNotesInput
                value={formData.specialDetail}
                onChange={handleSpecialDetailChange}
                placeholder="Chọn hoặc nhập ghi chú về tình trạng bệnh nhân"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00A37D] text-white rounded-md hover:bg-[#008666] disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MedicalRecords = () => {
  const [careRecipients, setCareRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchCareRecipients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/careRecipient/customer`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data && response.data.data) {
        setCareRecipients(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching care recipients:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareRecipients();
  }, []);

  const handleEditClick = (recipient) => {
    setSelectedRecipient(recipient);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecipient(null);
  };

  if (loading && careRecipients.length