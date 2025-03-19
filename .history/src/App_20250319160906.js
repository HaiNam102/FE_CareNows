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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignUpRoleSelection from './pages/Authen/SignUp/SignUpRoleSelection';
import SignUpClient from './pages/Authen/SignUp/SignUpClient';
import SignUpCareTaker from './pages/Authen/SignUp/SignUpCareTaker';
// import About from './pages/About';
// import Contact from './pages/Contact';
import MainLayout from './layouts/MainLayout';
import Login1 from './pages/Authen/Login/Login1';
import Login from './pages/Authen/Login/Login';
import Signup from './pages/Authen/SignUp/SignUp';
import AdminHome from './pages/Admin/AdminHome';
import CaretakerHome from './pages/Caretaker/CaretakerHome';
import CustomerHome from './pages/Customer/CustomerHome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        
        {/* Caretaker Routes */}
        <Route path="/caretaker/home" element={<CaretakerHome />} />
        
        {/* Customer Routes */}
        <Route path="/customer/home" element={<CustomerHome />} />
        
        {/* Default Route */}
        <Route path="/" element={<Home />} />
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