// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, role }) => {
    const adminMenuItems = [
        { path: '/admin/tenants', name: 'Tenants', icon: '🏢' },
        { path: '/admin/reports', name: 'Reports', icon: '📊' },
        { path: '/admin/settings', name: 'Settings', icon: '⚙️' }
    ];

    const bankMenuItems = [
        { path: '/bank/customers', name: 'Customers', icon: '👥' },
        { path: '/bank/customer-addresses', name: 'Addresses', icon: '📍' },
        { path: '/bank/customer-kyc', name: 'KYC Records', icon: '📋' },
        { path: '/bank/accounts', name: 'Accounts', icon: '💳' },
        { path: '/bank/transactions', name: 'Transactions', icon: '💸' },
        { path: '/bank/loans', name: 'Loans', icon: '💰' },
        { path: '/bank/ledger', name: 'General Ledger', icon: '📒' },
        { path: '/bank/payments', name: 'Payments', icon: '💳' },
        { path: '/bank/reports', name: 'Reports', icon: '📊' },
        { path: '/bank/settings', name: 'Settings', icon: '⚙️' }
    ];

    const generalMenuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: '🏠' },
        { path: '/my-accounts', name: 'My Accounts', icon: '💳' },
        { path: '/transactions', name: 'Transactions', icon: '💸' },
        { path: '/loan-application', name: 'Apply for Loan', icon: '💰' },
        { path: '/my-loans', name: 'My Loans', icon: '📋' },
        { path: '/profile', name: 'Profile', icon: '👤' }
    ];

    let menuItems = [];
    if (role === 'admin') menuItems = adminMenuItems;
    else if (role === 'bank') menuItems = bankMenuItems;
    else menuItems = generalMenuItems;

    return (
        <div className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-4">
                <div className={`text-center ${!isOpen && 'hidden'}`}>
                    <h2 className="text-xl font-bold">SaaS MF</h2>
                    <p className="text-xs text-gray-400">Micro Finance System</p>
                </div>
                <div className={`text-center ${isOpen && 'hidden'}`}>
                    <span className="text-2xl">🏦</span>
                </div>
            </div>
            
            <nav className="mt-8">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm transition-colors ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            } ${!isOpen && 'justify-center'}`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.name}</span>}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;