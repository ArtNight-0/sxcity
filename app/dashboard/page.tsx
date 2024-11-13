"use client";

import DashboardLayout from "../components/DashboardLayout";
import { BarChart2, Users, FileText, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-100 mb-6">Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
              <Users size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-100">2,543</p>
            <p className="text-sm text-green-400 mt-2">
              +12.5% from last month
            </p>
          </div>

          {/* Ulangi pola yang sama untuk card lainnya */}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-100">
                    New report generated
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-900/30 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
