import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Login1 from './pages/Authen/Login/Login1';
import SignUpRoleSelection from './pages/Authen/SignUp/SignUpRoleSelection';
import SignUpClient from './pages/Authen/SignUp/SignUpClient';
import SignUpCareTaker from './pages/Authen/SignUp/SignUpCareTaker';
import AdminHome from './pages/Home/AdminHome';
import CareTakerHome from './pages/Home/CareTakerHome';
import CustomerHome from './pages/Home/CustomerHome';
import SearchResult from './pages/SearchResult/SearchResult';
import Calendar from './components/Calendar';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ReviewsSection from './pages/ProfilePage/ReviewsSection';
import { jwtDecode } from 'jwt-decode';

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = jwtDecode(token);
  if (decoded.role.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/signup" element={<MainLayout headerType="logoOnly"><SignUpRoleSelection/></MainLayout>} />
        <Route path="/signup-client" element={<MainLayout headerType="logoOnly"><SignUpClient/></MainLayout>} />
        <Route path="/signup-care-taker" element={<MainLayout headerType="logoOnly"><SignUpCareTaker/></MainLayout>} />
        
        {/* Protected Routes */}
        <Route 
          path="/caretaker/home" 
          element={
            <ProtectedRoute allowedRole="CARE_TAKER">
              <MainLayout><CareTakerHome/></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customer/home" 
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <MainLayout><CustomerHome/></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/home" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <MainLayout><AdminHome/></MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Other Routes */}
        <Route path="/searchResult" element={<MainLayout><SearchResult /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
        <Route path="/profilePage" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/ReviewsSection" element={<MainLayout><ReviewsSection /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;