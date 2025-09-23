import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import NotificationSystem from "./components/NotificationSystem";
import AttackDetails from "./components/AttackDetails";
import DeepAnalysis from "./components/DeepAnalysis";
import ApiService from "./services/ApiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("checking");
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [deepAnalysisAttack, setDeepAnalysisAttack] = useState(null);

  useEffect(() => {
    // Check API health on startup
    checkApiHealth();

    // Load initial attacks
    loadAttacks();

    // Set up real-time updates
    const unsubscribe = ApiService.subscribeToAttacks((newAttacks) => {
      setAttacks(newAttacks);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await ApiService.checkHealth();
      setApiStatus(health.status === "ok" ? "online" : "offline");
    } catch (error) {
      setApiStatus("offline");
      toast.warn("API server is offline. Showing mock data.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const loadAttacks = async () => {
    try {
      setLoading(true);
      const attackData = await ApiService.getAttacks();
      setAttacks(attackData);
    } catch (error) {
      console.error("Failed to load attacks:", error);
      toast.error("Failed to load attack data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewAttack = (attack) => {
    console.log("New attack detected:", attack);
    // You can add additional handling here, like sound alerts
  };

  const handleAttackClick = (attack) => {
    setSelectedAttack(attack);
    toast.dismiss(); // Dismiss the notification when clicked
  };

  const closeAttackDetails = () => {
    setSelectedAttack(null);
  };

  const openDeepAnalysis = (attack) => {
    setDeepAnalysisAttack(attack);
    setSelectedAttack(null); // Close attack details
  };

  const closeDeepAnalysis = () => {
    setDeepAnalysisAttack(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🥪 UniswapV2 Sandwich Attack Detector</h1>
        <div className="api-status">
          <span className={`status-indicator ${apiStatus}`}></span>
          API Status: {apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1)}
        </div>
      </header>

      <main className="app-main">
        <Dashboard
          attacks={attacks}
          loading={loading}
          onAttackClick={handleAttackClick}
        />
        <NotificationSystem
          attacks={attacks}
          onNewAttack={handleNewAttack}
          onAttackClick={handleAttackClick}
        />
      </main>

      <footer className="app-footer">
        <p>© 2025 UniswapV2 Sandwich Attack Detector - Protecting DeFi Users</p>
      </footer>

      {/* Attack Details Modal */}
      {selectedAttack && (
        <AttackDetails
          attack={selectedAttack}
          onClose={closeAttackDetails}
          onDeepAnalysis={openDeepAnalysis}
        />
      )}

      {/* Deep Analysis Modal */}
      {deepAnalysisAttack && (
        <DeepAnalysis attack={deepAnalysisAttack} onClose={closeDeepAnalysis} />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
      />
    </div>
  );
}

export default App;
