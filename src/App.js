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
// import About from './pages/About';
// import Contact from './pages/Contact';
import MainLayout from './layouts/MainLayout';
import Login1 from './pages/Authen/Login/Login1';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<Login1 />} />
          {/* <Route path="/about" element={<About />} /> */}
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
