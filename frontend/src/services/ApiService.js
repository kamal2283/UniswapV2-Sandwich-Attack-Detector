import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making API request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error("API request error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API response error:", error);
        if (error.response) {
          // Server responded with error status
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          // Request made but no response received
          console.error("No response received:", error.request);
        } else {
          // Something else happened
          console.error("Error message:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Get all detected sandwich attacks
  async getAttacks() {
    try {
      const response = await this.api.get("/attacks");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attacks:", error);
      // Return mock data if API is not available
      return this.getMockAttacks();
    }
  }

  // Get attacks with pagination
  async getAttacksPaginated(page = 1, limit = 50) {
    try {
      const response = await this.api.get(
        `/attacks?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch paginated attacks:", error);
      return {
        attacks: this.getMockAttacks(),
        total: 5,
        page: 1,
        totalPages: 1,
      };
    }
  }

  // Get attack details by transaction hash
  async getAttackDetails(txHash) {
    try {
      const response = await this.api.get(`/attacks/${txHash}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attack details:", error);
      throw error;
    }
  }

  // Get real-time attack feed (for WebSocket connection)
  subscribeToAttacks(callback) {
    // For now, we'll simulate real-time updates with polling
    const pollInterval = setInterval(async () => {
      try {
        const attacks = await this.getAttacks();
        callback(attacks);
      } catch (error) {
        console.error("Failed to poll attacks:", error);
      }
    }, 5000); // Poll every 5 seconds

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  }

  // Mock data for when API is not available
  getMockAttacks() {
    return [
      {
        txHash:
          "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        blockNumber: 18500000,
        attacker: "0x742d35cc6448514c8b3d3b9f36e7e0c3f9ee7890",
        victim: "0x8ba1f109551bd432803012645hac136c2c2b5dad",
        profit: "2.45",
        timestamp: Date.now() - 3600000, // 1 hour ago
        confirmed: true,
      },
      {
        txHash:
          "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        blockNumber: 18500001,
        attacker: "0x853e36c7f3f3bccddd3c4e1d8e2f9a6b5c4d8901",
        victim: "0x9cb1f20a661ce432803012645hac136c2c2b5dae",
        profit: "1.23",
        timestamp: Date.now() - 1800000, // 30 minutes ago
        confirmed: true,
      },
      {
        txHash:
          "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        blockNumber: 18500002,
        attacker: "0x964f47d8e4e4cddedd4d5e2e9f3a7c6d5e4f9012",
        victim: "0xadc2f31b772df532803012645hac136c2c2b5daf",
        profit: "0.87",
        timestamp: Date.now() - 900000, // 15 minutes ago
        confirmed: false,
      },
      {
        txHash:
          "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789",
        blockNumber: 18500003,
        attacker: "0xa75058e9f5f5deeeed5e6f3faf4b8d7e6f5fa123",
        victim: "0xbed3f42c883ef632803012645hac136c2c2b5db0",
        profit: "3.15",
        timestamp: Date.now() - 600000, // 10 minutes ago
        confirmed: true,
      },
      {
        txHash:
          "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789a",
        blockNumber: 18500004,
        attacker: "0xb8616afaf6f6efffffee7f4fbf5c9e8f7f6fb234",
        victim: "0xcfe4f53d994ff732803012645hac136c2c2b5db1",
        victim: "0xvictim5234567890abcdef1234567890abcdef12",
        profit: "0.56",
        timestamp: Date.now() - 300000, // 5 minutes ago
        confirmed: false,
      },
    ];
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      console.error("API health check failed:", error);
      return { status: "offline" };
    }
  }
}

export default new ApiService();
