import React from "react";
import DataTable from "../DataTable";

const RecentTransactions = ({ data = [], loading = false, onView }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    let styles = "bg-gray-100 text-gray-700";

    if (["completed", "successful", "approved"].includes(normalized)) {
      styles = "bg-green-100 text-green-700";
    } else if (
      ["pending", "processing", "awaiting approval"].includes(normalized)
    ) {
      styles = "bg-yellow-100 text-yellow-700";
    } else if (["failed", "rejected", "reversed"].includes(normalized)) {
      styles = "bg-red-100 text-red-700";
    }

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${styles}`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const columns = [
    {
      key: "reference",
      label: "Reference",
      sortable: true,
      format: (value) => (
        <span className="font-medium text-gray-900">{value || "—"}</span>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      format: (value) => value || "—",
    },
    {
      key: "accountNumber",
      label: "Account",
      sortable: true,
      format: (value) => value || "—",
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      format: (value) => value || "—",
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      format: (value) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      format: (value) => statusBadge(value),
    },
    {
      key: "transactionDate",
      label: "Date",
      sortable: true,
      format: (value) => formatDate(value),
    },
  ];

  if (!loading && (!Array.isArray(data) || data.length === 0)) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-gray-600">
          No recent transactions
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Transactions will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={Array.isArray(data) ? data : []}
      loading={loading}
      onView={onView}
      itemsPerPage={5}
    />
  );
};

export default RecentTransactions;
