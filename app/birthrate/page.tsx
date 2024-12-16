"use client";

import { FormEvent, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function GDPPage() {
  const [steps, setSteps] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");

  const predictBirthRates = async (e: FormEvent) => {
    e.preventDefault();
    if (steps) {
      try {
        const response = await fetch(
          "http://localhost:8000/predict/birth-rate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              steps: steps,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setResult(
            data.predicted_birth_rates
              .map((rate: number) => rate.toFixed(2))
              .join(", ")
          );
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
            Predict Birth Rate
          </h2>

          <form onSubmit={predictBirthRates} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-center">
                Number of Future Steps
              </label>
              <input
                type="number"
                value={steps || ""}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </form>

          {result && (
            <div className="result mt-4 text-lg font-medium text-green-400 text-center">
              <p>{`Predicted Birth Rates: ${result}`}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
