import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import CustomerSidebar from '../../../components/CustomerSidebar';
import HoverButtonOutline from "../../../components/HoverButtonOutline";
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const MedicalRecords = () => {
  const [careRecipients, setCareRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="flex">
        {/* Left side - Fixed position */}
        <div className="w-[280px] flex-shrink-0 pt-8">
          <div className="w-[285px]">
            <div>
              <h2 className="text-[40px] leading-none font-semibold font-['SVN-Gilroy'] mb-3">
                Xin chào Tan!
              </h2>
              <div className="h-[1px] bg-gray-200 w-full"></div>
            </div>
            <CustomerSidebar />
          </div>
        </div>

        {/* Right side - Scrollable content */}
        <div className="flex-1">
          <div className="w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Danh sách hồ sơ người bệnh</h2>
                <HoverButtonOutline 
                  text="Thêm hồ sơ người bệnh" 
                  variant="primary"
                  size="medium"
                  showArrow={true}
                />
              </div>

              {/* Medical Records List */}
              <div className="space-y-4 mb-[400px]">
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
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalRecords; 