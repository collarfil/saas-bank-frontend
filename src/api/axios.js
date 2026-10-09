// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44391/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - Add token and tenant ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenantId = localStorage.getItem("tenantId");

    if (tenantId && tenantId !== "null" && tenantId !== "undefined") {
      config.headers["__tenant__"] = tenantId; // ✅ FIXED
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default api;
