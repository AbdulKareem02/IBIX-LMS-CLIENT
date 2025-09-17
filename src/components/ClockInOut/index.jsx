import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AppContext } from "../../context/AppContext";

const ClockInOut = () => {
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const { employeeMailId, employeeName } = useContext(AppContext);

  // check localStorage to persist clock in/out state
  useEffect(() => {
    const savedIn = localStorage.getItem("clockInTime");
    const savedOut = localStorage.getItem("clockOutTime");
    if (savedIn) setClockInTime(new Date(savedIn));
    if (savedOut) setClockOutTime(new Date(savedOut));
  }, []);

  const handleClockIn = async () => {
    if (clockInTime) {
      toast.warning("You already clocked in today ⏰");
      return;
    }

    const now = new Date();
    setClockInTime(now);
    localStorage.setItem("clockInTime", now);

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/attendance/clock-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: employeeName,
            mail: employeeMailId,
            clockIn: now,
          }),
        }
      );

      if (res.ok) {
        toast.success("Clock-in successful ✅");
      } else {
        toast.error("Failed to clock in ❌");
      }
    } catch (err) {
      toast.error("Something went wrong while clocking in ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!clockInTime) {
      toast.warning("You must clock in first ⚠️");
      return;
    }
    if (clockOutTime) {
      toast.warning("You already clocked out today 🚪");
      return;
    }

    const now = new Date();
    setClockOutTime(now);
    localStorage.setItem("clockOutTime", now);

    const totalHours = (
      (now - new Date(clockInTime)) /
      (1000 * 60 * 60)
    ).toFixed(2);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/attendance/clock-out`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: employeeName,
            mail: employeeMailId,
            clockIn: clockInTime,
            clockOut: now,
            date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            totalHours,
          }),
        }
      );

      if (res.ok) {
        toast.success(`Clock-out successful ✅ (Worked ${totalHours} hrs)`);
      } else {
        toast.error("Failed to clock out ❌");
      }
    } catch (err) {
      toast.error("Something went wrong while clocking out ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      {/* Show only Clock In if not done yet */}
      {!clockInTime && (
        <button
          onClick={handleClockIn}
          disabled={loading}
          className={`clock-btn clock-in ${loading ? "disabled" : ""}`}
        >
          Clock In
        </button>
      )}

      {/* Show only Clock Out after clock in */}
      {clockInTime && !clockOutTime && (
        <button
          onClick={handleClockOut}
          disabled={loading}
          className={`clock-btn clock-out ${loading ? "disabled" : ""}`}
        >
          Clock Out
        </button>
      )}

      {/* Show status if both done */}
      {clockInTime && clockOutTime && (
        <p className="status-msg">
          ✅ You clocked in at {new Date(clockInTime).toLocaleTimeString()} and
          clocked out at {new Date(clockOutTime).toLocaleTimeString()}
        </p>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ClockInOut;
