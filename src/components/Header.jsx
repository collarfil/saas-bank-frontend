import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_LABELS = {
  SuperAdmin: "Super Administrator",
  TenantAdmin: "Bank Administrator",
  BranchManager: "Branch Manager",
  LoanOfficer: "Loan Officer",
  Teller: "Teller",
  Customer: "Customer",
};

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, tenantId, logout } = useAuth();

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || user?.email || "User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    fullName.charAt(0).toUpperCase();

  const roles = user?.roles || [];
  const roleName = roles.length ? ROLE_LABELS[roles[0]] || roles[0] : "User";

  const handleLogout = () => {
    const isSuperAdmin = roles.includes("SuperAdmin");
    const loginPath =
      !isSuperAdmin && tenantId
        ? `/login/${encodeURIComponent(tenantId)}`
        : "/login";

    logout();
    navigate(loginPath, { replace: true });
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-gray-800 sm:text-xl">
              SaaS Micro Finance
            </h1>

            {tenantId && (
              <p className="truncate text-xs text-gray-500">
                Tenant: {tenantId}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-800">{fullName}</p>
            <p className="text-xs text-gray-500">{roleName}</p>
          </div>

          <div
            title={fullName}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
          >
            {initials}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
