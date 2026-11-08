import React from "react";

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
  loading = false,
  format = "number",
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const formatValue = (amount) => {
    if (amount === null || amount === undefined) return "—";

    if (format === "currency") {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
      }).format(Number(amount) || 0);
    }

    if (format === "percentage") {
      return `${Number(amount).toFixed(1)}%`;
    }

    return new Intl.NumberFormat("en-NG").format(Number(amount) || 0);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          {loading ? (
            <div className="mt-3 h-8 w-32 rounded bg-gray-100 animate-pulse" />
          ) : (
            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 break-words">
              {formatValue(value)}
            </h3>
          )}

          {subtitle && <p className="mt-2 text-xs text-gray-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div
            className={`shrink-0 rounded-lg p-3 ${colors[color] || colors.blue}`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>

      {trend && !loading && (
        <div className="mt-3 text-xs text-gray-500">{trend}</div>
      )}
    </div>
  );
};

export default MetricCard;
