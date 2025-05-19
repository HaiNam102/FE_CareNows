import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Logo from '../../assets/images/Logo.png';
import { LayoutDashboard, Users, Settings2, LogOut, Search, HandCoins, Fullscreen, Pen, Ellipsis, Info, PieChart as PieChartIcon } from 'lucide-react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const dataBar = [
  { name: '1', value: 20 }, { name: '2', value: 22 }, { name: '3', value: 25 }, { name: '4', value: 23 },
  { name: '5', value: 24 }, { name: '6', value: 26 }, { name: '7', value: 28 }, { name: '8', value: 27 },
  { name: '9', value: 25 }, { name: '10', value: 40 }, { name: '11', value: 26 }, { name: '12', value: 27 }
];

const pieData = [
  { name: 'Đã kích hoạt', value: 80, color: '#1abc9c' },
  { name: 'Chưa kích hoạt', value: 40, color: '#ff4e4e' }
];

const navs = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { label: 'Quản lý tài khoản', icon: <Users size={20} />, path: '/admin/accounts' },
];

// Dashboard API endpoints for future integration
const API_ENDPOINTS = {
  DASHBOARD_STATS: '/api/dashboard/stats',
  PAYMENT_HISTORY: '/api/payments/history',
  SPECIALIST_DATA: '/api/specialists/stats',
  MONTHLY_PROFIT: '/api/finance/profit'
};

