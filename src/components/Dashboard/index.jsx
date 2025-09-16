import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import ClockInOut from "../ClockInOut";

// async function login() {
//   const res = await fetch("http://localhost:5000/api/employees/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email: "hr@example.com", password: "hr123" }),
//   });

//   const data = await res.json();
//   console.log(data);
// }

const cardData = [
  {
    id: 5,
    title: "Profile",
    icon: "👤",
    gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    link: "/",
  },
  {
    id: 3,
    title: "Calls",
    icon: "📞",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    link: "/",
  },
  {
    id: 1,
    title: "Apply Leave",
    icon: "📝",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    link: "/apply-leave",
  },
  {
    id: 6,
    title: "Dashboard",
    icon: "📊",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    link: "/",
  },
];

const Dashboard = () => {
  const { employeeName } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  // ✅ Live Date & Time Component
  const LiveDateTime = () => {
    useEffect(() => {
      setIsVisible(true);
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = (date) =>
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const formatDate = (date) =>
      date.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
      <div className={`datetime-container ${isVisible ? "visible" : ""}`}>
        <div className="time-display">{formatTime(currentTime)}</div>
        <div className="date-display">{formatDate(currentTime)}</div>
      </div>
    );
  };

  // ✅ Logout handler
  const confirmLogout = () => {
    localStorage.clear();
    window.location.replace("/login"); // replaces history, so back button won't return
  };

  return (
    <div className="dashboard d-flex flex-column align-items-center gap-3">
      {/* <ClockInOut /> */}
      {/* Logout Button */}
      <div className="ms-auto">
        <button
          className="btn btn-primary"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      {/* Greeting */}
      <h1 className="dashboard-title">
        {getGreeting()} <span>{employeeName}</span>! Welcome to IBIX
      </h1>

      {/* Time Display */}
      {LiveDateTime()}

      <p className="dashboard-subtitle">
        Access all your workplace tools in one place
      </p>

      {/* Cards */}
      <div className="cards-container">
        {cardData.map((card) => (
          <Link key={card.id} to={card.link} className="card-link">
            <div
              className="dashboard-card"
              style={{ background: card.gradient }}
            >
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Custom Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
