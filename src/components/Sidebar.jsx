// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, menuItems = [], role }) => {
  const location = useLocation();
  // Keep track of which sub-menus are open
  const [openMenus, setOpenMenus] = useState({});

  // Auto-open the sub-menu if the current URL matches one of its children
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          location.pathname.startsWith(child.path),
        );
        if (isChildActive) {
          newOpenMenus[item.name] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, menuItems]);

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-y-auto bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Brand */}
      <div className="border-b border-gray-800 p-4">
        {isOpen ? (
          <div className="text-center">
            <h2 className="text-xl font-bold">SaaS MF</h2>
            <p className="text-xs text-gray-400">Micro Finance System</p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-2xl" title="SaaS Micro Finance">
              🏦
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-2 pb-10">
        {menuItems.map((item) => {
          // 1. If it's a normal flat item (no children)
          if (!item.children || item.children.length === 0) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === "/bank" ||
                  item.path === "/admin" ||
                  item.path === "/dashboard"
                }
                title={!isOpen ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  } ${isOpen ? "gap-3" : "justify-center"}`
                }
              >
                <span className="shrink-0 text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                {isOpen && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          }

          // 2. If it has children (Sub-menu)
          const isOpenMenu = openMenus[item.name];

          return (
            <div key={item.name} className="flex flex-col">
              <button
                onClick={() => toggleMenu(item.name)}
                title={!isOpen ? item.name : undefined}
                className={`flex w-full items-center rounded-md px-3 py-3 text-sm transition-colors text-gray-300 hover:bg-gray-800 hover:text-white ${
                  isOpen ? "justify-between gap-3" : "justify-center"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  {isOpen && <span className="truncate">{item.name}</span>}
                </div>
                {isOpen && (
                  <span
                    className={`text-xs transition-transform duration-200 ${
                      isOpenMenu ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                )}
              </button>

              {/* Sub-menu Items */}
              {isOpenMenu && isOpen && (
                <div className="mt-1 mb-2 space-y-1 border-l border-gray-700 ml-4 pl-3">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`
                      }
                    >
                      <span className="shrink-0 text-base" aria-hidden="true">
                        {child.icon}
                      </span>
                      <span className="truncate">{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {isOpen && (
        <div className="border-t border-gray-800 p-4 mt-auto">
          <p className="text-xs capitalize text-gray-400">
            {role || "User"} Portal
          </p>
          <p className="mt-1 text-xs text-gray-500">SaaS Micro Finance</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
