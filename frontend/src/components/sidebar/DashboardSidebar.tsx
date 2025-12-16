import { useState } from "react";

const menuItems = [
  { label: "Dashboard", key: "dashboard", icon: "📊" },
  { label: "All Projects", key: "all", icon: "📁" },
  { label: "Active Projects", key: "active", icon: "⚡" },
  { label: "In Discussion", key: "discussion", icon: "💬" },
  { label: "Closed Projects", key: "closed", icon: "✅" },
];

export default function DashboardSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  const [active, setActive] = useState("dashboard");

  return (
    <aside className="w-64 min-h-screen bg-black text-gray-300 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">
          Client Panel
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition
              ${
                active === item.key
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-900 hover:text-white"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-2">
        <button className="w-full px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
          + Post New Project
        </button>

        <button className="w-full px-4 py-2 rounded-md text-sm hover:bg-gray-900">
          Profile
        </button>

        <button className="w-full px-4 py-2 rounded-md text-sm text-red-400 hover:bg-gray-900">
          Logout
        </button>
      </div>
    </aside>
  );
}
