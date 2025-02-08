'use client'
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function ApiChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.twelvedata.com/time_series?symbol=AAPL&interval=1min&apikey=899624f31206439d9d65474693d50b84"
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const result = await response.json();

        if (result && result.values) {
          const labels = result.values.map((entry) => entry.datetime).reverse();
          const prices = result.values.map((entry) => parseFloat(entry.close)).reverse();

          setChartData({
            labels,
            datasets: [
              {
                label: "AAPL Stock Price",
                data: prices,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                pointRadius: 2,
                fill: true,
              },
            ],
          });
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div>
      <h1>Stock Market Data</h1>
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}




