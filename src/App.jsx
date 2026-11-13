import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext"; // Fixed duplicate import
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionGuard from "./components/SubscriptionGuard";

import GeneralLayout from "./layouts/GeneralLayout";
import AdminLayout from "./layouts/AdminLayout";
import BankLayout from "./layouts/BankLayout";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";

// Admin pages
import Tenants from "./pages/Admin/Tenants";
import AdminDashboard from "./pages/Admin/Dashboard";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

// Bank pages
import TenantDashboard from "./pages/Bank/TenantDashboard";
import EmployeeDashboard from "./pages/Bank/EmployeeDashboard";
import Customers from "./pages/Bank/Customers";
import CustomerAddresses from "./pages/Bank/CustomerAddresses";
import CustomerKYC from "./pages/Bank/CustomerKYC";
import Accounts from "./pages/Bank/Accounts";
import Transactions from "./pages/Bank/Transactions";
import Loans from "./pages/Bank/Loans";
import Ledger from "./pages/Bank/Ledger";
import Payments from "./pages/Bank/Payments";
import LoanProducts from "./pages/Bank/LoanProducts";
import Employees from "./pages/Bank/Employees";
import Branches from "./pages/Bank/Branches";
import Departments from "./pages/Bank/Departments";
import Subscriptions from "./pages/Bank/Subscriptions";

// Customer Pages
import CustomerDashboard from "./pages/Customer/Dashboard";
import MyAccounts from "./pages/Customer/MyAccounts";
import MyTransactions from "./pages/Customer/MyTransactions";
import ApplyLoan from "./pages/Customer/ApplyLoan";
import MyLoans from "./pages/Customer/MyLoans";
import Profile from "./pages/Customer/Profile";

// Placeholders
const AccountTypes = () => <div>Account Types - Coming Soon</div>;
const LoanRepayments = () => <div>Loan Repayments - Coming Soon</div>;

// Role Arrays
const BANK_ADMIN_ROLES = ["TenantAdmin"];
const BANK_STAFF_ROLES = [
  "TenantAdmin",
  "BranchManager",
  "LoanOfficer",
  "Teller",
  "Staff",
  "Employee",
  "Jr Staff",
];

// Helper Component to pick the right Dashboard
const BankHome = () => {
  const { hasRole } = useAuth();
  return hasRole("TenantAdmin") ? <TenantDashboard /> : <EmployeeDashboard />;
};

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:tenant" element={<Login />} />

        {/* Super Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Bank Staff (All Roles) */}
        <Route element={<ProtectedRoute allowedRoles={BANK_STAFF_ROLES} />}>
          <Route path="/bank" element={<BankLayout />}>
            <Route element={<SubscriptionGuard />}>
              {/* Dashboard routes to Employee or Tenant Admin automatically */}
              <Route index element={<BankHome />} />

              {/* Shared Routes */}
              <Route path="customers" element={<Customers />} />
              <Route path="customer-kyc" element={<CustomerKYC />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="loans" element={<Loans />} />
              <Route path="ledger" element={<Ledger />} />
              <Route path="payments" element={<Payments />} />

              {/* ADMIN ONLY ROUTES */}
              <Route
                element={<ProtectedRoute allowedRoles={BANK_ADMIN_ROLES} />}
              >
                <Route
                  path="customer-addresses"
                  element={<CustomerAddresses />}
                />
                <Route path="account-types" element={<AccountTypes />} />
                <Route path="employees" element={<Employees />} />
                <Route path="branches" element={<Branches />} />
                <Route path="departments" element={<Departments />} />
                <Route path="loan-products" element={<LoanProducts />} />
                <Route path="loan-repayments" element={<LoanRepayments />} />
              </Route>
            </Route>

            {/* Subscriptions (Admin Only, Outside Subscription Guard) */}
            <Route element={<ProtectedRoute allowedRoles={BANK_ADMIN_ROLES} />}>
              <Route path="subscriptions" element={<Subscriptions />} />
            </Route>
          </Route>
        </Route>

        {/* Customer Portal */}
        <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
          <Route path="/dashboard" element={<GeneralLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="my-accounts" element={<MyAccounts />} />
            <Route path="transactions" element={<MyTransactions />} />
            <Route path="loan-application" element={<ApplyLoan />} />
            <Route path="my-loans" element={<MyLoans />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<div>Access denied.</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
