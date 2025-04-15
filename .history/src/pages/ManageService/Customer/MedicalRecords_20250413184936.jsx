import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import HoverButtonOutline from "../../../components/HoverButtonOutline";
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const MedicalRecords = () => {
  const [careRecipients, setCareRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = "Tan";

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

  const ChevronRightIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M9 5l7 7-7 7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

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
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <div className="fixed ml-[141px] w-[285px]">
          {/* Welcome message with divider */}
          <div>
            <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">Xin chào {userName}!</h2>
            <div className="h-[1px] bg-gray-200 w-full"></div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-4">
            <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/profile">
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span className="font-['SVN-Gilroy']">Hồ sơ cá nhân</span>
            </a>
            <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/booking-history">
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span className="font-['SVN-Gilroy']">Lịch chăm sóc đã đặt</span>
            </a>
            <a className="flex items-center h-[40px] px-4 relative text-[rgb(0,107,82)] bg-[rgb(0,107,82)]/10 border-l-4 border-[rgb(0,107,82)]" href="/customer/medical-records">
              <span className="mr-3 ml-[-2px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
              </span>
              <span className="font-['SVN-Gilroy']">Quản lý hồ sơ người bệnh</span>
            </a>
            <a className="flex items-center h-[40px] px-4 relative text-gray-600 hover:bg-gray-50" href="/customer/medical-records-list">
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
              </span>
              <span className="font-['SVN-Gilroy']">Quản lý hồ sơ bệnh nhân</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-[450px] flex-1 pr-[141px]">
          {/* Header with Add Button */}
          <div className="flex justify-end mb-6 pt-8">
            <HoverButtonOutline 
              text="Thêm hồ sơ người bệnh" 
              variant="primary"
              size="medium"
              showArrow={true}
            />
          </div>

          {/* Medical Records List */}
          <div className="space-y-4">
            {careRecipients.map((recipient) => (
              <div key={recipient.careRecipientId} className="bg-white rounded-[8px] shadow-sm p-6">
                <div className="flex items-start">
                  {/* Left side - Profile Info */}
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

                  {/* Vertical Divider */}
                  <div className="w-px h-[427px] bg-gray-200 mx-6"></div>

                  {/* Right side - Patient Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      {[
                        { label: "Tên", value: recipient.name || "Be Minh" },
                        { label: "Giới tính", value: recipient.gender === 'FEMALE' ? 'Nữ' : 'Nam' },
                        { label: "Số điện thoại", value: "0899229928" },
                        { label: "Ngày sinh", value: "22/11/2003" },
                        { label: "Ghi chú đặt biệt", value: recipient.specialDetail || "Allergic to peanuts" }
                      ].map((field, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-1 px-3 py-4 rounded border border-[#c6c6c6] hover:border-[#00A37D] cursor-pointer transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-black">
                              {field.label}
                            </div>
                            <ChevronRightIcon />
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
    </MainLayout>
  );
};

export default MedicalRecords; 