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

// Gradient definitions for pie chart
const pieGradients = {
  green: {
    id: 'greenGradient',
    startColor: '#00D1A0',
    endColor: '#00876A'
  },
  pink: {
    id: 'pinkGradient',
    startColor: '#FF6E91',
    endColor: '#FF3355'
  },
  gray: {
    id: 'grayGradient',
    startColor: '#F9F9F9',
    endColor: '#ECECEC'
  },
  grayStroke: {
    id: 'grayStrokeGradient',
    startColor: '#EEEEEE',
    endColor: '#E0E0E0'
  }
};

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
      <div style={{ width: 260, background: '#1a2e22', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            <img src={Logo} alt="logo" style={{ width: 135, height: 26, objectFit: 'contain', marginRight: 0 }} />
          </div>
          <div>
            {navs.map((nav, idx) => {
              const selected = location.pathname === nav.path;
              return (
                <div
                  key={nav.label}
                  onClick={() => navigate(nav.path)}
                  style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    padding: '10px 16px',
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
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, cursor: 'pointer', padding: '0px 10px' }}>
            <Settings2 size={24} style={{ marginRight: 10 }} /> Cài đặt
          </div>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '16px 10px', marginTop: 16 }} onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>
            <LogOut size={24} style={{ marginRight: 10 }} /> Đăng xuất
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 32 }}>
        {/* Container chứa Tổng doanh thu và Doanh thu bảo mẫu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            height: '110px',
          }}
        >
          {/* Tổng doanh thu */}
          <div
            style={{
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
              marginRight: 83,
            }}
          >
            <div style={{
              fontSize: 32,
              fontFamily: 'SVN-Gilroy',
              fontWeight: 600,
              color: '#1A1A1A',
              lineHeight: 1.2,
              marginBottom: 12,
            }}>
              $120,000,000 VNĐ
            </div>
            <div style={{
              fontSize: 16,
              fontFamily: 'SVN-Gilroy',
              fontWeight: 500,
              background: '#C2E561',
              color: '#1A1A1A',
              padding: '4px 12px',
              borderRadius: 4,
              display: 'inline-block',
            }}>
              Tổng doanh thu
            </div>
          </div>
          
          {/* Divide line */}
          <div 
            style={{ 
              width: 2, 
              backgroundColor: '#BFBFBF', 
              height: '80%',
              margin: '0'
            }}
          ></div>
          
          {/* Doanh thu bảo mẫu và Lợi nhuận tháng này */}
          <div style={{ marginLeft: 74, display: 'flex', gap: 74 }}>
            {/* Doanh thu báo mẫu */}
            <div>
              <div style={{
                fontSize: 16,
                fontFamily: 'SVN-Gilroy',
                fontWeight: 400,
                color: '#888',
                marginBottom: 8,
              }}>
                Doanh thu báo mẫu
              </div>
              <div style={{
                fontSize: 24,
                fontFamily: 'SVN-Gilroy',
                fontWeight: 600,
                color: '#1A1A1A',
              }}>
                $88,000,000 VNĐ
              </div>
            </div>
            {/* Lợi nhuận tháng này */}
            <div>
              <div style={{
                fontSize: 16,
                fontFamily: 'SVN-Gilroy',
                fontWeight: 400,
                color: '#888',
                marginBottom: 8,
              }}>
                Lợi nhuận tháng này
              </div>
              <div style={{
                fontSize: 24,
                fontFamily: 'SVN-Gilroy',
                fontWeight: 600,
                color: '#1A1A1A',
              }}>
                $10,000,000 VNĐ
              </div>
            </div>
          </div>
        </div>
        
        {/* Lợi nhuận (biểu đồ) */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 32, minWidth: 340, maxWidth: 531, marginTop: 24, border: '0.75px solid #A6A6A6' }}>
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
          <div style={{ fontWeight: 700, fontSize: 24, margin: '8px 0' }}>$36,000,000 VNĐ</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: 16 }}>
            <span style={{ background: '#C6E76D', color: '#1A1A1A', fontWeight: 600, padding: '2px 10px', fontSize: 16, marginRight: 8, }}>+12%</span>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 16 }}>Tháng cao nhất</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={dataBar} barCategoryGap={25}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#888', fontSize: 16 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[12,12,12,12]} barSize={32}>
                {dataBar.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 9 ? '#aee571' : '#d6e6fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Dòng dưới: Lịch sử thanh toán & Quản lý chuyên viên */}
        <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
          {/* Lịch sử thanh toán */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, flex: 2, border: '0.75px solid #A6A6A6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#1a2e22' }}>Lịch sử thanh toán</div>
              <div style={{ position: 'relative', width: 318, height: 44 }}>
                <input
                  placeholder="Tìm kiếm tài khoản"
                  style={{
                    width: 318,
                    height: 44,
                    border: '0.8px solid #8C8C8C',
                    borderRadius: 50,
                    padding: '0 44px 0 16px',
                    outline: 'none',
                    fontSize: 13,
                    color: '#1A1A1A',
                    fontFamily: 'SVN-Gilroy',
                  }}
                />
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Search size={20} color="#8C8C8C" strokeWidth={2} />
                </span>
              </div>
            </div>
            <div>
              {/* Header columns */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 10px 0', color: '#737373', fontSize: 16, fontWeight: 400 }}>
                <div style={{ flex: 2, borderRadius: '12px 0 0 12px' }}></div>
                <div style={{ flex: 1, borderRadius: 12 }}>Số tiền</div>
                <div style={{ flex: 1, borderRadius: 12 }}>Mã giao dịch</div>
                <div style={{ flex: 1, borderRadius: '0 12px 12px 0' }}>Ngày chuyển</div>
              </div>
              {paymentHistory.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #BFBFBF' }}>
                  <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '12px 0 0 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', marginRight: 16 }} />
                      <div>
                        <div style={{ fontWeight: 500, color: '#1A1A1A', fontSize: 16 }}>{item.name}</div>
                        <div style={{ color: '#888', fontSize: 13 }}>{item.card}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, fontSize: 16, color: '#1A1A1A', fontWeight: 500, borderRadius: 12 }}>{item.amount}</div>
                  <div style={{ flex: 1, fontSize: 16, color: '#1A1A1A', fontWeight: 500, borderRadius: 12 }}>{item.code}</div>
                  <div style={{ flex: 1, fontSize: 16, color: '#1A1A1A', fontWeight: 500, borderRadius: '0 12px 12px 0' }}>{item.date}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <a href="#" style={{ color: '#1abc9c', fontWeight: 500 }}>Xem tất cả</a>
            </div>
          </div>
          {/* Quản lý chuyên viên */}
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 8px #0001', padding: 24, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '462px }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, width: '100%' }}>
              <PieChartIcon size={24} color="#008667" />
              <span style={{ fontWeight: 500, fontSize: 16, color: '#1a2e22' }}>Quản lý chuyên viên</span>
              <Info size={10} color="#595959" />
            </div>
            <div style={{ color: '#B7586E', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>40 chuyên viên chưa được duyệt</div>
            {/* New approach: Container for chart and circle */}
            <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', alignSelf: 'center' }}>
              {/* Outer Donut Chart */}
              <div style={{ 
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'conic-gradient(#00D1A0 0deg 216deg, #FF6E91 216deg 360deg)'
              }}></div>
              {/* Inner white space for donut effect */}
              <div style={{ 
                position: 'absolute',
                width: 252,
                height: 252,
                borderRadius: '50%',
                background: 'white',
                zIndex: 2
              }}></div>
              {/* SVG Dash circle */}
              <svg 
                style={{
                  position: 'absolute',
                  width: 205,
                  height: 205,
                  zIndex: 3
                }}
              >
                <circle
                  cx="102.5"
                  cy="102.5"
                  r="101.5"
                  fill="none"
                  stroke="#595959"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>
              {/* Inner grey circle with text */}
              <div style={{ 
                position: 'absolute',
                width: 190,
                height: 190,
                borderRadius: '50%',
                background: 'linear-gradient(to bottom, #F9F9F9, #ECECEC)',
                border: '1px solid #CCCCCC',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 4
              }}>
                <div style={{ fontSize: 16, color: '#757575', marginBottom: 5 }}>Chuyên viên chăm sóc</div>
                <div style={{ fontWeight: 700, fontSize: 46, color: '#1a2e22' }}>120</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 33, 
                  height: 33, 
                  borderRadius: '50%', 
                  background: '#00D1A0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, color: '#737373' }}>Đã kích hoạt</span>
                  <span style={{ fontSize: 16, color: '#000000', fontWeight: 500 }}>80</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 33, 
                  height: 33, 
                  borderRadius: '50%', 
                  background: '#FF6E91',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
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
  );
};

export default AdminHome; 