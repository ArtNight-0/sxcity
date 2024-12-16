"use client";

import { FormEvent, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function StatistikPage() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState<number | null>(null);
  const [unit, setUnit] = useState("C");
  const [result, setResult] = useState<string>("");

  const checkWeather = async (e: FormEvent) => {
    e.preventDefault();
    if (city && days) {
      const url = `http://localhost:8002/temperature?city=${city}&days=${days}&unit=${unit}&_=${new Date().getTime()}`;
      console.log("Request URL:", url); // Log the request URL

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResult(
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message)
          ); // Ensure the message is a string
        } else if (response.status === 304) {
          setResult("No new data available.");
        } else {
          setResult(`Error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch error:", error); // Log the error to the console
        setResult("Error: Could not connect to the server.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
            Check Weather
          </h2>
          <form onSubmit={checkWeather} className="space-y-4">
            <div>
              <label htmlFor="city" className="block text-gray-300">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="days" className="block text-gray-300">
                Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={days || ""}
                onChange={(e) => setDays(parseInt(e.target.value))}
                required
                min="1"
                max="10"
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-gray-300">
                Unit (C/F)
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
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
          <div className="result mt-4 text-lg font-medium text-green-400 text-center">
            {result}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
