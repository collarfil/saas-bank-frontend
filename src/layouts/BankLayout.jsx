import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const BankLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/bank/dashboard', name: 'Dashboard', icon: '🏠' },
        { path: '/bank/customers', name: 'Customers', icon: '👥' },
        { path: '/bank/customer-kyc', name: 'Customer KYC', icon: '📋' },
        { path: '/bank/accounts', name: 'Accounts', icon: '💳' },
        { path: '/bank/transactions', name: 'Transactions', icon: '💸' },
        { path: '/bank/loans', name: 'Loans', icon: '💰' },
        { path: '/bank/loan-products', name: 'Loan Products', icon: '📦' },
        { path: '/bank/employees', name: 'Employees', icon: '👔' },
        { path: '/bank/settings', name: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                isOpen={sidebarOpen} 
                menuItems={menuItems}
                role="bank"
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    userRole="Bank Admin"
                />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BankLayout;