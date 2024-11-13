"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function LaporanPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Laporan</h1>

        {/* Tabel Laporan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-gray-300">No</th>
                <th className="py-3 px-4 text-gray-300">Tanggal</th>
                <th className="py-3 px-4 text-gray-300">Keterangan</th>
                <th className="py-3 px-4 text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {/* Contoh data */}
              <tr className="border-b border-gray-700">
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">2024-03-20</td>
                <td className="py-3 px-4">Laporan Bulanan</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-900/30 rounded-full">
                    Selesai
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
