import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import axios from 'axios';
import { useJwt } from "./UserStore";
import Cookies from 'js-cookie';

function Navbar() {
    const [isNavbarShowing, setNavbarShowing] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [location] = useLocation();
    const { jwt } = useJwt();
    // Toggle the collapse state
    const toggleNavbar = () => {
        setNavbarShowing(prevState => !prevState);
    };


    // Sync the collapse state with screen size
    useEffect(() => {
        const syncNavbarState = () => {
            setNavbarShowing(window.innerWidth >= 992);
        };

        syncNavbarState(); // Run on mount to set the initial state

        // Listen for window resize events
        window.addEventListener('resize', syncNavbarState);

        // Cleanup the listener on unmount
        return () => window.removeEventListener('resize', syncNavbarState);
    }, []);

    // Check the login status by verifying the JWT cookie on every mount
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true }); // Ensure credentials are included
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };

        checkLoginStatus();
    }, [jwt]);


    const handleLogout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                setIsLoggedIn(false); // Update login status
                window.location.href = '/'; // Redirect after logout
            } else {
                console.log("error in else block", response.status);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <nav className="navbar navbar-expand-lg palestine-green">
            <div className="container">
                <Link className="navbar-brand text-white" href="#">
                    MPWU
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className={`collapse navbar-collapse ${isNavbarShowing ? "show" : ""}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location === '/' ? 'active' : ''}`} href="/">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/campaigns" className={`nav-link ${location === '/campaigns' ? 'active' : ''}`}>Campaigns</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/register" className={`nav-link ${location === '/register' ? 'active' : ''}`}>Register</Link>
                        </li>

                        {/* Conditionally render Login or Logout based on JWT existence */}
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <Link
                                    href="#"
                                    onClick={handleLogout}
                                    className={`nav-link ${location === '/' ? 'active' : ''}`}>
                                    Logout
                                </Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    href="/login"
                                    className={`nav-link ${location === '/login' ? 'active' : ''}`}>
                                    Login
                                </Link>
                            </li>
                        )}


                        <li className="nav-item">
                            <Link href="/donate" className={`nav-link ${location === '/donate' ? 'active' : ''}`}>Donate</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/cart" className={`nav-link ${location === '/cart' ? 'active' : ''}`}>
                                Cart
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
