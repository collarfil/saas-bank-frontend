import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, tenantId } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = tenantId
      ? `/login/${encodeURIComponent(tenantId)}`
      : "/login";

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
