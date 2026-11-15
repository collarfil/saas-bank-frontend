import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const BankLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { hasRole } = useAuth();

  // Full menu — each item declares which roles can SEE it.
  // Leaving `roles` undefined means "everyone in /bank" (Teller, BranchManager, etc.)
  const allMenuItems = [
    {
      path: "/bank/customers",
      name: "Customers",
      icon: "👥",
      roles: [
        "TenantAdmin",
        "BranchManager",
        "Teller",
        "RelationshipManager",
        "CreditAnalyst",
        "LoanOfficer",
      ],
    },
    {
      path: "/bank/customer-addresses",
      name: "Customer Addresses",
      icon: "📍",
      roles: ["TenantAdmin", "BranchManager", "Teller", "RelationshipManager"],
    },
    {
      path: "/bank/customer-kyc",
      name: "Customer KYC",
      icon: "📋",
      roles: [
        "TenantAdmin",
        "BranchManager",
        "Teller",
        "ComplianceOfficer",
        "RelationshipManager",
      ],
    },
    {
      path: "/bank/accounts",
      name: "Accounts",
      icon: "💳",
      roles: ["TenantAdmin", "BranchManager", "Teller", "RelationshipManager"],
    },
    {
      path: "/bank/transactions",
      name: "Transactions",
      icon: "💸",
      roles: [
        "TenantAdmin",
        "BranchManager",
        "Teller",
        "LoanOpsOfficer",
        "SettlementOfficer",
      ],
    },
    {
      path: "/bank/loans",
      name: "Loans",
      icon: "💰",
      roles: [
        "TenantAdmin",
        "BranchManager",
        "LoanOfficer",
        "CreditAnalyst",
        "CreditRiskOfficer",
        "LoanOpsOfficer",
        "DisbursementOfficer",
      ],
    },
    {
      path: "/bank/ledger",
      name: "Ledger",
      icon: "📒",
      roles: ["TenantAdmin", "GLAccountant", "CFO", "InternalAuditor"],
    },
    {
      path: "/bank/payments",
      name: "Payments",
      icon: "💵",
      roles: [
        "TenantAdmin",
        "BranchManager",
        "TreasuryOfficer",
        "SettlementOfficer",
      ],
    },
    {
      path: "/bank/gl-accounts",
      name: "GL Accounts",
      icon: "📊",
      roles: ["TenantAdmin", "GLAccountant", "CFO", "InternalAuditor"],
    },
    {
      path: "/bank/journal-entries",
      name: "Journal Entries",
      icon: "📓",
      roles: ["TenantAdmin", "GLAccountant", "CFO", "InternalAuditor"],
    },
    {
      path: "/bank/employees",
      name: "Employees",
      icon: "👤",
      roles: ["TenantAdmin", "BranchManager", "SystemAdmin"],
    },
    {
      path: "/bank/wallets",
      name: "Wallets",
      icon: "💰",
      roles: ["TenantAdmin", "BranchManager", "TreasuryOfficer"],
    },
    {
      path: "/bank/notifications",
      name: "Notifications",
      icon: "🔔",
      roles: ["TenantAdmin", "ComplianceOfficer", "FraudAnalyst"],
    },
    {
      path: "/bank/whatsapp",
      name: "WhatsApp",
      icon: "💬",
      roles: ["TenantAdmin", "RelationshipManager"],
    },
  ];

  // Filter: show an item only if its `roles` list contains at least one role the user has.
  const menuItems = allMenuItems.filter((item) => {
    if (!item.roles) return true; // no restriction = everyone
    return item.roles.some((r) => hasRole(r)); // user has at least one allowed role
  });

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
