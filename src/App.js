import React from 'react';
import './App.css';
import ProfileCards from './components/ProfileCards/ProfileCards';
import Header from './layouts/Header/Header';
import CareService from './components/CareService/CareService';

function App() {
  return (
    <div className="App">
      {/* <ProfileCards /> */}
      <Header />

      <CareService />
    </div>
  );
}

export default App;