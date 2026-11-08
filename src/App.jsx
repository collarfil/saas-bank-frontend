import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import GeneralLayout from "./layouts/GeneralLayout";
import AdminLayout from "./layouts/AdminLayout";
import BankLayout from "./layouts/BankLayout";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";

// Admin pages
import Tenants from "./pages/Admin/Tenants";

// Bank pages
import TenantDashboard from "./pages/Bank/TenantDashboard";
import Customers from "./pages/Bank/Customers";
import CustomerAddresses from "./pages/Bank/CustomerAddresses";
import CustomerKYC from "./pages/Bank/CustomerKYC";
import Accounts from "./pages/Bank/Accounts";
import Transactions from "./pages/Bank/Transactions";
import Loans from "./pages/Bank/Loans";
import Ledger from "./pages/Bank/Ledger";
import Payments from "./pages/Bank/Payments";
import LoanProducts from "./pages/Bank/LoanProducts";

// ✅ Real pages we have built
import Employees from "./pages/Bank/Employees";
import Branches from "./pages/Bank/Branches";
import Departments from "./pages/Bank/Departments";

// 🛑 Placeholders for pages we haven't built yet
const AccountTypes = () => <div>Account Types - Coming Soon</div>;
//const LoanProducts = () => <div>Loan Products - Coming Soon</div>;
const LoanRepayments = () => <div>Loan Repayments - Coming Soon</div>;

const BANK_ROLES = ["TenantAdmin", "BranchManager", "LoanOfficer", "Teller"];

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:tenant" element={<Login />} />

        {/* Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Admin Dashboard</div>} />
            <Route path="tenants" element={<Tenants />} />
          </Route>
        </Route>

        {/* Bank Staff */}
        <Route element={<ProtectedRoute allowedRoles={BANK_ROLES} />}>
          <Route path="/bank" element={<BankLayout />}>
            <Route index element={<TenantDashboard />} />

            {/* Customers */}
            <Route path="customers" element={<Customers />} />
            <Route path="customer-addresses" element={<CustomerAddresses />} />
            <Route path="customer-kyc" element={<CustomerKYC />} />

            {/* Accounts */}
            <Route path="accounts" element={<Accounts />} />
            <Route path="account-types" element={<AccountTypes />} />

            {/* HR & Admin */}
            <Route path="employees" element={<Employees />} />
            <Route path="branches" element={<Branches />} />
            <Route path="departments" element={<Departments />} />

            {/* Loans */}
            <Route path="loans" element={<Loans />} />
            <Route path="loan-products" element={<LoanProducts />} />
            <Route path="loan-repayments" element={<LoanRepayments />} />

            {/* Operations */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>

        {/* Customer */}
        <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
          <Route path="/dashboard" element={<GeneralLayout />}>
            <Route index element={<div>Customer Dashboard</div>} />
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
