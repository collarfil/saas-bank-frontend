// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, userRole }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">SaaS Micro Finance</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative">
                        <button className="flex items-center space-x-2 text-gray-700">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <span className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;