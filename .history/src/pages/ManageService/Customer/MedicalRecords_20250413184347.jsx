import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Sidebar from '../../../layouts/Sidebar';
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

  const ChevronLeftIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="rotate-180"
    >
      <path 
        d="M15 19L8 12L15 5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <MainLayout>
      <div className="flex">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col w-[816px] items-end gap-5 ml-[23px]">
          <HoverButtonOutline 
            text="Thêm hồ sơ người bệnh" 
            variant="primary"
            size="medium"
          />

          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4 w-full">{error}</div>
          ) : (
            careRecipients.map((recipient) => (
              <div key={recipient.careRecipientId} className="rounded-xl border bg-card text-card-foreground shadow w-full">
                <div className="flex items-center justify-between p-5">
                  {/* Patient Profile */}
                  <div className="flex w-[200px] items-center gap-[42px] pl-1 pr-0 py-0 self-stretch">
                    <div className="flex flex-col w-[158px] items-center gap-3">
                      <div className="w-[139px] h-[139px] rounded-full overflow-hidden">
                        <img 
                          className="w-full h-full object-cover"
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.careRecipientId}`}
                          alt={recipient.name || 'Patient avatar'}
                        />
                      </div>
                      <div className="font-['SVN-Gilroy-Medium',Helvetica] font-medium text-black text-base text-center whitespace-nowrap">
                        {recipient.name || 'Bé hải Lmeo'}
                      </div>
                      <div className="w-full font-['SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-base">
                        {recipient.email || 'haimeo12@gmail.com'}
                      </div>
                    </div>
                    <div className="h-[427px] border-r border-gray-200" />
                  </div>

                  {/* Patient Details */}
                  <div className="flex flex-col w-[496px] items-end gap-4">
                    {[
                      { label: "Tên", value: recipient.name || "Bé hải Lmeo" },
                      { label: "Giới tính", value: recipient.gender === 'FEMALE' ? 'Nữ' : 'Nam' },
                      { label: "Số điện thoại", value: "0899229928" },
                      { label: "Ngày sinh", value: "22/11/2003" },
                      { label: "Ghi chú đặt biệt", value: recipient.specialDetail || "Trẻ bị tự kỷ" }
                    ].map((field, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-start gap-1 px-3 py-4 w-full rounded border-[0.5px] border-[#c6c6c6]"
                      >
                        <div className="flex w-full items-start justify-between">
                          <div className="font-['SVN-Gilroy-Medium',Helvetica] font-medium text-black text-base text-center whitespace-nowrap">
                            {field.label}
                          </div>
                          <ChevronLeftIcon />
                        </div>
                        <div className="w-full font-['SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-base">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalRecords; 