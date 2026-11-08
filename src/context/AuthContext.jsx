import React, { createContext, useContext, useState } from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [tenantId, setTenantId] = useState(() =>
    localStorage.getItem("tenantId"),
  );

  const isAuthenticated = Boolean(token && user);
  const roles = user?.roles || [];

  const login = async (email, password, tenantIdentifier = null) => {
    const response = await api.post(
      "/auth/login",
      { email, password },
      {
        headers: tenantIdentifier ? { __tenant__: tenantIdentifier } : {},
        __skipTenant: !tenantIdentifier,
      },
    );

    const data = response.data;

    if (!data.success || !data.token || !data.user) {
      throw new Error(data.message || "Login failed.");
    }

    const authenticatedTenant = data.tenant?.identifier || "master";

    if (tenantIdentifier && authenticatedTenant !== tenantIdentifier) {
      throw new Error(
        "The authenticated tenant does not match the selected tenant.",
      );
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    if (authenticatedTenant === "master") {
      localStorage.removeItem("tenantId");
      setTenantId(null);
    } else {
      localStorage.setItem("tenantId", authenticatedTenant);
      setTenantId(authenticatedTenant);
    }

    return {
      user: data.user,
      tenant: data.tenant,
      roles: data.user.roles || [],
    };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const hasRole = (...allowedRoles) => {
    return allowedRoles.some((role) => roles.includes(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tenantId,
        roles,
        isAuthenticated,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
