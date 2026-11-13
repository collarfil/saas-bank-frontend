import React from "react";
import { useAuth } from "../context/AuthContext";

const RoleBasedDashboard = ({ adminComponent, staffComponent }) => {
  const { hasRole } = useAuth();

  if (hasRole("TenantAdmin")) {
    return adminComponent;
  }

  return staffComponent;
};

export default RoleBasedDashboard;
