import React from "react";
import "./App.css";
import Login from "./pages/Authen/Login";
import Header from "./layouts/Header";
import RegisterButton from "../src/components/HoverButton"; // Import nút đăng ký
import Footer from "./layouts/Footer";

const App = () => {
  return ( 
    <>
       <Header/>
       <Login/>  
       <Footer/>

       {/* <RegisterButton /> */}
    </>
  );
};

export default App;
