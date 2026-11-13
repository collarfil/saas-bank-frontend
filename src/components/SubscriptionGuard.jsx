import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { subscriptionApi } from "../api/subscriptionApi";

const SubscriptionGuard = () => {
  const [isActive, setIsActive] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkSub = async () => {
      try {
        const res = await subscriptionApi.getAll();
        const subs = Array.isArray(res.data) ? res.data : [];
        const activeSub = subs.find((s) => s.isActive);
        setIsActive(!!activeSub);
      } catch (error) {
        // If the API fails, assume inactive to be safe
        setIsActive(false);
      }
    };
    checkSub();
  }, [location.pathname]); // Re-check on navigation

  if (isActive === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Verifying subscription status...</p>
      </div>
    );
  }

  // If no active sub, redirect to the subscriptions page
  if (!isActive && location.pathname !== "/bank/subscriptions") {
    return <Navigate to="/bank/subscriptions" replace />;
  }

  return <Outlet />;
};

export default SubscriptionGuard;
