// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import BankLayout from "./layouts/BankLayout";
import GeneralLayout from "./layouts/GeneralLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";

// Admin Pages
import Tenants from "./pages/Admin/Tenants";

// Bank Pages
import Customers from "./pages/Bank/Customers";
import CustomerAddresses from "./pages/Bank/CustomerAddresses";
import CustomerKYC from "./pages/Bank/CustomerKYC";
import Accounts from "./pages/Bank/Accounts";
import Transactions from "./pages/Bank/Transactions";
import Loans from "./pages/Bank/Loans";
import Ledger from "./pages/Bank/Ledger";
import Payments from "./pages/Bank/Payments";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRoles = user.roles || [];

  if (allowedRoles && !allowedRoles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const userRoles = user.roles || [];

  // Determine default redirect based on auth status and role
  const getDefaultRedirect = () => {
    if (!isAuthenticated) return "/";
    if (userRoles.includes("SuperAdmin")) return "/admin";
    if (
      userRoles.includes("TenantAdmin") ||
      userRoles.includes("BranchManager")
    )
      return "/bank";
    return "/dashboard";
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/tenants" />} />
          <Route path="tenants" element={<Tenants />} />
          <Route
            path="dashboard"
            element={
              <div className="text-center py-20">
                Admin Dashboard - Overview
              </div>
            }
          />
        </Route>

        {/* Bank Routes */}
        <Route
          path="/bank"
          element={
            <ProtectedRoute
              allowedRoles={[
                "TenantAdmin",
                "BranchManager",
                "LoanOfficer",
                "Teller",
              ]}
            >
              <BankLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/bank/customers" />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customer-addresses" element={<CustomerAddresses />} />
          <Route path="customer-kyc" element={<CustomerKYC />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="loans" element={<Loans />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <GeneralLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="text-center py-20">
                Customer Dashboard - Coming Soon
              </div>
            }
          />
          <Route
            path="my-accounts"
            element={
              <div className="text-center py-20">My Accounts - Coming Soon</div>
            }
          />
          <Route
            path="transactions"
            element={
              <div className="text-center py-20">
                Transactions - Coming Soon
              </div>
            }
          />
          <Route
            path="loan-application"
            element={
              <div className="text-center py-20">
                Loan Application - Coming Soon
              </div>
            }
          />
          <Route
            path="my-loans"
            element={
              <div className="text-center py-20">My Loans - Coming Soon</div>
            }
          />
          <Route
            path="profile"
            element={
              <div className="text-center py-20">Profile - Coming Soon</div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
