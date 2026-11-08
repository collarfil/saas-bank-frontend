import React from "react";

const Panel = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  contentClassName = "",
}) => {
  return (
    <section
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={`p-5 ${contentClassName}`}>{children}</div>
    </section>
  );
};

export default Panel;
