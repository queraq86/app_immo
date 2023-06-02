import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    function handleClick() {
        localStorage.removeItem('token');
        console.log('Logout successfull');
        // Redirect to a login page
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <h2>Logout Page</h2>
            <button onClick={handleClick}>
                Logout
            </button>
        </div>
    );
};

export default LogoutPage;
