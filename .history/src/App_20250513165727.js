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
import ProfileCustomer from './pages/ManageService/Customer/ProfileCustomer';
import BookingHistory from './pages/ManageService/Customer/BookingHistory';
import MedicalRecords from './pages/ManageService/Customer/MedicalRecords';
import { jwtDecode } from 'jwt-decode';
import ProfileLayout from './layouts/ProfileLayout/ProfileLayout';
import CareTakerPage from './pages/CareTaker';
import AddFeetback from './pages/ManageService/Customer/AddFeetback';
import FloatingChatButton from './pages/Chat/FloatingChatButton';
import ChatWidget from './pages/Chat/ChatWidget';
import { ChatProvider } from './contexts/ChatContext';

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
    <ChatProvider>
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
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminHome/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/profile" 
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <ProfileCustomer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/booking-history" 
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <BookingHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/medical-records" 
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <MedicalRecords />
              </ProtectedRoute>
            } 
          />
          
          {/* Other Routes */}
          <Route path="/searchResult" element={<MainLayout><SearchResult /></MainLayout>} />
          <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
          <Route path="/profilePage" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/ReviewsSection" element={<MainLayout><ReviewsSection /></MainLayout>} />
          <Route path="/caretaker/appointments" element={<MainLayout><CareTakerPage /></MainLayout>} />
          <Route path="/feetback" element={<AddFeetback />} />
          <Route path="/chat" element={<ChatWidget />} />
        </Routes>
        <FloatingChatButton />
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;