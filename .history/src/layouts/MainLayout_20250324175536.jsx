import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ToRegister from '../components/ToRegister';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
