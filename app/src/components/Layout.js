import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css'; // Import the CSS file for styling

const Layout = ({ children, isAuthenticated, onLogout }) => {

    const navigate = useNavigate();

    const handleClickSignIn = () => {
        navigate('/login');
    };

    const handleClickSignUp = () => {
        navigate('/register');
    };

    function handleClickLogout() {
        localStorage.removeItem('token');
        onLogout();
        console.log('Logout successfull');
        // Redirect to a login page
        navigate('/login');
    };

    return (
        <div className="layout">
            <header>
                <nav>
                    <div className="left-links">
                        <Link to="/">Home</Link>
                        {isAuthenticated && <Link to="/profile">Profile</Link>}
                        {isAuthenticated && <Link to="/properties">My Properties</Link>}
                    </div>
                    <div className="right-button">
                        {!isAuthenticated && <button onClick={handleClickSignIn}>Sign-in</button>}
                        {!isAuthenticated && <button onClick={handleClickSignUp}>Sign-up</button>}
                        {isAuthenticated && <button onClick={handleClickLogout}>Logout</button>}
                    </div>
                </nav>
            </header>
            <main>
                {children} {/* Render the content of each page */}
            </main>
            <footer>
                <p>&copy; 2023 My Website. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;
