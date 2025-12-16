import { useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";

export default function ClientDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Sidebar (conditional) */}
        {isSidebarOpen && (
          <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar with hamburger */}
          <div className="p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Your existing content (UNCHANGED) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Client Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                This is the Client Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
