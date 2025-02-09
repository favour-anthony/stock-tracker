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

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function Style() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [stockDetails, setStockDetails] = useState([]); // Store stock details
  const [selectedSymbol, setSelectedSymbol] = useState(""); // Track selected stock
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.twelvedata.com/time_series?symbol=AAPL,EUR/USD,ETH/BTC:Huobi,TRP:TSX&interval=5min&apikey=899624f31206439d9d65474693d50b84"
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const result = await response.json();
        const colors = ["#b2e5dc", "#f4bec6", "#a59494", " #6ddbee"]; // Different colors for each stock

        if (result) {
          const stockNames = Object.keys(result);
          let labels = [];
          let details = [];

          const datasets = stockNames.map((symbol, index) => {
            const stockData = result[symbol].values;
            if (!labels.length) {
              labels = stockData.map((entry) => entry.datetime).reverse();
            }

            // Store stock details (latest price, high, low, volume)
            const latest = stockData[0];
            details.push({
              symbol,
              price: latest.close,
              high: latest.high,
              low: latest.low,
              volume: latest.volume,
            });

            return {
              label: symbol,
              data: stockData.map((entry) => parseFloat(entry.close)).reverse(),
              borderColor: colors[index],
              backgroundColor: colors[index] + "33",
              pointRadius: 2,
              fill: true,
            };
          });

          setChartData({ labels, datasets });
          setStockDetails(details);
          setSelectedSymbol(stockNames[0]); // Default to first stock
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

  // Find selected stock details
  const selectedStock = stockDetails.find((stock) => stock.symbol === selectedSymbol);

  return (
    <div className="container">
      <header>
        <input type="text" placeholder="Search for stock" />
      </header>
      <aside>
        <div>
        <img src="/images/logo.png" alt="Stock Market Overview" width="120" height="100" />
        </div>
        <div className="board">
          <div>DASHBOARD</div>
        </div>
        <div className="menu">
          MAIN MENU
          <ul>
            <li>Home</li>
            <li>Exchange</li>
            <li>Stock & Fund</li>
            <li>Wallets</li>
            <li>Crypto</li>
          </ul>
        </div>

        <div className="support">
          SUPPORT
          <ul>
            <li>Community</li>
            <li>Help & Support</li>
          </ul>
        </div>
      </aside>
      <main>
        <div className="stock-p">Your Stock Portfolio</div>
        <div className="portfolio-img">
            <img src="/images/portfolio-card.png" alt="Stock Market Overview" width="230" height="100" />
            <img src="/images/portfolio.png" alt="Stock Market Overview" width="230" height="100" />
            <img src="/images/portfolio-card.png" alt="Stock Market Overview" width="230" height="100" />
            <img src="/images/portfolio.png" alt="Stock Market Overview" width="230" height="100" />
        </div>
        <div className="api-call">
          <div>
            <div className="stock-w">Stock-Watchlist</div>
            <div id="stock-img">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <div className="stock-w">Details</div>

            <div className="stock-details">
            <div className="stock-select">
              <label>Select a Stock: </label>
              <select onChange={(e) => setSelectedSymbol(e.target.value)} value={selectedSymbol}>
                {stockDetails.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </option>
                ))}
              </select>
            </div>
              {selectedStock ? (
                <div className="stock-item">
                  <h3>{selectedStock.symbol}</h3>
                  <p>📈 Price: ${selectedStock.price}</p>
                  <p>🔼 High: ${selectedStock.high}</p>
                  <p>🔽 Low: ${selectedStock.low}</p>
                  <p>📊 Volume: {selectedStock.volume}</p>
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
