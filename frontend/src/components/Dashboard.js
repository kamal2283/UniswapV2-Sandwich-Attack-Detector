import React from "react";
import "./Dashboard.css";

const Dashboard = ({ attacks, loading, onAttackClick }) => {
  if (loading) {
    return (
      <div className="dashboard">
        <h2>Sandwich Attack Dashboard</h2>
        <div className="loading">Loading attack data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Sandwich Attack Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Attacks</h3>
          <p className="stat-number">{attacks.length}</p>
        </div>
        <div className="stat-card">
          <h3>Recent Attacks</h3>
          <p className="stat-number">
            {
              attacks.filter(
                (attack) => Date.now() - attack.timestamp < 24 * 60 * 60 * 1000
              ).length
            }
          </p>
        </div>
      </div>

      {attacks.length === 0 ? (
        <div className="no-attacks">
          <p>No sandwich attacks detected yet. Monitoring in progress...</p>
        </div>
      ) : (
        <div className="attacks-table-container">
          <table className="attacks-table">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Block Number</th>
                <th>Attacker Address</th>
                <th>Victim Address</th>
                <th>Profit (ETH)</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attacks.map((attack, idx) => (
                <tr
                  key={idx}
                  className="attack-row clickable-row"
                  onClick={() => onAttackClick && onAttackClick(attack)}
                  title="Click to view detailed analysis"
                >
                  <td>
                    <a
                      href={`https://etherscan.io/tx/${attack.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Opening transaction:", attack.txHash);
                        // Direct navigation without window.open for testing
                      }}
                    >
                      {attack.txHash
                        ? `${attack.txHash.slice(0, 10)}...`
                        : "N/A"}
                    </a>
                  </td>
                  <td>{attack.blockNumber || "N/A"}</td>
                  <td>
                    <a
                      href={`https://etherscan.io/address/${attack.attacker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="address-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          "Opening attacker address:",
                          attack.attacker
                        );
                        // Force open in new window/tab
                        window.open(
                          `https://etherscan.io/address/${attack.attacker}`,
                          "_blank"
                        );
                      }}
                    >
                      {attack.attacker
                        ? `${attack.attacker.slice(0, 8)}...`
                        : "N/A"}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://etherscan.io/address/${attack.victim}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="address-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Opening victim address:", attack.victim);
                        // Force open in new window/tab
                        window.open(
                          `https://etherscan.io/address/${attack.victim}`,
                          "_blank"
                        );
                      }}
                    >
                      {attack.victim
                        ? `${attack.victim.slice(0, 8)}...`
                        : "N/A"}
                    </a>
                  </td>
                  <td className="profit">{attack.profit || "0.00"}</td>
                  <td>{new Date(attack.timestamp).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status ${
                        attack.confirmed ? "confirmed" : "pending"
                      }`}
                    >
                      {attack.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
