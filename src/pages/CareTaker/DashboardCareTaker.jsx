import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const DashboardCareTaker = () => {
  // State để lưu dữ liệu từ API
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyIncomeChange, setMonthlyIncomeChange] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [weeklyHoursChange, setWeeklyHoursChange] = useState(0);
  const [dailyCases, setDailyCases] = useState(0);
  const [dailyCasesChange, setDailyCasesChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder data for upcoming appointments and recent patients
  const upcomingAppointments = [
    { id: 1, patientName: 'Mrs. Nguyen', service: 'Post-surgery care', time: '14:00 - 18:00', locationType: 'hospital', locationDetail: 'Da Nang Hospital' },
    { id: 2, patientName: 'Mr. Tran', service: 'Daily care', time: '09:00 - 12:00', locationType: 'home', locationDetail: 'Private residence' },
  ];

  const recentPatients = [
    { id: 1, name: 'Patient 1', lastVisit: '1 day ago', imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c3cc?w=150&h=150&fit=crop&crop=face' },
    { id: 2, name: 'Patient 2', lastVisit: '2 days ago', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: 3, name: 'Patient 3', lastVisit: '3 days ago', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/booking/price', {
          method: 'GET',
          headers: {
            'Authorization':`Bearer ${token}`, // Replace with actual token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        if (data.code === 1010 && data.message === 'Get successful') {
          // Set monthlyIncome from API data
          setMonthlyIncome(data.data || 0);

          // Generate realistic placeholder data
          setMonthlyIncomeChange(0); // +10% change
          setWeeklyHours(0); // 25 hours/week
          setWeeklyHoursChange(0); // +2% change
          setDailyCases(0); // 6 cases/day
          setDailyCasesChange(0); // +15% change
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Dashboard</h1>
          {/* <p className="text-gray-600 mb-4"></p> */}
        </div>

        {/* Main Income Card */}
        <div className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 rounded-xl p-6 text-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full">
            <svg className="absolute top-12 right-16 w-12 h-12 opacity-40" viewBox="0 0 100 100">
              <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" fill="rgba(147, 51, 234, 0.6)" />
            </svg>
            <svg className="absolute bottom-8 right-20 w-16 h-16 opacity-30" viewBox="0 0 100 100">
              <path d="M10,50 Q30,10 50,30 Q70,10 90,50 Q70,90 50,70 Q30,90 10,50" fill="rgba(147, 51, 234, 0.5)" />
            </svg>
          </div>

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
            <p className="text-gray-600 text-sm mb-2">Giờ tuần này</p>
            <div className="flex items-end space-x-3 mb-2">
              <p className="text-4xl font-bold text-gray-900">{weeklyHours}</p>
              <div className="flex items-center text-green-500 text-sm font-medium mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{weeklyHoursChange}%</span>
              </div>
            </div>
         
          </div>

          {/* Daily Cases Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Chăm sóc hôm nay</p>
            <div className="flex items-end space-x-3 mb-2">
              <p className="text-4xl font-bold text-gray-900">{dailyCases}</p>
              <div className="flex items-center text-green-500 text-sm font-medium mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{dailyCasesChange}%</span>
              </div>
            </div>
     
          </div>
        </div>


      </div>
    </div>
  );
};

export default DashboardCareTaker;