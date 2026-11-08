import React from "react";

const TransactionActivity = ({
  data = [],
  loading = false,
  currency = "NGN",
}) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Number(amount) || 0);
  };

  const hasData = Array.isArray(data) && data.length > 0;

  const maxValue = hasData
    ? Math.max(
        ...data.flatMap((item) => [
          Number(item.deposits) || 0,
          Number(item.withdrawals) || 0,
        ]),
        1,
      )
    : 1;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="h-56 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-gray-600">
          No transaction activity available
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Transaction activity will appear when data is available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-600" />
          <span className="text-xs text-gray-600">Deposits</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-orange-400" />
          <span className="text-xs text-gray-600">Withdrawals</span>
        </div>
      </div>

      <div className="flex h-56">
        <div className="flex flex-col justify-between text-xs text-gray-400 pr-3 pb-7">
          <span>{formatAmount(maxValue)}</span>
          <span>{formatAmount(maxValue * 0.75)}</span>
          <span>{formatAmount(maxValue * 0.5)}</span>
          <span>{formatAmount(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 flex items-end justify-around gap-2 border-b border-l border-gray-100 px-2">
            {data.map((item, index) => {
              const deposits = Number(item.deposits) || 0;
              const withdrawals = Number(item.withdrawals) || 0;

              const depositHeight = (deposits / maxValue) * 100;
              const withdrawalHeight = (withdrawals / maxValue) * 100;

              return (
                <div
                  key={`${item.month || "month"}-${index}`}
                  className="flex-1 h-full flex items-end justify-center gap-1"
                  title={`${item.month}: Deposits ${formatAmount(deposits)}, Withdrawals ${formatAmount(withdrawals)}`}
                >
                  <div
                    className="w-3 sm:w-5 bg-blue-600 rounded-t-sm hover:bg-blue-700 transition-colors"
                    style={{
                      height: `${Math.max(depositHeight, deposits > 0 ? 1 : 0)}%`,
                    }}
                  />

                  <div
                    className="w-3 sm:w-5 bg-orange-400 rounded-t-sm hover:bg-orange-500 transition-colors"
                    style={{
                      height: `${Math.max(withdrawalHeight, withdrawals > 0 ? 1 : 0)}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-around gap-2 pt-3">
            {data.map((item, index) => (
              <span
                key={`${item.month || "label"}-${index}`}
                className="flex-1 text-center text-xs text-gray-500 truncate"
              >
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionActivity;
[
  { month: "Jan", deposits: 1200000, withdrawals: 800000 },
  { month: "Feb", deposits: 1500000, withdrawals: 950000 },
  { month: "Mar", deposits: 1800000, withdrawals: 1100000 },
];
