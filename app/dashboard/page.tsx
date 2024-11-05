"use client";

import DashboardLayout from "../components/DashboardLayout";
import { BarChart2, Users, FileText, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <Users size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-800">2,543</p>
            <p className="text-sm text-green-500 mt-2">
              +12.5% from last month
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <BarChart2 size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-800">$45,234</p>
            <p className="text-sm text-green-500 mt-2">+8.3% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Reports</h3>
              <FileText size={20} className="text-purple-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-800">432</p>
            <p className="text-sm text-red-500 mt-2">-2.7% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Activity</h3>
              <Activity size={20} className="text-orange-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-800">98%</p>
            <p className="text-sm text-green-500 mt-2">+4.5% from last month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    New report generated
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
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
