import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Logo from '../../assets/images/Logo.png';
import { LayoutDashboard, Users, Settings2, LogOut } from 'lucide-react';
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f9fa' }}>
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
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Tổng doanh thu */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            boxShadow: `
              rgba(105,105,105,0) -89px 138px 46px 0px,
              rgba(105,105,105,0.01) -57px 88px 42px 0px,
              rgba(105,105,105,0.05) -32px 50px 35px 0px,
              rgba(105,105,105,0.09) -14px 22px 26px 0px,
              rgba(105,105,105,0.1) -4px 6px 14px 0px
            `,
            padding: '12px 18px',
            boxSizing: 'border-box',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: 32, fontFamily: 'SVN-Gilroy', fontWeight: 600, color: '#1A1A1A' }}>
                $120,000,000 VNĐ
              </div>
              <div style={{
                fontSize: 16,
                fontFamily: 'SVN-Gilroy',
                fontWeight: 500,
                background: '#C2E561',
                color: '#1A1A1A',
                borderRadius: 0,
                padding: '4px 2px',
                marginTop: 4,
                display: 'block',
                lineHeight: 1.2
              }}>
                Tổng doanh thu
              </div>
            </div>
          </div>
          {/* Lợi nhuận (biểu đồ) */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 32, minWidth: 340, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#1a2e22' }}>Lợi nhuận</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 24, margin: '8px 0' }}>$36,000,000 VNĐ</div>
            <div style={{ color: '#1abc9c', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>+12% <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>Tháng cao nhất</span></div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={dataBar}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value">
                  {dataBar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 9 ? '#aee571' : '#d6e6fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginTop: 8 }}>
              {dataBar.map((d, i) => <span key={i}>{d.name}</span>)}
            </div>
          </div>
        </div>
        {/* Dòng dưới: Lịch sử thanh toán & Quản lý chuyên viên */}
        <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
          {/* Lịch sử thanh toán */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#1a2e22' }}>Lịch sử thanh toán</div>
              <input placeholder="Tìm kiếm tài khoản" style={{ border: '1px solid #eee', borderRadius: 8, padding: '6px 12px', outline: 'none' }} />
            </div>
            <div>
              {paymentHistory.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', marginRight: 16 }} />
                  <div style={{ flex: 2 }}>{item.name}<div style={{ color: '#888', fontSize: 13 }}>{item.card}</div></div>
                  <div style={{ flex: 1 }}>{item.amount}</div>
                  <div style={{ flex: 1 }}>{item.code}</div>
                  <div style={{ flex: 1 }}>{item.date}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <a href="#" style={{ color: '#1abc9c', fontWeight: 500 }}>Xem tất cả</a>
            </div>
          </div>
          {/* Quản lý chuyên viên */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: '#1a2e22', marginBottom: 8 }}>Quản lý chuyên viên</div>
            <div style={{ color: '#ff4e4e', fontSize: 14, marginBottom: 8 }}>40 chuyên viên chưa được duyệt</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={80} startAngle={180} endAngle={-180} cornerRadius={10}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', marginTop: 80, fontWeight: 700, fontSize: 28, color: '#1a2e22' }}>120</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#1abc9c', fontWeight: 500 }}>
                <span style={{ width: 12, height: 12, background: '#1abc9c', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>
                Đã kích hoạt 80
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#ff4e4e', fontWeight: 500 }}>
                <span style={{ width: 12, height: 12, background: '#ff4e4e', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>
                Chưa kích hoạt 40
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 