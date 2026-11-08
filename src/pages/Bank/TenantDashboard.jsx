import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowPathIcon,
  BanknotesIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import dashboardApi from "../../api/dashboardApi";

import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import TransactionActivity from "../../components/dashboard/TransactionActivity";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

import { useAuth } from "../../context/AuthContext";

const firstDefined = (object, keys) => {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }

  return undefined;
};

const getStatus = (item) =>
  firstDefined(item, ["status", "Status", "accountStatus", "AccountStatus"]);

const isActiveStatus = (status) =>
  String(status ?? "").toLowerCase() === "active";

const isPendingStatus = (status) =>
  [
    "pending",
    "submitted",
    "under review",
    "in review",
    "awaiting review",
  ].includes(String(status ?? "").toLowerCase());

const getAmount = (account) => {
  const value = firstDefined(account, [
    "balance",
    "Balance",
    "availableBalance",
    "AvailableBalance",
  ]);

  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getDisplayName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return fullName || user?.email || "Bank Staff";
};

const MetricUnavailable = ({ label }) => (
  <span className="text-xs text-amber-700">{label} data unavailable</span>
);

const TenantDashboard = () => {
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await dashboardApi.getTenantOverview();

      setOverview(result);
      setLastUpdated(new Date());

      const failedSources = [
        result.customers,
        result.accounts,
        result.employees,
        result.kyc,
      ].filter((source) => !source.available);

      if (failedSources.length > 0) {
        toast.error(
          `${failedSources.length} dashboard data source(s) could not be loaded.`,
        );
      }
    } catch (error) {
      toast.error("Unable to load the tenant dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const customers = overview?.customers?.data ?? [];
    const accounts = overview?.accounts?.data ?? [];
    const employees = overview?.employees?.data ?? [];
    const kyc = overview?.kyc?.data ?? [];

    const accountStatusesKnown = accounts.some(
      (account) => getStatus(account) !== undefined,
    );

    const kycStatusesKnown = kyc.some(
      (record) => getStatus(record) !== undefined,
    );

    return {
      customerCount: overview?.customers?.available ? customers.length : null,

      accountCount: overview?.accounts?.available ? accounts.length : null,

      activeAccountCount: accountStatusesKnown
        ? accounts.filter((account) => isActiveStatus(getStatus(account)))
            .length
        : null,

      totalBalance: overview?.accounts?.available
        ? accounts.reduce((total, account) => total + getAmount(account), 0)
        : null,

      employeeCount: overview?.employees?.available ? employees.length : null,

      pendingKycCount: kycStatusesKnown
        ? kyc.filter((record) => isPendingStatus(getStatus(record))).length
        : null,
    };
  }, [overview]);

  const recentTransactions = overview?.transactions?.data ?? [];

  const monthlyActivity = overview?.transactions?.monthlySummary ?? [];

  const transactionColumns = [
    {
      key: "reference",
      label: "Reference",
      sortable: true,
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
    },
    {
      key: "accountNumber",
      label: "Account",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      format: (value) => formatCurrency(value),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "transactionDate",
      label: "Date",
      sortable: true,
      format: (value) =>
        value ? new Date(value).toLocaleString("en-NG") : "—",
    },
  ];

  const tenantIdentifier = localStorage.getItem("tenantId");

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Tenant workspace</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Bank Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {getDisplayName(user)}. Here's your bank's operational
            overview.
          </p>

          {tenantIdentifier && (
            <p className="mt-1 text-xs text-gray-400">
              Tenant: {tenantIdentifier}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden text-xs text-gray-400 sm:inline">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Metrics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={stats.customerCount}
          subtitle="Customers registered in this tenant"
          icon={UsersIcon}
          color="blue"
          loading={loading}
        />

        <MetricCard
          title="Total Accounts"
          value={stats.accountCount}
          subtitle={
            stats.activeAccountCount === null
              ? "Account records"
              : `${stats.activeAccountCount} active accounts`
          }
          icon={CreditCardIcon}
          color="purple"
          loading={loading}
        />

        <MetricCard
          title="Total Account Balances"
          value={stats.totalBalance}
          subtitle="Sum of balances returned by the account API"
          icon={BanknotesIcon}
          color="green"
          loading={loading}
          format="currency"
        />

        <MetricCard
          title="Employees"
          value={stats.employeeCount}
          subtitle="Employee records"
          icon={UserGroupIcon}
          color="indigo"
          loading={loading}
        />
      </div>

      {/* Transaction Activity and Operational Overview */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel
            title="Transaction Activity"
            subtitle="Monthly deposits and withdrawals"
          >
            <TransactionActivity data={monthlyActivity} loading={false} />

            {!overview?.transactions?.available && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Transaction history is not yet exposed by the current backend
                controller. This chart will become active when a transaction
                reporting endpoint is added.
              </p>
            )}
          </Panel>
        </div>

        <Panel
          title="Operational Overview"
          subtitle="Items requiring staff attention"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pending KYC
                  </p>

                  <p className="text-xs text-gray-500">
                    Customer verification queue
                  </p>
                </div>
              </div>

              <span className="text-lg font-semibold text-gray-900">
                {loading
                  ? "…"
                  : stats.pendingKycCount === null
                    ? "—"
                    : stats.pendingKycCount}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              {overview?.kyc?.available ? (
                stats.pendingKycCount === null ? (
                  <MetricUnavailable label="KYC status" />
                ) : (
                  <Link
                    to="/bank/customer-kyc"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Review KYC records
                  </Link>
                )
              ) : (
                <MetricUnavailable label="KYC" />
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-800">
                Loan applications
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Loan listing and application status are not currently available
                through the supplied LoanController.
              </p>

              <Link
                to="/bank/loans"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Open loan workspace
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      {/* Recent Transactions */}

      <Panel
        title="Recent Transactions"
        subtitle="Latest posted banking transactions"
        action={
          <Link
            to="/bank/transactions"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Open transactions
          </Link>
        }
      >
        {overview?.transactions?.available ? (
          <RecentTransactions data={recentTransactions} loading={loading} />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              Transaction history endpoint required
            </p>

            <p className="mt-1 text-xs text-gray-500">
              The current backend supports deposits but does not expose a
              transaction register or recent-transaction query.
            </p>
          </div>
        )}
      </Panel>

      {/* Quick Actions */}

      <Panel
        title="Quick Actions"
        subtitle="Shortcuts to common banking operations"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/bank/customers"
            className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/50"
          >
            <UsersIcon className="h-6 w-6 text-blue-600" />

            <p className="mt-3 text-sm font-semibold text-gray-900">
              Manage Customers
            </p>

            <p className="mt-1 text-xs text-gray-500">
              View and register customers
            </p>
          </Link>

          <Link
            to="/bank/accounts"
            className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/50"
          >
            <CreditCardIcon className="h-6 w-6 text-blue-600" />

            <p className="mt-3 text-sm font-semibold text-gray-900">
              Manage Accounts
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Review customer accounts
            </p>
          </Link>

          <Link
            to="/bank/customer-kyc"
            className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/50"
          >
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />

            <p className="mt-3 text-sm font-semibold text-gray-900">
              KYC Verification
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Review customer verification
            </p>
          </Link>

          <Link
            to="/bank/loans"
            className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/50"
          >
            <BanknotesIcon className="h-6 w-6 text-blue-600" />

            <p className="mt-3 text-sm font-semibold text-gray-900">
              Loan Operations
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Open the loan workspace
            </p>
          </Link>
        </div>
      </Panel>
    </div>
  );
};

export default TenantDashboard;
