import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const NotificationSystem = ({ attacks, onNewAttack, onAttackClick }) => {
  const [lastAttackCount, setLastAttackCount] = useState(0);

  useEffect(() => {
    if (attacks.length > lastAttackCount) {
      const newAttacks = attacks.slice(lastAttackCount);

      newAttacks.forEach((attack) => {
        const handleToastClick = () => {
          if (onAttackClick) {
            onAttackClick(attack);
          }
        };

        toast.error(
          <div onClick={handleToastClick} style={{ cursor: "pointer" }}>
            <strong>🚨 Sandwich Attack Detected!</strong>
            <br />
            <small>Block: {attack.blockNumber}</small>
            <br />
            <small>Profit: {attack.profit} ETH</small>
            <br />
            <small style={{ opacity: 0.8, fontSize: "0.7em" }}>
              📱 Click for details
            </small>
          </div>,
          {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "sandwich-attack-toast",
            bodyClassName: "sandwich-attack-toast-body",
            style: {
              background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
              border: "2px solid #dc3545",
              boxShadow: "0 4px 20px rgba(220, 53, 69, 0.6)",
              color: "white",
            },
          }
        );

        // Trigger browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification("Sandwich Attack Detected!", {
            body: `Attack detected in block ${attack.blockNumber} with profit ${attack.profit} ETH`,
            icon: "/sandwich-icon.png",
            badge: "/sandwich-badge.png",
          });
        }

        // Call callback if provided
        if (onNewAttack) {
          onNewAttack(attack);
        }
      });

      setLastAttackCount(attacks.length);
    }
  }, [attacks, lastAttackCount, onNewAttack]);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success(
            "Browser notifications enabled for sandwich attack alerts!",
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationSystem;
