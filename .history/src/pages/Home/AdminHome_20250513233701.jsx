import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Logo from '../../assets/images/Logo.png';
import { LayoutDashboard, Users, Settings2, LogOut, Search, HandCoins, Fullscreen, Pen, Ellipsis, Info, PieChart as PieChartIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const dataBar = [
  { name: '1', value: 20 }, { name: '2', value: 22 }, { name: '3', value: 25 }, { name: '4', value: 23 },
  { name: '5', value: 24 }, { name: '6', value: 26 }, { name: '7', value: 28 }, { name: '8', value: 27 },
  { name: '9', value: 25 }, { name: '10', value: 40 }, { name: '11', value: 26 }, { name: '12', value: 27 }
];

const pieData = [
  { name: 'Đã kích hoạt', value: 80, color: '#1abc9c' },
  { name: 'Chưa kích hoạt', value: 40, color: '#ff4e4e' }
];

const paymentHistory = Array(7).fill({
  name: 'Nguyen Nhat Tan',
  card: '3467 5839 67831',
  amount: '150.000 VNĐ',
  code: '#1234',
  date: '15/03/2025'
});

const navs = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { label: 'Quản lý tài khoản', icon: <Users size={20} />, path: '/admin/accounts' },
];

const AdminHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f9fa', fontFamily: 'SVN-Gilroy' }}>
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
                <div
                  key={nav.label}
                  onClick={() => navigate(nav.path)}
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
                  }}
                >
                  <span style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>{React.cloneElement(nav.icon, { size: 24 })}</span> {nav.label}
                </div>
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
            window.location.href = '/login';
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
                background: '#fff',
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
                  $120,000,000 VND
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
                    $88,000,000 VND
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 8 }}>
                    Lợi nhuận tháng này
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#1A1A1A' }}>
                    $10,000,000 VND
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
              flex: 1 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#1a2e22' }}>Lịch sử thanh toán</div>
                <div style={{ position: 'relative', width: 318, height: 44 }}>
                  <input
                    placeholder="Tìm kiếm tài khoản"
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
                  <div style={{ flex: 2 }}></div>
                  <div style={{ flex: 1 }}>Số tiền</div>
                  <div style={{ flex: 1 }}>Mã giao dịch</div>
                  <div style={{ flex: 1 }}>Ngày chuyển</div>
                </div>
                {paymentHistory.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '0.5px solid #BFBFBF' }}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', marginRight: 16 }} />
                      <div>
                        <div style={{ fontWeight: 500, color: '#1A1A1A', fontSize: 16 }}>{item.name}</div>
                        <div style={{ color: '#8C8C8C', fontSize: 13 }}>{item.card}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{item.amount}</div>
                    <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{item.code}</div>
                    <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>{item.date}</div>
                  </div>
                ))}
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
              <div style={{ fontWeight: 700, fontSize: 24, margin: '12px 0 8px' }}>$36,000,000 VND</div>
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
                  <Bar dataKey="value" radius={[12,12,0,0]} barSize={24}>
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
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <PieChartIcon size={20} color="#008667" />
                <span style={{ fontWeight: 500, fontSize: 16, color: '#1a2e22' }}>Quản lý chuyên viên</span>
                <Info size={10} color="#595959" />
              </div>
              <div style={{ color: '#B7586E', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>40 chuyên viên chưa được duyệt</div>
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
                  <div style={{ fontSize: 14, color: '#757575', marginBottom: 4 }}>Chuyên viên chăm sóc</div>
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