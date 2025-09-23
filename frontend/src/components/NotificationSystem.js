import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const NotificationSystem = ({ attacks, onNewAttack }) => {
  const [lastAttackCount, setLastAttackCount] = useState(0);

  useEffect(() => {
    if (attacks.length > lastAttackCount) {
      const newAttacks = attacks.slice(lastAttackCount);

      newAttacks.forEach((attack) => {
        toast.error(
          <div>
            <strong>🚨 Sandwich Attack Detected!</strong>
            <br />
            <small>Block: {attack.blockNumber}</small>
            <br />
            <small>Profit: {attack.profit} ETH</small>
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
