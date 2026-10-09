import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: '🏠' },
        { path: '/admin/tenants', name: 'Tenants', icon: '🏢' },
        { path: '/admin/reports', name: 'Reports', icon: '📊' },
        { path: '/admin/settings', name: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                isOpen={sidebarOpen} 
                menuItems={menuItems}
                role="admin"
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    userRole="Super Admin"
                />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;