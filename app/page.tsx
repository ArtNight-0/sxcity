"use client";

import DashboardLayout from "./components/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard</h1>
        {/* Tambahkan konten dashboard di sini */}
      </div>
    </DashboardLayout>
  );
}
