import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import PropertyPage from './components/PropertyPage';
import SuccessPage from './components/SuccessPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import Layout from './components/Layout';


function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const handleLogin = () => {
    // Perform login logic here
    setUserAuthenticated(true);
  };

  const handleLogout = () => {
    // Perform logout logic here
    setUserAuthenticated(false);
  };

  return (
    <Router>
      <Layout isAuthenticated={userAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/properties"
            element={userAuthenticated ? (<PropertyPage />) : (<LoginPage onLogin={handleLogin} />)}
          />
          <Route
            path="/profile"
            element={userAuthenticated ? (<ProfilePage />) : (<LoginPage onLogin={handleLogin} />)}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
