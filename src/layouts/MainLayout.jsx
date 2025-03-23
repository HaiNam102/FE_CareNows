import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ToRegister from '../components/ToRegister';

const MainLayout = ({ children }) => {
  return (
    <>
    <Header />
      <div className="container">{children}</div>
    <Footer />
    </>
  );
};

export default MainLayout;
