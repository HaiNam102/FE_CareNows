import React from 'react';

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Đây là trang chủ dành cho Admin
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với trang quản trị CareNow. Tại đây bạn có thể quản lý người dùng và nội dung hệ thống.
        </p>
      </div>
    </div>
  );
};

export default AdminHome; 