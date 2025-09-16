import React, { useState, useEffect } from "react";
import "./index.css";

const ClockInOut = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'clockin' or 'clockout'
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState("Working on tasks");

  // Sample activities - in a real app, these might come from the backend
  const activities = [
    "Working on tasks",
    "Meeting",
    "Break",
    "Training",
    "Client call",
    "Project planning",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if user is already clocked in (from localStorage or API)
    const savedStatus = localStorage.getItem("clockStatus");
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      setIsClockedIn(status.isClockedIn);
      setClockInTime(new Date(status.clockInTime));

      if (status.isClockedIn) {
        const hoursWorked =
          (new Date() - new Date(status.clockInTime)) / (1000 * 60 * 60);
        setTotalHours(hoursWorked);
      }
    }

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setModalType("clockin");
    setShowModal(true);
  };

  const handleClockOut = () => {
    setModalType("clockout");
    setShowModal(true);
  };

  const confirmAction = async () => {
    setLoading(true);

    try {
      if (modalType === "clockin") {
        // Simulate API call to backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const now = new Date();
        setIsClockedIn(true);
        setClockInTime(now);
        setTotalHours(0);

        // Save to localStorage
        localStorage.setItem(
          "clockStatus",
          JSON.stringify({
            isClockedIn: true,
            clockInTime: now.toISOString(),
          })
        );

        // In a real app, you would send data to your backend
        console.log("Clock In data:", {
          time: now.toISOString(),
          activity,
          notes,
        });
      } else if (modalType === "clockout") {
        // Simulate API call to backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const now = new Date();
        const hoursWorked = (now - clockInTime) / (1000 * 60 * 60);

        setIsClockedIn(false);
        setClockInTime(null);
        setTotalHours(hoursWorked);

        // Remove from localStorage
        localStorage.removeItem("clockStatus");

        // In a real app, you would send data to your backend
        console.log("Clock Out data:", {
          time: now.toISOString(),
          notes,
        });
      }

      // Reset form
      setNotes("");
      setActivity("Working on tasks");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving clock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="time-tracker">
      <div className="tracker-status">
        <div className="status-indicator">
          <div
            className={`status-circle ${
              isClockedIn ? "clocked-in" : "clocked-out"
            }`}
          >
            <span>{isClockedIn ? "IN" : "OUT"}</span>
          </div>
          <div className="status-text">
            {isClockedIn
              ? "You are currently clocked in"
              : "You are currently clocked out"}
          </div>
        </div>

        {isClockedIn && clockInTime && (
          <div className="clock-details">
            <div className="detail-item">
              <span className="label">Clocked in at:</span>
              <span className="value">{formatTime(clockInTime)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Time elapsed:</span>
              <span className="value">{formatDuration(totalHours)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        {!isClockedIn ? (
          <button className="clock-in-btn" onClick={handleClockIn}>
            <span className="icon">⏰</span>
            Clock In
          </button>
        ) : (
          <button className="clock-out-btn" onClick={handleClockOut}>
            <span className="icon">⏱️</span>
            Clock Out
          </button>
        )}
      </div>
    </div>
  );
};

export default ClockInOut;
