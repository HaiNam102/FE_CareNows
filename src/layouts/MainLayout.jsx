import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ToRegister from '../components/ToRegister';
import Home from '../pages/Home/Home';



const MainLayout = ({ children }) => {
  return (

    <>
    <Header />
      <div className="container">{children}</div>
     {/* <div><ToRegister/></div>   */}
    <Footer />
    </>
    // <div className="main-layout">
      
    // </div>
  );
};

export default MainLayout;
