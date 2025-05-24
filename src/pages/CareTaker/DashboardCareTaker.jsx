import React from 'react';
import { TrendingUp } from 'lucide-react';

const DashboardCareTaker = () => {
  // Placeholder data
  const monthlyIncome = 4899000;
  const monthlyIncomeChange = 12;
  const weeklyHours = 24;
  const weeklyHoursChange = 1.5;
  const dailyCases = 5;
  const dailyCasesChange = 20;

  const upcomingAppointments = [
    { id: 1, patientName: 'Mrs. Nguyen', service: 'Chăm sóc sau phẫu thuật', time: '14:00 - 18:00', locationType: 'hospital', locationDetail: 'Bệnh viện Đà Nẵng' },
    { id: 2, patientName: 'Mrs. Nguyen', service: 'Chăm sóc sau phẫu thuật', time: '14:00 - 18:00', locationType: 'home', locationDetail: 'Nhà riêng' },
  ];

  const recentPatients = [
    { id: 1, name: 'Bệnh nhân 1', lastVisit: '1 ngày trước', imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c3cc?w=150&h=150&fit=crop&crop=face' },
    { id: 2, name: 'Bệnh nhân 1', lastVisit: '1 ngày trước', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: 3, name: 'Bệnh nhân 1', lastVisit: '1 ngày trước', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-600 mb-4">Sau đây là tổng quan về ngày của bạn</p>
        </div>

        {/* Main Income Card */}
        <div className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 rounded-xl p-6 text-black relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full">
            
            <svg className="absolute top-12 right-16 w-12 h-12 opacity-40" viewBox="0 0 100 100">
              <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" fill="rgba(147, 51, 234, 0.6)" />
            </svg>
            <svg className="absolute bottom-8 right-20 w-16 h-16 opacity-30" viewBox="0 0 100 100">
              <path d="M10,50 Q30,10 50,30 Q70,10 90,50 Q70,90 50,70 Q30,90 10,50" fill="rgba(147, 51, 234, 0.5)" />
            </svg>
          </div>
          
          {/* Dollar icon */}
       

          <div className="relative z-10">
            <p className="text-sm text-gray-700 mb-1">Thu nhập tháng này</p>
            <p className="text-3xl font-bold text-black mb-3">{monthlyIncome.toLocaleString()} VNĐ</p>
            <div className="flex items-center">
              <div className="bg-green-500 bg-opacity-20 px-2 py-1 rounded flex items-center">
                <TrendingUp className="w-3 h-3 text-green-700 mr-1" />
                <span className="text-green-700 text-xs font-medium">+{monthlyIncomeChange}% so với tháng trước</span>
              </div>
            </div>
          </div>

          {/* Yellow dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Hours Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Số giờ tuần này</p>
            <div className="flex items-end space-x-3 mb-2">
              <p className="text-4xl font-bold text-gray-900">{weeklyHours}</p>
              <div className="flex items-center text-green-500 text-sm font-medium mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>1.5%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">8 giờ nhiều hơn tuần trước</p>
          </div>

          {/* Daily Cases Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Số ca chăm sóc hôm nay</p>
            <div className="flex items-end space-x-3 mb-2">
              <p className="text-4xl font-bold text-gray-900">{dailyCases}</p>
              <div className="flex items-center text-green-500 text-sm font-medium mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>20%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">1 ca nhiều hơn ngày thường</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Cuộc hẹn sắp tới</h2>
            <p className="text-gray-500 text-sm mb-6">Lịch trình của bạn hôm nay</p>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={appointment.id} className={`border-l-4 ${index === 0 ? 'border-blue-400' : 'border-yellow-400'} pl-4 py-2`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                      <p className="text-gray-600 text-sm mt-1">{appointment.service}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.locationType === 'hospital' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {appointment.locationDetail}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Bệnh nhân gần đây</h2>
            <p className="text-gray-500 text-sm mb-6">Bệnh nhân bạn đã chăm sóc gần đây</p>
            
            <div className="space-y-3">
              {recentPatients.map(patient => (
                <div key={patient.id} className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={patient.imageUrl} 
                      alt={patient.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover" 
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-gray-600 text-sm">Lần thăm khám cuối: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <button className="text-teal-600 font-medium text-sm">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCareTaker;