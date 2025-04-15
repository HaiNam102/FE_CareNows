import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const MedicalRecords = () => {
  const [careRecipients, setCareRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = "Tan"; // This should come from your auth context or user data

  useEffect(() => {
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

    fetchCareRecipients();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-[280px] flex-shrink-0 pt-8">
            <div className="w-[285px]">
              <div>
                <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào {userName}!</h2>
                <div className="h-[1px] bg-gray-200 w-full"></div>
              </div>
              <nav className="mt-4">
                <a href="/customer/profile" className="flex items-center h-[40px] px-4 text-gray-600 hover:bg-gray-50">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
                </a>
                <a href="/customer/booking-history" className="flex items-center h-[40px] px-4 text-gray-600 hover:bg-gray-50">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
                </a>
                <a href="/customer/medical-records" className="flex items-center h-[40px] px-4 relative text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]">
                  <span className="mr-3 ml-[-2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Quản lý hồ sơ người bệnh</span>
                </a>
                <a href="/customer/medical-records-list" className="flex items-center h-[40px] px-4 text-gray-600 hover:bg-gray-50">
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
                  </span>
                  <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-8 pt-8">
            {/* Add Profile Button */}
            <div className="flex justify-end mb-6">
              <button className="flex items-center gap-2 text-[#00A86B] border border-[#00A86B] rounded-lg px-4 py-2 hover:bg-[#00A86B] hover:text-white transition-colors">
                <span>Thêm hồ sơ người bệnh</span>
                <span className="text-xl">+</span>
              </button>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-lg p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : (
                <div className="space-y-6">
                  {careRecipients.map((recipient) => (
                    <div key={recipient.careRecipientId} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                            <div>
                              <h3 className="text-lg font-medium">{recipient.name}</h3>
                              <p className="text-gray-500">{recipient.email || 'homeo02@gmail.com'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-500">Tên</span>
                              <span className="text-gray-900">{recipient.name}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-500">Giới tính</span>
                              <span className="text-gray-900">{recipient.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-500">Số điện thoại</span>
                              <span className="text-gray-900">0899229928</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-500">Ngày sinh</span>
                              <span className="text-gray-900">22. 11. 2003</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Ghi chú đặt biệt</span>
                              <span className="text-gray-900">{recipient.specialDetail || 'Trẻ bị tự kỷ'}</span>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords; 