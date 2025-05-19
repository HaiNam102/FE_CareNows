import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Import components
import AdminHome from './pages/Home/AdminHome';
import AccountManagement from './pages/Home/AccountManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminHome />} />
      <Route path="/admin/accounts" element={<AccountManagement />} />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 