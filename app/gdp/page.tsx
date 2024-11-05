"use client";

import { FormEvent, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function GDPPage() {
  const [gdp, setGdp] = useState("");
  const [population, setPopulation] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateGDP = (e: FormEvent) => {
    e.preventDefault();
    const gdpValue = parseFloat(gdp);
    const populationValue = parseFloat(population);

    if (gdpValue && populationValue) {
      const gdpPerCapita = gdpValue / populationValue;
      setResult(gdpPerCapita);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            GDP Per Capita Calculator
          </h1>

          <form onSubmit={calculateGDP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GDP (in billions)
              </label>
              <input
                type="number"
                value={gdp}
                onChange={(e) => setGdp(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter GDP"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Population (in millions)
              </label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter population"
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
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-center">
                GDP Per Capita:{" "}
                <span className="font-bold">${result.toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
