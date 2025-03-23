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
// import About from './pages/About';
// import Contact from './pages/Contact';
import MainLayout from './layouts/MainLayout';
import Login1 from './pages/Authen/Login/Login1';
import AdminHome from './pages/Home/AdminHome';
import CareTakerHome from './pages/Home/CareTakerHome';
import CustomerHome from './pages/Home/CustomerHome';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export function App() {
  // Thêm vào file cấu hình axios hoặc trước khi gọi API
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

// Wrap App component
<ErrorBoundary>
  <App />
</ErrorBoundary>



{/* <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
  <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
</Routes> */}

export default App;