import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const BankLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { hasRole } = useAuth();

  const allMenuItems = [
    { path: "/bank", name: "Dashboard", icon: "🏠" },
    {
      name: "Customers",
      icon: "👥",
      path: "#",
      children: [
        { path: "/bank/customers", name: "All Customers", icon: "👤" },
        // Addresses is Admin only, we will filter it below
        {
          path: "/bank/customer-addresses",
          name: "Addresses",
          icon: "📍",
          adminOnly: true,
        },
        { path: "/bank/customer-kyc", name: "KYC Documents", icon: "📋" },
      ],
    },
    {
      name: "Accounts",
      icon: "💳",
      path: "#",
      children: [
        { path: "/bank/accounts", name: "All Accounts", icon: "🏦" },
        {
          path: "/bank/account-types",
          name: "Account Types",
          icon: "📑",
          adminOnly: true,
        },
      ],
    },
    { path: "/bank/employees", name: "Employees", icon: "👔", adminOnly: true },
    { path: "/bank/branches", name: "Branches", icon: "🏢", adminOnly: true },
    {
      path: "/bank/departments",
      name: "Departments",
      icon: "🏬",
      adminOnly: true,
    },
    {
      name: "Loans",
      icon: "💰",
      path: "#",
      children: [
        { path: "/bank/loans", name: "All Loans", icon: "📝" },
        {
          path: "/bank/loan-products",
          name: "Loan Products",
          icon: "📦",
          adminOnly: true,
        },
        {
          path: "/bank/loan-repayments",
          name: "Loan Repayments",
          icon: "💵",
          adminOnly: true,
        },
      ],
    },
    { path: "/bank/transactions", name: "Transactions", icon: "💸" },
    { path: "/bank/ledger", name: "Ledger", icon: "📒" },
    { path: "/bank/payments", name: "Payments", icon: "💳" },
    {
      path: "/bank/subscriptions",
      name: "Subscriptions",
      icon: "💳",
      adminOnly: true,
    },
  ];

  // 1. Filter out top-level admin only routes
  // 2. Filter out children that are admin only
  const menuItems = allMenuItems
    .map((item) => {
      if (item.adminOnly && !hasRole("TenantAdmin")) return null;

      if (item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (child.adminOnly && !hasRole("TenantAdmin")) return false;
          return true;
        });
        return { ...item, children: filteredChildren };
      }

      return item;
    })
    .filter(Boolean); // Remove any null items

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
