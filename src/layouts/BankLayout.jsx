import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const BankLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/bank", name: "Dashboard", icon: "🏠" },
    {
      name: "Customers",
      icon: "👥",
      path: "#",
      children: [
        { path: "/bank/customers", name: "All Customers", icon: "👤" },
        { path: "/bank/customer-addresses", name: "Addresses", icon: "📍" },
        { path: "/bank/customer-kyc", name: "KYC Documents", icon: "📋" },
      ],
    },
    {
      name: "Accounts",
      icon: "💳",
      path: "#",
      children: [
        { path: "/bank/accounts", name: "All Accounts", icon: "🏦" },
        { path: "/bank/account-types", name: "Account Types", icon: "📑" },
      ],
    },
    { path: "/bank/employees", name: "Employees", icon: "👔" },
    { path: "/bank/branches", name: "Branches", icon: "🏢" },
    { path: "/bank/departments", name: "Departments", icon: "🏬" },
    {
      name: "Loans",
      icon: "💰",
      path: "#",
      children: [
        { path: "/bank/loans", name: "All Loans", icon: "📝" },
        { path: "/bank/loan-products", name: "Loan Products", icon: "📦" },
        { path: "/bank/loan-repayments", name: "Loan Repayments", icon: "💵" },
      ],
    },
    { path: "/bank/transactions", name: "Transactions", icon: "💸" },
    { path: "/bank/ledger", name: "Ledger", icon: "📒" },
    { path: "/bank/payments", name: "Payments", icon: "💳" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} menuItems={menuItems} role="bank" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen((previous) => !previous)} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BankLayout;
