import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }).toString(),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token)
                console.log('Login successful:', data);
                onLogin();
                navigate('/profile');
            } else {
                console.log('Registration failed:', response.statusText);
                // Handle registration failure, display error message, etc.
            }
        } catch (error) {
            console.log('Error during registration:', error.message);
            // Handle error during registration
        }
        // Reset form fields
        setUsername('');
        setPassword('');
    };
    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-header">Sign-in</h1>
                <form className="login-form" onSubmit={handleSubmit}>
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
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
