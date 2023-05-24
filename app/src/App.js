import React from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import PropertyPage from './components/PropertyPage';
import SuccessPage from './components/SuccessPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (typeof token === 'string' && token.trim() !== '') {
    console.log('Token is valid');
    return true;
  }
  console.log('Token is not valid');
  return false;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/properties"
          element={isAuthenticated() ? <PropertyPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
