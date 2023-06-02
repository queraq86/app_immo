import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          username: username,
          password: password,
        }).toString(),
      });
      if (response.ok) {
        console.log('Registration successful');
        navigate('/success');
      } else {
        console.log('Registration failed:', response.statusText);
        // Handle registration failure, display error message, etc.
      }
    } catch (error) {
      console.log('Error during registration:', error.message);
      // Handle error during registration
    }
    // Reset form fields
    setEmail('');
    setUsername('');
    setPassword('');
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Sign-up</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