const avatarSamples = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
  "https://randomuser.me/api/portraits/women/7.jpg"
];
const AdminHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // States for animated counters
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [nurseRevenue, setNurseRevenue] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [profit, setProfit] = useState(0);

  // States for data
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPayment, setCountPayment] = useState(0);
  const itemsPerPage = 5;

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Target values
  const totalRevenueTarget = 120000000;
  const nurseRevenueTarget = 88000000;
  const monthlyProfitTarget = 10000000;
  const profitTarget = 36000000;

  // Animation duration in milliseconds
  const duration = 1000;
  const frameRate = 30;
  const totalFrames = Math.floor(duration / 1000 * frameRate);

  const fetchCountPayment = async () => {
    try {
      const response = await axios.get(`${API_BASE}/payment/total`);
      setCountPayment(response.data.data || 0);
    } catch (error) {
      console.error('Error fetching payment count:', error);
    }
  };
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/payment/getAllPayment`);
      setPaymentHistory(response.data.data || []);
      setFilteredPayments(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setPaymentHistory([]);
      setFilteredPayments([]);
      console.error('Error fetching payment history:', error);
    }
  };

  // Animation effect
  // useEffect(() => {
  //   let frame = 0;
  //   const interval = setInterval(() => {
  //     frame++;
  //     const progress = frame / totalFrames;

  //     if (frame <= totalFrames) {
  //       setTotalRevenue(Math.floor(easeOutQuad(progress) * totalRevenueTarget));
  //       setNurseRevenue(Math.floor(easeOutQuad(progress) * nurseRevenueTarget));
  //       setMonthlyProfit(Math.floor(easeOutQuad(progress) * monthlyProfitTarget));
  //       setProfit(Math.floor(easeOutQuad(progress) * profitTarget));
  //     } else {
  //       clearInterval(interval);
  //       setTotalRevenue(totalRevenueTarget);
  //       setNurseRevenue(nurseRevenueTarget);
  //       setMonthlyProfit(monthlyProfitTarget);
  //       setProfit(profitTarget);
  //     }
  //   }, 1000 / frameRate);

  //   return () => clearInterval(interval);
  // }, []);

  // Search function for payment history
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPayments(paymentHistory);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const results = paymentHistory.filter(
        item =>
          (item.nameOfUser && item.nameOfUser.toLowerCase().includes(lowercasedSearch)) ||
          (item.transactionId && item.transactionId.toLowerCase().includes(lowercasedSearch)) ||
          (item.price && item.price.toString().includes(searchTerm)) ||
          (item.updateAt && item.updateAt.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredPayments(results);
    }
  }, [searchTerm, paymentHistory]);

  // Function to fetch dashboard data - ready for API integration
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Future API implementation
      // const response = await fetch(API_ENDPOINTS.DASHBOARD_STATS);
      // const data = await response.json();

      // For now, using mock data
      setTimeout(() => {
        // setPaymentHistory(mockPaymentHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchPaymentHistory();
    fetchCountPayment();
  }, []);

  // Easing function for smoother animation
  const easeOutQuad = (x) => {
    return 1 - (1 - x) * (1 - x);
  };

  // Format number with commas
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    console.log('AccountManagement mounted');
    return () => console.log('AccountManagement unmounted');
  }, []);

  function hashStringToIndex(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f7f9fa',
      width: '100%',
      fontFamily: 'SVN-Gilroy'
    }}>
      {/* Sidebar */}
      <div style={{ width: 226, background: '#1a2e22', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 0' }}>
        <div>
          <div style={{ padding: '0 24px', marginBottom: 40 }}>
            <img src={Logo} alt="logo" style={{ width: 135, height: 26, objectFit: 'contain' }} />
          </div>
          <div>
            {navs.map((nav, idx) => {
              const selected = location.pathname === nav.path;
              return (
                <NavLink
                  key={nav.label}
                  to={nav.path}
                  style={{
                    borderRadius: 0,
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 400,
                    fontFamily: 'SVN-Gilroy',
                    fontSize: 16,
                    cursor: 'pointer',
                    background: selected ? '#C6E76D' : 'transparent',
                    color: selected ? '#1a2e22' : '#fff',
                    transition: 'background 0.2s, color 0.2s',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(nav.icon, { size: 24 })}
                  </span>
                  {nav.label}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', cursor: 'pointer' }}>
            <Settings2 size={24} style={{ marginRight: 10 }} /> Cài đặt
          </div>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 24px', marginTop: 16 }} onClick={() => {
            localStorage.removeItem('token');
            try {
              navigate('/login');
            } catch (error) {
              console.error('Navigation error:', error);
              window.location.href = '/login';
            }
          }}>
            <LogOut size={24} style={{ marginRight: 10 }} /> Đăng xuất
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 24 }}>
        {/* Top area with notification and display buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #E0E0E0', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #E0E0E0',
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 14
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Display
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left column */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Top revenue stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#fff', borderRadius: 16, padding: 24 }}>
              {/* Total revenue */}
              <div style={{
                boxShadow: `
                  rgba(105,105,105,0) -89px 138px 46px 0px,
                  rgba(105,105,105,0.01) -57px 88px 42px 0px,
                  rgba(105,105,105,0.05) -32px 50px 35px 0px,
                  rgba(105,105,105,0.09) -14px 22px 26px 0px,
                  rgba(105,105,105,0.1) -4px 6px 14px 0px
                `,
                padding: '12px 18px',
                height: '100%',
                borderRadius: 8,
                marginRight: 16,
                flex: 1
              }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.2, marginBottom: 12 }}>
                  ${formatNumber(countPayment.totalAmount)} VND
                </div>
                <div style={{
                  fontSize: 16,
                  fontWeight: 500,
                  background: '#C2E561',
                  color: '#1A1A1A',
                  padding: '4px 12px',
                  borderRadius: 4,
                  display: 'inline-block'
                }}>
                  Tổng doanh thu
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 64, background: '#BFBFBF' }}></div>

              {/* Other revenue stats */}
              <div style={{ flex: 2, display: 'flex', gap: 40 }}>
                <div>
                  <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 8 }}>
                    Doanh thu bảo mẫu
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#1A1A1A' }}>
                    ${formatNumber(countPayment.totalAmountAfterPayCaretaker)} VND
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 8 }}>
                    Lợi nhuận tháng này
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#1A1A1A' }}>
                    ${formatNumber(monthlyProfit)} VND
                  </div>
                </div>
              </div>
            </div>

            {/* Payment history */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: '0.75px solid #A6A6A6',
              flex: 1,
              position: 'relative',
              minHeight: 462
            }}>
              {loading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                  borderRadius: 16
                }}>
                  <div>Đang tải...</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#1a2e22' }}>Lịch sử thanh toán</div>
                <div style={{ position: 'relative', width: 318, height: 44 }}>
                  <input
                    placeholder="Tìm kiếm tài khoản"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                      width: 318,
                      height: 44,
                      border: '0.75px solid #A6A6A6',
                      borderRadius: 50,
                      padding: '0 44px 0 16px',
                      outline: 'none',
                      fontSize: 13,
                      color: '#1A1A1A',
                    }}
                  />
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Search size={20} color="#8C8C8C" strokeWidth={2} />
                  </span>
                </div>
              </div>
              <div>
                {/* Header columns */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 16px 0', color: '#737373', fontSize: 14, fontWeight: 400 }}>
                  <div style={{ flex: 2 }}>Người thanh toán</div>
                  <div style={{ flex: 1 }}>Số tiền</div>
                  <div style={{ flex: 1 }}>Mã giao dịch</div>
                  <div style={{ flex: 1 }}>Ngày chuyển</div>
                </div>

                {paginatedPayments.length > 0 ? (
                  <>
                    {paginatedPayments.map((item, idx) => (
                      <div key={item.paymentId} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '0.5px solid #BFBFBF' }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: '#ddd',
                              marginRight: 16,
                              backgroundImage: `url(${item.avatar ||
                                avatarSamples[
                                hashStringToIndex(item.nameOfUser || 'unknown', avatarSamples.length)
                                ]
                                })`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 500, color: '#1A1A1A', fontSize: 16 }}>{item.nameOfUser}</div>
                            {/* <div style={{ color: '#8C8C8C', fontSize: 13 }}>{item.card}</div> */}
                          </div>
                        </div>
                        <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{formatNumber(item.price)} VNĐ</div>
                        <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{item.transactionId}</div>
                        <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{item.updateAt}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#737373' }}>
                    Không tìm thấy kết quả phù hợp
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                  {Array.from({ length: Math.ceil(filteredPayments.length / itemsPerPage) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '1px solid #C6E76D',
                        background: currentPage === i + 1 ? '#C6E76D' : '#fff',
                        color: currentPage === i + 1 ? '#1A1A1A' : '#737373',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <a href="#" style={{ color: '#1abc9c', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Xem tất cả</a>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Profit chart */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: '0.75px solid #A6A6A6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HandCoins size={20} color="#008667" />
                  <span style={{ fontWeight: 500, fontSize: 16, color: '#1a2e22' }}>Lợi nhuận</span>
                  <Info size={10} color="#1a2e22" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Fullscreen size={18} color="#8C8C8C" />
                  <Pen size={18} color="#8C8C8C" />
                  <Ellipsis size={18} color="#8C8C8C" />
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 24, margin: '12px 0 8px' }}>
                ${formatNumber(profit)} VND
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, fontSize: 14 }}>
                <span style={{
                  background: '#C6E76D',
                  color: '#1A1A1A',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 14,
                  marginRight: 8
                }}>+12%</span>
                <span style={{ color: '#8C8C8C', fontWeight: 400 }}>Tháng cao nhất</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={dataBar} barCategoryGap={10}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#8C8C8C', fontSize: 14 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={24}>
                    {dataBar.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 9 ? '#C6E76D' : '#E8F1FB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Specialist management */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: '0.75px solid #A6A6A6',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: 462,
              minHeight: 462
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <PieChartIcon size={20} color="#008667" />
                <span style={{ fontWeight: 500, fontSize: 16, color: '#1a2e22' }}>Quản lý chuyên viên</span>
                <Info size={10} color="#595959" />
              </div>
              <div style={{ color: '#B7586E', fontSize: 24, marginBottom: 0, fontWeight: 500 }}><span style={{ fontWeight: 700 }}>!</span> 40 chuyên viên chưa được duyệt</div>
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}>
                {/* Outer donut chart */}
                <div style={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  background: 'conic-gradient(#00D1A0 0deg 216deg, #FF6E91 216deg 360deg)'
                }}></div>
                {/* Inner white space for donut effect */}
                <div style={{
                  position: 'absolute',
                  width: 208,
                  height: 208,
                  borderRadius: '50%',
                  background: 'white',
                  zIndex: 2
                }}></div>
                {/* SVG Dash circle */}
                <svg
                  style={{
                    position: 'absolute',
                    width: 170,
                    height: 170,
                    zIndex: 3
                  }}
                >
                  <circle
                    cx="85"
                    cy="85"
                    r="84"
                    fill="none"
                    stroke="#595959"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
                {/* Inner grey circle with text */}
                <div style={{
                  position: 'absolute',
                  width: 156,
                  height: 156,
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom, #F9F9F9, #ECECEC)',
                  border: '1px solid #E0E0E0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 4
                }}>
                  <div style={{ fontSize: 14, color: '#757575', marginBottom: 4 }}>Chuyên viên</div>
                  <div style={{ fontWeight: 700, fontSize: 42, color: '#1a2e22' }}>120</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#00D1A0',
                  }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12, color: '#737373' }}>Đã kích hoạt</span>
                    <span style={{ fontSize: 16, color: '#000000', fontWeight: 500 }}>80</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#FF6E91',
                  }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12, color: '#737373' }}>Chưa kích hoạt</span>
                    <span style={{ fontSize: 16, color: '#000000', fontWeight: 500 }}>40</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;