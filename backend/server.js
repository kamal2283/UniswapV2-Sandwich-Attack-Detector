const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// In-memory storage for detected attacks (in production, use a database)
let detectedAttacks = [
  {
    txHash:
      "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456ab",
    blockNumber: 18500000,
    attacker: "0x742d35cc6448514c8b3d3b9f36e7e0c3f9ee7890",
    victim: "0x8ba1f109551bd432803012645fac136c2c2b5dad",
    profit: "2.45",
    timestamp: Date.now() - 3600000, // 1 hour ago
    confirmed: true,
  },
  {
    txHash:
      "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567cd",
    blockNumber: 18500001,
    attacker: "0x853e36c7f3f3bccddd3c4e1d8e2f9a6b5c4d8901",
    victim: "0x9cb1f20a661ce432803012645fac136c2c2b5dae",
    profit: "1.23",
    timestamp: Date.now() - 1800000, // 30 minutes ago
    confirmed: true,
  },
  {
    txHash:
      "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678ef",
    blockNumber: 18500002,
    attacker: "0x964f47d8e4e4cddedd4d5e2e9f3a7c6d5e4f9012",
    victim: "0xadc2f31b772df532803012645fac136c2c2b5daf",
    profit: "0.87",
    timestamp: Date.now() - 900000, // 15 minutes ago
    confirmed: false,
  },
  {
    txHash:
      "0xd4e5f6789012345678901234567890abcdef1234567890abcdef12345678901a",
    blockNumber: 18500003,
    attacker: "0xa75058e9f5f5deeeed5e6f3faf4b8d7e6f5fa123",
    victim: "0xbed3f42c883ef632803012645fac136c2c2b5db0",
    profit: "3.15",
    timestamp: Date.now() - 600000, // 10 minutes ago
    confirmed: true,
  },
  {
    txHash: "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789abc",
    blockNumber: 18500004,
    attacker: "0xb8616afaf6f6efffffee7f4fbf5c9e8f7f6fb234",
    victim: "0xcfe4f53d994ff732803012645fac136c2c2b5db1",
    profit: "0.56",
    timestamp: Date.now() - 300000, // 5 minutes ago
    confirmed: false,
  },
];

// Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Get all attacks
app.get("/api/attacks", (req, res) => {
  try {
    // Sort by timestamp descending (newest first)
    const sortedAttacks = detectedAttacks.sort(
      (a, b) => b.timestamp - a.timestamp
    );

    res.json(sortedAttacks);
  } catch (error) {
    console.error("Error fetching attacks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attacks with pagination
app.get("/api/attacks/paginated", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort by timestamp descending (newest first)
    const sortedAttacks = detectedAttacks.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    const paginatedAttacks = sortedAttacks.slice(startIndex, endIndex);

    res.json({
      attacks: paginatedAttacks,
      total: detectedAttacks.length,
      page: page,
      totalPages: Math.ceil(detectedAttacks.length / limit),
    });
  } catch (error) {
    console.error("Error fetching paginated attacks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attack details by transaction hash
app.get("/api/attacks/:txHash", (req, res) => {
  try {
    const txHash = req.params.txHash;
    const attack = detectedAttacks.find((a) => a.txHash === txHash);

    if (!attack) {
      return res.status(404).json({ error: "Attack not found" });
    }

    res.json(attack);
  } catch (error) {
    console.error("Error fetching attack details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new attack (for testing purposes)
app.post("/api/attacks", (req, res) => {
  try {
    const newAttack = {
      txHash: req.body.txHash,
      blockNumber: req.body.blockNumber,
      attacker: req.body.attacker,
      victim: req.body.victim,
      profit: req.body.profit,
      timestamp: Date.now(),
      confirmed: req.body.confirmed || false,
    };

    // Validate required fields
    if (!newAttack.txHash || !newAttack.blockNumber || !newAttack.attacker) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    detectedAttacks.push(newAttack);

    res.status(201).json(newAttack);
  } catch (error) {
    console.error("Error adding new attack:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attack statistics
app.get("/api/stats", (req, res) => {
  try {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    const stats = {
      total: detectedAttacks.length,
      confirmed: detectedAttacks.filter((a) => a.confirmed).length,
      pending: detectedAttacks.filter((a) => !a.confirmed).length,
      last24Hours: detectedAttacks.filter((a) => a.timestamp > oneDayAgo)
        .length,
      lastHour: detectedAttacks.filter((a) => a.timestamp > oneHourAgo).length,
      totalProfit: detectedAttacks
        .reduce((sum, a) => sum + parseFloat(a.profit || 0), 0)
        .toFixed(4),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sandwich Attack API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🥪 Attacks endpoint: http://localhost:${PORT}/api/attacks`);
});

// Simulate new attacks being detected every 30 seconds
setInterval(() => {
  if (Math.random() < 0.3) {
    // 30% chance of new attack
    const newAttack = {
      txHash: "0x" + Math.random().toString(16).substr(2, 40).padEnd(40, "0"),
      blockNumber: 18500000 + detectedAttacks.length,
      attacker: "0x" + Math.random().toString(16).substr(2, 40).padEnd(40, "0"),
      victim: "0x" + Math.random().toString(16).substr(2, 40).padEnd(40, "0"),
      profit: (Math.random() * 5).toFixed(2),
      timestamp: Date.now(),
      confirmed: Math.random() > 0.3, // 70% chance of being confirmed
    };

    detectedAttacks.push(newAttack);
    console.log(`🚨 New sandwich attack detected: ${newAttack.txHash}`);
  }
}, 30000); // Every 30 seconds

module.exports = app;
