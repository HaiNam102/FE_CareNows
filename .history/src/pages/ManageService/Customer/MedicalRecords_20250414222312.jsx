import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import CustomerSidebar from '../../../components/CustomerSidebar';
import HoverButtonOutline from "../../../components/HoverButtonOutline";
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
        window.alert('Thêm hồ sơ thành công!');
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
              <textarea
                name="specialDetail"
                value={formData.specialDetail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                rows="3"
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
    name: recipient?.name || '',
    gender: recipient?.gender || 'MALE',
    yearOld: recipient?.yearOld || '',
    specialDetail: recipient?.specialDetail || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      if (response.data && response.data.code === 1011) {
        window.alert('Cập nhật thông tin thành công!');
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
              <textarea
                name="specialDetail"
                value={formData.specialDetail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                rows="3"
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Đang tải thông tin...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">Lỗi: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex">
        <div className="w-[280px] flex-shrink-0 pt-8">
          <CustomerSidebar />
        </div>

        <div className="flex-1 pl-12">
          <div className="w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Danh sách hồ sơ người bệnh</h2>
                <HoverButtonOutline 
                  text="Thêm hồ sơ người bệnh" 
                  variant="primary"
                  size="medium"
                  showArrow={false}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>

              <div className="space-y-4 mb-[400px]">
                {careRecipients.map((recipient) => (
                  <div key={recipient.careRecipientId} className="bg-white rounded-[8px] shadow-sm p-6">
                    <div className="flex items-start">
                      <div className="w-[200px] flex-shrink-0">
                        <div className="flex flex-col items-center">
                          <div className="w-[139px] h-[139px] rounded-full overflow-hidden">
                            <img 
                              className="w-full h-full object-cover"
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.careRecipientId}`}
                              alt={recipient.name || 'Patient avatar'}
                            />
                          </div>
                          <h3 className="mt-3 text-base font-medium text-center">
                            {recipient.name || 'Be Minh'}
                          </h3>
                          <p className="text-[#8c8c8c] text-base text-center">
                            {recipient.email || 'haimeo12@gmail.com'}
                          </p>
                        </div>
                      </div>

                      <div className="w-px h-[427px] bg-gray-200 mx-6"></div>

                      <div className="flex-1">
                        <div className="space-y-4">
                          {[
                            { label: "Tên", value: recipient.name || "Be Minh" },
                            { label: "Giới tính", value: recipient.gender === 'FEMALE' ? 'Nữ' : 'Nam' },
                            { label: "Tuổi", value: recipient.yearOld || "Tuổi chưa được cập nhật" },
                            { label: "Ghi chú đặt biệt", value: recipient.specialDetail || "Allergic to peanuts" }
                          ].map((field, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-1 px-3 py-4 rounded border border-[#c6c6c6] hover:border-[#00A37D] cursor-pointer transition-colors duration-200"
                              onClick={() => handleEditClick(recipient)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-black">
                                  {field.label}
                                </div>
                                <PenSquare size={16} className="text-gray-500 hover:text-[#00A37D]" />
                              </div>
                              <div className="text-[#8c8c8c]">
                                {field.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCareRecipientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCareRecipients}
      />

      <EditCareRecipientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecipient(null);
        }}
        onSuccess={fetchCareRecipients}
        recipient={selectedRecipient}
      />
    </MainLayout>
  );
};

export default MedicalRecords;