import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import MainLayout from './layouts/MainLayout';
import Login1 from './pages/Authen/Login/Login1';
import SearchResult from './pages/SearchResult/SearchResult';
import Calendar from './components/Calendar';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Router>
        <Routes> 
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/searchResult" element={<MainLayout><SearchResult /></MainLayout>} />
        {/* <Route path="/timepicker" element={<MainLayout><DateRangePickerDisabledDatesExample/></MainLayout>} /> */}
        <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} /> 
        <Route path="/profilePage" element={<MainLayout><ProfilePage /></MainLayout>} />
        </Routes>
    </Router> 
  ); 
} 

export default App;