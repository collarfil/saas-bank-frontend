// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:44391/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const skipTenant = config.__skipTenant === true;
    delete config.__skipTenant;

    if (skipTenant) {
      delete config.headers["__tenant__"];
    } else if (!config.headers["__tenant__"]) {
      const tenantId = localStorage.getItem("tenantId");

      if (tenantId && tenantId !== "null" && tenantId !== "undefined") {
        config.headers["__tenant__"] = tenantId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register-super-admin");

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const tenantId = localStorage.getItem("tenantId");

      const loginPath = tenantId
        ? `/login/${encodeURIComponent(tenantId)}`
        : "/login";

      if (window.location.pathname !== loginPath) {
        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
