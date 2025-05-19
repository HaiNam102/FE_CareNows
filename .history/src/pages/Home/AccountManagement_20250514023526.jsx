import React, { useState, useEffect } from 'react';
import Logo from '../../assets/images/Logo.png';
import { LayoutDashboard, Users, Settings2, LogOut, Search, Filter, Download, Upload, Plus, MoreHorizontal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Navigation items
const navs = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { label: 'Quản lý tài khoản', icon: <Users size={20} />, path: '/admin/accounts' },
];

// Mock data for users table
const mockUsers = [
  {
    id: 1,
    name: 'Nguyen Nhat Tan',
    email: 'vananhnvt2k3@gmail.com',
    role: 'Khách hàng',
    status: 'active',
    joinDate: '15/03/2025',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Tran Van Minh',
    email: 'tranvanminh@gmail.com',
    role: 'Chuyên viên',
    status: 'active',
    joinDate: '14/03/2025',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 3,
    name: 'Le Thi Hong',
    email: 'lethihong@gmail.com',
    role: 'Khách hàng',
    status: 'inactive',
    joinDate: '14/03/2025',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 4,
    name: 'Pham Quoc Bao',
    email: 'phamquocbao@gmail.com',
    role: 'Chuyên viên',
    status: 'active',
    joinDate: '13/03/2025',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 5,
    name: 'Hoang Thuy Linh',
    email: 'hoangthuylinh@gmail.com',
    role: 'Khách hàng',
    status: 'active',
    joinDate: '12/03/2025',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 6,
    name: 'Vo Minh Truong',
    email: 'vominhtruong@gmail.com',
    role: 'Chuyên viên',
    status: 'pending',
    joinDate: '11/03/2025',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    id: 7,
    name: 'Trinh Thi My',
    email: 'trinhthimy@gmail.com',
    role: 'Chuyên viên',
    status: 'active',
    joinDate: '10/03/2025',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
  }
];

const AccountManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'specialist'
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [actionMenuUserId, setActionMenuUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'Khách hàng', 'Chuyên viên'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive', 'pending'
  
  // Thao tác admin
  const handleBlockUser = (user) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, status: 'inactive' } : u
      )
    );
  };
  const handleActivateUser = (user) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, status: 'active' } : u
      )
    );
  };
  const handleDeactivateUser = (user) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, status: 'pending' } : u
      )
    );
  };

  // Filter users based on selected tab and search term
  useEffect(() => {
    let result = users;
    
    // Filter by tab
    if (activeTab === 'customer') {
      result = result.filter(user => user.role === 'Khách hàng');
    } else if (activeTab === 'specialist') {
      result = result.filter(user => user.role === 'Chuyên viên');
    }
    
    // Filter by search
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, activeTab, users, roleFilter, statusFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const exportToCSV = () => {
    const headers = ['Tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tham gia'];
    const rows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.role,
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
                  onClick={() => {
                    console.log('Navigating to:', nav.path);
                    try {
                      navigate(nav.path);
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = nav.path;
                    }
                  }}
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
        
        {/* Account Management Content */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.75px solid #A6A6A6' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Quản lý tài khoản</h1>
            <p style={{ fontSize: 14, color: '#737373' }}>Xem và quản lý tất cả tài khoản người dùng</p>
          </div>
          
          {/* Tabs + Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            {/* Tabs */}
            <div style={{ display: 'flex' }}>
              <div 
                onClick={() => setActiveTab('customer')}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 50, 
                  background: activeTab === 'customer' ? '#C6E76D' : 'transparent',
                  color: activeTab === 'customer' ? '#1A1A1A' : '#737373',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 14,
                  marginRight: 8
                }}
              >
                Khách hàng
              </div>
              <div 
                onClick={() => setActiveTab('specialist')}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 50, 
                  background: activeTab === 'specialist' ? '#C6E76D' : 'transparent',
                  color: activeTab === 'specialist' ? '#1A1A1A' : '#737373',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Chuyên viên
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Search */}
              <div style={{ position: 'relative', width: 250 }}>
                <input
                  placeholder="Tìm kiếm tài khoản"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    height: 40,
                    border: '0.75px solid #A6A6A6',
                    borderRadius: 50,
                    padding: '0 40px 0 16px',
                    outline: 'none',
                    fontSize: 13,
                    color: '#1A1A1A',
                  }}
                />
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Search size={18} color="#8C8C8C" strokeWidth={2} />
                </span>
              </div>
              
              {/* Filter Button */}
              <div style={{ 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px', 
                border: '0.75px solid #A6A6A6', 
                borderRadius: 50,
                fontSize: 13,
                color: '#1A1A1A',
                cursor: 'pointer'
              }}>
                <Filter size={16} style={{ marginRight: 8 }} />
                Bộ lọc
              </div>
              
              {/* Export Button */}
              <div style={{ 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px', 
                border: '0.75px solid #A6A6A6', 
                borderRadius: 50,
                fontSize: 13,
                color: '#1A1A1A',
                cursor: 'pointer'
              }}>
                <Download size={16} style={{ marginRight: 8 }} />
                Xuất file
              </div>
              
              {/* Import Button */}
              <div style={{ 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px', 
                border: '0.75px solid #A6A6A6', 
                borderRadius: 50,
                fontSize: 13,
                color: '#1A1A1A',
                cursor: 'pointer'
              }}>
                <Upload size={16} style={{ marginRight: 8 }} />
                Nhập file
              </div>
              
              {/* Add User Button */}
              <div style={{ 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px', 
                background: '#1a2e22',
                color: '#fff',
                borderRadius: 50,
                fontSize: 13,
                cursor: 'pointer'
              }}>
                <Plus size={16} style={{ marginRight: 8 }} />
                Thêm người dùng
              </div>
            </div>
          </div>
          
          {/* Filter Options */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ borderRadius: 8, padding: 4 }}>
              <option value="all">Tất cả vai trò</option>
              <option value="Khách hàng">Khách hàng</option>
              <option value="Chuyên viên">Chuyên viên</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ borderRadius: 8, padding: 4 }}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Đã chặn</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
          
          {/* Users Table */}
          <div style={{ border: '0.75px solid #A6A6A6', borderRadius: 12, overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{ display: 'flex', background: '#F9F9F9', padding: '12px 16px', borderBottom: '0.75px solid #A6A6A6' }}>
              <div style={{ flex: 3, fontSize: 14, fontWeight: 500, color: '#737373' }}>Tên người dùng</div>
              <div style={{ flex: 2, fontSize: 14, fontWeight: 500, color: '#737373' }}>Email</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#737373' }}>Vai trò</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#737373' }}>Trạng thái</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#737373' }}>Ngày tham gia</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#737373', textAlign: 'center' }}>Thao tác</div>
            </div>
            
            {/* Table Rows */}
            {filteredUsers.map((user) => (
              <div key={user.id} style={{ display: 'flex', padding: '12px 16px', borderBottom: '0.75px solid #E6E6E6', alignItems: 'center' }}>
                <div style={{ flex: 3, display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    marginRight: 12,
                    backgroundImage: `url(${user.avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{user.name}</div>
                </div>
                <div style={{ flex: 2, fontSize: 14, color: '#1A1A1A' }}>{user.email}</div>
                <div style={{ flex: 1, fontSize: 14, color: '#1A1A1A' }}>{user.role}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 500,
                    background: user.status === 'active' ? '#C6E76D' : 
                               user.status === 'inactive' ? '#FEEBE6' : '#FFF6DE',
                    color: user.status === 'active' ? '#1A1A1A' : 
                           user.status === 'inactive' ? '#D73B29' : '#EAAE19'
                  }}>
                    {user.status === 'active' ? 'Hoạt động' : 
                     user.status === 'inactive' ? 'Đã khóa' : 'Chờ duyệt'}
                  </span>
                </div>
                <div style={{ flex: 1, fontSize: 14, color: '#1A1A1A' }}>{user.joinDate}</div>
                <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  <button
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '0.75px solid #E6E6E6',
                      background: '#fff'
                    }}
                    onClick={() => setActionMenuUserId(actionMenuUserId === user.id ? null : user.id)}
                  >
                    <MoreHorizontal size={16} color="#737373" />
                  </button>
                  {/* Hiện menu nếu đúng user */}
                  {actionMenuUserId === user.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 40,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #E6E6E6',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        zIndex: 10,
                        minWidth: 140
                      }}
                    >
                      {/* Khách hàng: chỉ có chặn */}
                      {user.role === 'Khách hàng' && (
                        <button
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#D73B29',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            handleBlockUser(user);
                            setActionMenuUserId(null);
                          }}
                          disabled={user.status === 'inactive'}
                        >
                          {user.status === 'inactive' ? 'Đã chặn' : 'Chặn tài khoản'}
                        </button>
                      )}
                      {/* Chuyên viên: chặn và kích hoạt */}
                      {user.role === 'Chuyên viên' && (
                        <>
                          {/* Option: Chặn tài khoản */}
                          <button
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              background: 'none',
                              border: 'none',
                              color: '#D73B29',
                              textAlign: 'left',
                              cursor: user.status === 'inactive' ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => {
                              handleBlockUser(user);
                              setActionMenuUserId(null);
                            }}
                            disabled={user.status === 'inactive'}
                          >
                            {user.status === 'inactive' ? 'Đã chặn' : 'Chặn tài khoản'}
                          </button>
                          {/* Option: Kích hoạt tài khoản */}
                          <button
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              background: 'none',
                              border: 'none',
                              color: user.status === 'active' ? '#A6A6A6' : '#1A1A1A',
                              textAlign: 'left',
                              cursor: user.status === 'active' ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => {
                              handleActivateUser(user);
                              setActionMenuUserId(null);
                            }}
                            disabled={user.status === 'active'}
                          >
                            {user.status === 'active' ? 'Đã kích hoạt' : 'Kích hoạt tài khoản'}
                          </button>
                          {/* Option: Hủy kích hoạt */}
                          <button
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              background: 'none',
                              border: 'none',
                              color: user.status !== 'active' ? '#A6A6A6' : '#EAAE19',
                              textAlign: 'left',
                              cursor: user.status !== 'active' ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => {
                              handleDeactivateUser(user);
                              setActionMenuUserId(null);
                            }}
                            disabled={user.status !== 'active'}
                          >
                            Hủy kích hoạt
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Previous Page Button */}
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                border: '0.75px solid #E6E6E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              
              {/* Page Numbers */}
              {[1, 2, 3, 4, 5].map(page => (
                <div 
                  key={page}
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: page === 1 ? '#C6E76D' : 'transparent',
                    color: page === 1 ? '#1A1A1A' : '#737373',
                    fontWeight: page === 1 ? 500 : 400,
                    fontSize: 14
                  }}
                >
                  {page}
                </div>
              ))}
              
              {/* Next Page Button */}
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                border: '0.75px solid #E6E6E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement; 