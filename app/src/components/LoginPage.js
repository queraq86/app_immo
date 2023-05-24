import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
                // Redirect to a success page
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
        <div className="container mt-5">
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
