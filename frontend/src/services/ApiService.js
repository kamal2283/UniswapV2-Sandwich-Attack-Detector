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
        txHash: "0x1234567890abcdef1234567890abcdef12345678",
        blockNumber: 18500000,
        attacker: "0xattacker1234567890abcdef1234567890abcdef",
        victim: "0xvictim1234567890abcdef1234567890abcdef12",
        profit: "2.45",
        timestamp: Date.now() - 3600000, // 1 hour ago
        confirmed: true,
      },
      {
        txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        blockNumber: 18500001,
        attacker: "0xattacker2234567890abcdef1234567890abcdef",
        victim: "0xvictim2234567890abcdef1234567890abcdef12",
        profit: "1.23",
        timestamp: Date.now() - 1800000, // 30 minutes ago
        confirmed: true,
      },
      {
        txHash: "0x567890abcdef1234567890abcdef1234567890ab",
        blockNumber: 18500002,
        attacker: "0xattacker3234567890abcdef1234567890abcdef",
        victim: "0xvictim3234567890abcdef1234567890abcdef12",
        profit: "0.87",
        timestamp: Date.now() - 900000, // 15 minutes ago
        confirmed: false,
      },
      {
        txHash: "0x234567890abcdef1234567890abcdef1234567890",
        blockNumber: 18500003,
        attacker: "0xattacker4234567890abcdef1234567890abcdef",
        victim: "0xvictim4234567890abcdef1234567890abcdef12",
        profit: "3.15",
        timestamp: Date.now() - 600000, // 10 minutes ago
        confirmed: true,
      },
      {
        txHash: "0x7890abcdef1234567890abcdef1234567890abcdef",
        blockNumber: 18500004,
        attacker: "0xattacker5234567890abcdef1234567890abcdef",
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
