import React, { useState, useEffect } from 'react';
import { ChevronRight, UserIcon, Clock, UserCog, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const menuItems = [
  { icon: UserIcon, label: "Hồ sơ cá nhân", path: "/customer/profile", active: false },
  { icon: Clock, label: "Lịch chăm sóc đã đặt", path: "/customer/booking-history", active: false },
  { icon: UserCog, label: "Quản lý hồ sơ người bệnh", path: "/customer/medical-records", active: true },
  { icon: LayoutDashboard, label: "Quản lý hồ sơ bệnh nhân", path: "/customer/medical-records-list", active: false },
];

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
    <div className="bg-gray-50 flex flex-row justify-center w-full">
      <div className="bg-gray-50 w-full max-w-[1440px] relative">
        {/* Header */}
        <header className="flex w-full h-24 items-center justify-between px-6 py-5 fixed top-0 left-0 right-0 z-10 bg-[#ffffffb2] border-b border-primaryblue-700 backdrop-blur-[111.93px]">
          <div className="flex items-center justify-between w-full px-[95px]">
            <div className="flex items-center gap-10">
              <div className="flex items-start justify-center gap-[3.22px]">
                <img className="h-[35px]" alt="Care now" src="/carenow.svg" />
                <div className="relative w-fit mt-[-0.40px] font-['Montserrat',Helvetica] font-normal text-[#ff4772] text-[17.7px] text-center">
                  Now
                </div>
              </div>
            </div>

            <Avatar className="w-[52px] h-[53px]">
              <AvatarFallback>
                <img className="w-full h-full object-cover" alt="User profile" src="/ellipse-12.png" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-32 px-6 flex">
          {/* Sidebar */}
          <div className="flex flex-col w-[363px] items-start gap-8 ml-[135px]">
            <div className="flex flex-col items-start gap-10 w-full">
              <h1 className="font-heading-h3-h3-semibold text-black text-[40px]">
                Xin chào {userName}!
              </h1>
              <Separator className="w-full" />
            </div>

            <div className="flex flex-col items-start gap-4 px-2.5 py-0">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-1 py-4 w-full relative ${
                    item.active ? "border-l-2 border-[#00dba8]" : ""
                  }`}
                >
                  {item.active && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00dba8]" />
                  )}
                  <div className="flex items-center gap-2 px-1 py-4">
                    <item.icon className="w-6 h-6" />
                    <div className={`${
                      item.active
                        ? "font-['SVN-Gilroy-Medium',Helvetica] font-medium"
                        : "font-heading-h6-h6-regular"
                      } text-black text-base whitespace-nowrap`}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col w-[816px] items-end gap-5 ml-[23px]">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-[43px] border-primaryblue-700 text-primaryblue-700 font-heading-h6-h6-semibold">
              Thêm hồ sơ người bệnh&nbsp;&nbsp; +
            </button>

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
                        <div className="w-[139px] h-[139px] bg-[#d9d9d9] rounded-full" />
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
      </div>
    </div>
  );
};

export default MedicalRecords; 