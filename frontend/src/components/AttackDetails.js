import React, { useState } from "react";
import "./AttackDetails.css";

const AttackDetails = ({ attack, onClose, onDeepAnalysis }) => {
  if (!attack) return null;

  const formatAddress = (address) => {
    if (!address || address === "N/A") return "N/A";
    // Validate Ethereum address format (42 characters starting with 0x)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatHash = (hash) => {
    if (!hash || hash === "N/A") return "N/A";
    // Validate Ethereum transaction hash format (66 characters starting with 0x)
    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const isValidEthereumHash = (hash) => {
    return hash && /^0x[a-fA-F0-9]{64}$/.test(hash);
  };

  const isValidEthereumAddress = (address) => {
    return address && /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // You could add a toast notification here
        console.log(`${type} copied to clipboard: ${text}`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleReportAttack = () => {
    // Create a report that can be submitted to authorities or MEV protection services
    const reportData = {
      type: "Sandwich Attack Report",
      txHash: attack.txHash,
      blockNumber: attack.blockNumber,
      attacker: attack.attacker,
      victim: attack.victim,
      profit: attack.profit,
      timestamp: new Date(attack.timestamp).toISOString(),
      reportedAt: new Date().toISOString(),
    };

    // Download as JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sandwich-attack-report-${attack.blockNumber}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(
      "Attack report downloaded! You can submit this to MEV protection services."
    );
  };

  const handleDeepAnalysis = () => {
    if (onDeepAnalysis) {
      onDeepAnalysis(attack);
    }
  };

  return (
    <div className="attack-details-overlay" onClick={onClose}>
      <div
        className="attack-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="attack-details-header">
          <h2>🚨 Sandwich Attack Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="attack-details-content">
          <div className="detail-section">
            <h3>📊 Transaction Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Transaction Hash:</label>
                <div className="address-container">
                  {attack.txHash && attack.txHash !== "N/A" ? (
                    <>
                      <a
                        href={`https://etherscan.io/tx/${attack.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link tx-hash-link"
                        title={`View transaction ${attack.txHash} on Etherscan`}
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {formatHash(attack.txHash)}
                      </a>
                      <button
                        className="copy-button"
                        onClick={() =>
                          copyToClipboard(attack.txHash, "Transaction hash")
                        }
                        title="Copy full transaction hash"
                      >
                        📋
                      </button>
                    </>
                  ) : (
                    <span
                      className="invalid-hash"
                      title="Invalid transaction hash format"
                    >
                      {attack.txHash || "N/A"} ⚠️
                    </span>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <label>Block Number:</label>
                <a
                  href={`https://etherscan.io/block/${attack.blockNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link"
                  title={`View block ${attack.blockNumber} on Etherscan`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://etherscan.io/block/${attack.blockNumber}`,
                      "_blank"
                    );
                  }}
                >
                  {attack.blockNumber || "N/A"}
                </a>
              </div>
              <div className="detail-item">
                <label>Timestamp:</label>
                <span>{new Date(attack.timestamp).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span
                  className={`status-badge ${
                    attack.confirmed ? "confirmed" : "pending"
                  }`}
                >
                  {attack.confirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>👤 Parties Involved</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Attacker Address:</label>
                <div className="address-container">
                  {isValidEthereumAddress(attack.attacker) ? (
                    <>
                      <a
                        href={`https://etherscan.io/address/${attack.attacker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link attacker"
                        title={`View attacker address ${attack.attacker} on Etherscan`}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://etherscan.io/address/${attack.attacker}`,
                            "_blank"
                          );
                        }}
                      >
                        {formatAddress(attack.attacker)}
                      </a>
                      <button
                        className="copy-button"
                        onClick={() =>
                          copyToClipboard(attack.attacker, "Attacker address")
                        }
                        title="Copy full attacker address"
                      >
                        📋
                      </button>
                    </>
                  ) : (
                    <span
                      className="invalid-address"
                      title="Invalid address format"
                    >
                      {attack.attacker || "N/A"} ⚠️
                    </span>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <label>Victim Address:</label>
                <div className="address-container">
                  {isValidEthereumAddress(attack.victim) ? (
                    <>
                      <a
                        href={`https://etherscan.io/address/${attack.victim}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link victim"
                        title={`View victim address ${attack.victim} on Etherscan`}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://etherscan.io/address/${attack.victim}`,
                            "_blank"
                          );
                        }}
                      >
                        {formatAddress(attack.victim)}
                      </a>
                      <button
                        className="copy-button"
                        onClick={() =>
                          copyToClipboard(attack.victim, "Victim address")
                        }
                        title="Copy full victim address"
                      >
                        📋
                      </button>
                    </>
                  ) : (
                    <span
                      className="invalid-address"
                      title="Invalid address format"
                    >
                      {attack.victim || "N/A"} ⚠️
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>💰 Financial Impact</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Extracted Profit:</label>
                <span className="profit-amount">
                  {attack.profit || "0.00"} ETH
                </span>
              </div>
              <div className="detail-item">
                <label>USD Value (Est.):</label>
                <span className="usd-amount">
                  ${(parseFloat(attack.profit || 0) * 2500).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>🔍 Attack Pattern</h3>
            <div className="attack-pattern">
              <div className="pattern-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Front-run Transaction</h4>
                  <p>Attacker places buy order ahead of victim's transaction</p>
                </div>
              </div>
              <div className="pattern-arrow">↓</div>
              <div className="pattern-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Victim Transaction</h4>
                  <p>Original transaction executes at worse price</p>
                </div>
              </div>
              <div className="pattern-arrow">↓</div>
              <div className="pattern-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Back-run Transaction</h4>
                  <p>Attacker sells tokens for profit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>⚠️ Risk Assessment</h3>
            <div className="risk-indicators">
              <div className="risk-item high">
                <span className="risk-label">Severity:</span>
                <span className="risk-value">HIGH</span>
              </div>
              <div className="risk-item medium">
                <span className="risk-label">MEV Impact:</span>
                <span className="risk-value">MEDIUM</span>
              </div>
              <div className="risk-item high">
                <span className="risk-label">User Loss:</span>
                <span className="risk-value">CONFIRMED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="attack-details-footer">
          <button className="action-button report" onClick={handleReportAttack}>
            📝 Report Attack
          </button>
          <button
            className="action-button analyze"
            onClick={handleDeepAnalysis}
          >
            🔬 Deep Analysis
          </button>
          <button className="action-button close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttackDetails;
