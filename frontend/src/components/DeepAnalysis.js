import React, { useState } from "react";
import "./DeepAnalysis.css";

const DeepAnalysis = ({ attack, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!attack) return null;

  // Generate mock MEV data for visualization
  const generateMEVData = () => {
    const profit = parseFloat(attack.profit || 0);
    return {
      frontrunProfit: (profit * 0.6).toFixed(3),
      backrunProfit: (profit * 0.4).toFixed(3),
      victimLoss: (profit * 1.2).toFixed(3),
      gasUsed: Math.floor(Math.random() * 200000 + 100000),
      gasPrice: Math.floor(Math.random() * 50 + 20),
      slippage: (Math.random() * 5 + 1).toFixed(2),
    };
  };

  const mevData = generateMEVData();

  const renderOverview = () => (
    <div className="analysis-section">
      <h3>📊 Attack Overview</h3>
      <div className="overview-cards">
        <div className="overview-card profit">
          <h4>Total Extracted Value</h4>
          <div className="big-number">{attack.profit} ETH</div>
          <div className="sub-text">
            ${(parseFloat(attack.profit || 0) * 2500).toFixed(2)} USD
          </div>
        </div>
        <div className="overview-card loss">
          <h4>Victim Loss</h4>
          <div className="big-number">{mevData.victimLoss} ETH</div>
          <div className="sub-text">Including slippage impact</div>
        </div>
        <div className="overview-card gas">
          <h4>Gas Used</h4>
          <div className="big-number">{mevData.gasUsed.toLocaleString()}</div>
          <div className="sub-text">At {mevData.gasPrice} Gwei</div>
        </div>
        <div className="overview-card efficiency">
          <h4>Attack Efficiency</h4>
          <div className="big-number">
            {(
              (parseFloat(attack.profit || 0) /
                parseFloat(mevData.victimLoss)) *
              100
            ).toFixed(1)}
            %
          </div>
          <div className="sub-text">Profit vs Victim Loss</div>
        </div>
      </div>

      <div className="breakdown-container">
        <div className="profit-breakdown">
          <h4>💰 Profit Breakdown</h4>
          <div className="breakdown-chart">
            <div className="chart-bar">
              <div className="bar-segment frontrun" style={{ width: "60%" }}>
                <span>Front-run: {mevData.frontrunProfit} ETH</span>
              </div>
              <div className="bar-segment backrun" style={{ width: "40%" }}>
                <span>Back-run: {mevData.backrunProfit} ETH</span>
              </div>
            </div>
          </div>
        </div>

        <div className="attack-timeline">
          <h4>⏱️ Attack Timeline</h4>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot frontrun-dot"></div>
              <div className="timeline-content">
                <div className="timeline-title">Front-run Transaction</div>
                <div className="timeline-desc">
                  Profit: +{mevData.frontrunProfit} ETH
                </div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot victim-dot"></div>
              <div className="timeline-content">
                <div className="timeline-title">Victim Transaction</div>
                <div className="timeline-desc">
                  Loss: -{mevData.victimLoss} ETH
                </div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot backrun-dot"></div>
              <div className="timeline-content">
                <div className="timeline-title">Back-run Transaction</div>
                <div className="timeline-desc">
                  Profit: +{mevData.backrunProfit} ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGraph = () => {
    // Generate price data for the graph
    const generatePriceData = () => {
      const basePrice = 1800; // ETH price example
      const slippage = parseFloat(mevData.slippage);

      return [
        { time: "Before", price: basePrice, label: "Normal Price" },
        {
          time: "Front-run",
          price: basePrice + (basePrice * slippage) / 200,
          label: "Price Increase",
        },
        {
          time: "Victim Tx",
          price: basePrice + (basePrice * slippage) / 100,
          label: "Peak Price",
        },
        {
          time: "Back-run",
          price: basePrice + (basePrice * slippage) / 300,
          label: "Price Drop",
        },
        { time: "After", price: basePrice, label: "Recovery" },
      ];
    };

    const priceData = generatePriceData();
    const maxPrice = Math.max(...priceData.map((d) => d.price));
    const minPrice = Math.min(...priceData.map((d) => d.price));
    const priceRange = maxPrice - minPrice;

    return (
      <div className="analysis-section">
        <h3>📈 Price Impact Analysis</h3>
        <div className="graph-container">
          <div className="price-graph">
            <div className="graph-header">
              <h4>Token Price During Sandwich Attack</h4>
              <div className="graph-legend">
                <span className="legend-item">
                  <span className="legend-color normal"></span>
                  Normal Price
                </span>
                <span className="legend-item">
                  <span className="legend-color impact"></span>
                  Price Impact
                </span>
                <span className="legend-item">
                  <span className="legend-color victim"></span>
                  Victim Transaction
                </span>
              </div>
            </div>

            <div className="graph-chart">
              <div className="y-axis">
                <div className="y-label high">${maxPrice.toFixed(0)}</div>
                <div className="y-label mid">
                  ${((maxPrice + minPrice) / 2).toFixed(0)}
                </div>
                <div className="y-label low">${minPrice.toFixed(0)}</div>
              </div>

              <div className="chart-area">
                <svg viewBox="0 0 400 200" className="price-chart-svg">
                  {/* Grid lines */}
                  <defs>
                    <pattern
                      id="grid"
                      width="80"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 80 0 L 0 0 0 40"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid)" />

                  {/* Price line */}
                  <polyline
                    points={priceData
                      .map(
                        (d, i) =>
                          `${i * 80 + 40},${
                            200 - ((d.price - minPrice) / priceRange) * 160 - 20
                          }`
                      )
                      .join(" ")}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    className="price-line"
                  />

                  {/* Data points */}
                  {priceData.map((d, i) => (
                    <g key={i}>
                      <circle
                        cx={i * 80 + 40}
                        cy={
                          200 - ((d.price - minPrice) / priceRange) * 160 - 20
                        }
                        r="6"
                        fill={i === 2 ? "#EF4444" : "#4F46E5"}
                        className="price-point"
                      />
                      <text
                        x={i * 80 + 40}
                        y={200 - ((d.price - minPrice) / priceRange) * 160 - 35}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                        className="price-value"
                      >
                        ${d.price.toFixed(0)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="x-axis">
                {priceData.map((d, i) => (
                  <div key={i} className="x-label">
                    {d.time}
                  </div>
                ))}
              </div>
            </div>

            <div className="impact-metrics">
              <div className="metric">
                <div className="metric-label">Maximum Price Impact</div>
                <div className="metric-value impact-text">
                  {mevData.slippage}%
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Victim Loss</div>
                <div className="metric-value loss-text">
                  {mevData.victimLoss} ETH
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Attacker Profit</div>
                <div className="metric-value profit-text">
                  {attack.profit} ETH
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Price Recovery Time</div>
                <div className="metric-value">~15 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="deep-analysis-overlay" onClick={onClose}>
      <div className="deep-analysis-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analysis-header">
          <h2>🔬 Deep Analysis</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="analysis-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab ${activeTab === "graph" ? "active" : ""}`}
            onClick={() => setActiveTab("graph")}
          >
            📈 Price Impact Graph
          </button>
        </div>

        <div className="analysis-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "graph" && renderGraph()}
        </div>

        <div className="analysis-footer">
          <button className="action-button close-btn" onClick={onClose}>
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeepAnalysis;
