import React from 'react';
import './App.css';
import ProfileCards from './components/ProfileCards/ProfileCards';
import Header from './layouts/Header/Header';
import CareService from './components/CareService/CareService';
import Login from './pages/Authenticate/Login/Login';
import Register from './pages/Authenticate/Register/Register';

function App() {
  return (
    <div className="App">
      {/* <ProfileCards /> */}
      <Header />

      {/* <CareService /> */}

      <Login/>
    
      {/* <Register/> */}

    </div>
  );
}

export default App;