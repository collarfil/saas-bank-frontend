import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const GeneralLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: '🏠' },
        { path: '/my-accounts', name: 'My Accounts', icon: '💳' },
        { path: '/transactions', name: 'Transactions', icon: '💸' },
        { path: '/loan-application', name: 'Apply for Loan', icon: '💰' },
        { path: '/my-loans', name: 'My Loans', icon: '📋' },
        { path: '/profile', name: 'Profile', icon: '👤' }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                isOpen={sidebarOpen} 
                menuItems={menuItems}
                role="general"
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    userRole="Customer"
                />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default GeneralLayout;