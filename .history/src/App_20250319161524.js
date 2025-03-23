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
import AdminHome from './pages/Home/AdminHome';
import CareTakerHome from './pages/Home/CareTakerHome';
import CustomerHome from './pages/Home/CustomerHome';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/signup" element={<MainLayout headerType="logoOnly"><SignUpRoleSelection/></MainLayout>} />\
        <Route path="/signup-client" element={<MainLayout headerType="logoOnly"><SignUpClient/></MainLayout>} />
        <Route path="/signup-care-taker" element={<MainLayout headerType="logoOnly"><SignUpCareTaker/></MainLayout>} />
        <Route path="/caretaker/home" element={<MainLayout ><CareTakerHome/></MainLayout>} />
        <Route path="/customer/home" element={<MainLayout ><CustomerHome/></MainLayout>} />
        <Route path="/admin/home" element={<MainLayout ><Ad/></MainLayout>} />
          {/* <Route path="/contact" element={<Contact />} /> */}
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