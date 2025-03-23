// import React from "react";
// import "./App.css";
// import Login from "./pages/Authen/Login";
// import Header from "./layouts/Header";
// import RegisterButton from "../src/components/HoverButton"; // Import nút đăng ký
// import Footer from "./layouts/Footer";
// import HeroSection from "./layouts/HeroSection";

// const App = () => {
//   return ( 
//     <>
//        <Header/>
//        {/* <Login/>   */}
//        <HeroSection/>
//        <Footer/>

//        {/* <RegisterButton /> */}
//     </>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignUpRoleSelection from './pages/Authen/SignUp/SignUpRoleSelection';
import SignUpClient from './pages/Authen/SignUp/SignUpClient';
import SignUpCareTaker from './pages/Authen/SignUp/SignUpCareTaker';
import CustomerHome from './pages/Home/CustomerHome';
import CareTakerHome from './pages/Home/CareTakerHome';
import AdminHome from './pages/Home/AdminHome';
import Login from './pages/Authen/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/*" element={/* ... signup routes ... */} />

        {/* Protected routes */}
        <Route 
          path="/customer/home" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/caretaker/home" 
          element={
            <ProtectedRoute allowedRoles={['CARE_TAKER']}>
              <CareTakerHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/home" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminHome />
            </ProtectedRoute>
          } 
        />

        {/* Redirect unauthorized access to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;



{/* <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
  <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
</Routes> */}
