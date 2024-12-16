"use client";

import { FormEvent, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function GDPPage() {
  const [gdp, setGdp] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [urbanizationRate, setUrbanizationRate] = useState<number | null>(null);

  const calculateGDP = async (e: FormEvent) => {
    e.preventDefault();
    const gdpValue = parseFloat(gdp);

    if (gdpValue) {
      const gdpPerCapita = gdpValue;
      setResult(gdpPerCapita);

      try {
        const response = await fetch("http://localhost:9090/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gdp_per_capita: gdpPerCapita,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUrbanizationRate(data.urbanization_rate);
        } else {
          console.error("Gagal mendapatkan prediksi urbanisasi");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">
            GDP Calculator
          </h1>

          <form onSubmit={calculateGDP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                GDP Per Capita ($)
              </label>
              <input
                type="number"
                value={gdp}
                onChange={(e) => setGdp(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter GDP Per Capita"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate
            </button>
          </form>

          {result !== null && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md space-y-2">
              <p className="text-center text-gray-100">
                GDP Per Capita:{" "}
                <span className="font-bold">${result.toFixed(2)}</span>
              </p>
              {urbanizationRate !== null && (
                <p className="text-center text-gray-100">
                  Prediksi Tingkat Urbanisasi:{" "}
                  <span className="font-bold">
                    {urbanizationRate.toFixed(2)}%
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
