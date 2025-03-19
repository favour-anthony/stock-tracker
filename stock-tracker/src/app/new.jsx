'use client'
import React, { useEffect, useState } from "react";
import { Line,Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Style() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
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
        const colors = ["blue", "#03033d", "blue", "#03033d"]; // Different colors for each stock

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
              backgroundColor: "rgba(0, 0, 255, 0.3)",
              pointBackgroundColor: "blue",
              fill: true,
              tension:0.4,
              
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

  if (loading) return <div>Loading... dashboard</div>;
  if (error) return <div>Error: {error}</div>;


  const selectedStock = stockDetails.find((stock) => stock.symbol === selectedSymbol);
  
  return (
    <div className="container">
      <header>
        <input type="text" placeholder="Search for stock" />
      </header>
      <aside>
        <div>
        <img src="/images/logo3.png" alt="Stock Market Overview" width="120" height="100" style={{marginLeft:"10px"}}/>
        </div>
        <div className="board">
          <div>DASHBOARD</div>
        </div>
        <div className="menu">
          <div>MAIN MENU</div>
          
          <ul>
            <li>Home</li>
            <li>Exchange</li>
            <li>Stock & Fund</li>
            <li>Wallets</li>
            <li>Crypto</li>
          </ul>
        </div>

        <div className="support">
          <div>SUPPORT</div>
          
          <ul>
            <li>Community</li>
            <li>Help & Support</li>
          </ul>
        </div>
      </aside>
      <main>
        <div className="stock-p">Your Stock Portfolio</div>
        <div className="portfolio-img">
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div style={{ background: "#fff", padding: "15px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", borderRadius: "8px", flex: "1" }}>
          <p style={{ color: "#666" }}>📘 Value</p>
          <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>$178,326.48</h3>
          <p style={{ color: "#999" }}>$115,312.13 invested</p>
        </div>
        <div style={{ background: "#fff", padding: "15px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", borderRadius: "8px", flex: "1" }}>
          <p style={{ color: "#666" }}>💰 Total Profit</p>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "green" }}>+$63,014.35</h3>
          <p style={{ color: "red" }}>-$1,354.29 ▼ 0.75% daily</p>
        </div>
        <div style={{ background: "#fff", padding: "15px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", borderRadius: "8px", flex: "1" }}>
          <p style={{ color: "#666" }}>📊 IRR</p>
          <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>9.86%</h3>
          <p style={{ color: "#999" }}>8.46% current holdings</p>
        </div>
        <div style={{ background: "#fff", padding: "15px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", borderRadius: "8px", flex: "1" }}>
          <p style={{ color: "#666" }}>🌱 Passive Income</p>
          <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>2.5%</h3>
          <p style={{ color: "#999" }}>$3,726.53 annually</p>
        </div>
        </div>
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