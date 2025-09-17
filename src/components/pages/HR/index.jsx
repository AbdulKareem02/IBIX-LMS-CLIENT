import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const HRDashboard = () => {
  // Data array for our cards
  const cardData = [
    {
      id: 1,
      title: "Apply Leave",
      icon: "📝",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      link: "/apply-leave",
    },
    // {
    //   id: 2,
    //   title: "HR Portal",
    //   icon: "👥",
    //   gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    //   link: "/",
    // },
    // {
    //   id: 3,
    //   title: "Calls",
    //   icon: "📞",
    //   gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    //   link: "/",
    // },
    {
      id: 4,
      title: "Calendar",
      icon: "📅",
      gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      link: "/",
    },
    // {
    //   id: 5,
    //   title: "Profile",
    //   icon: "👤",
    //   gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    //   link: "/",
    // },
    // {
    //   id: 6,
    //   title: "Dashboard",
    //   icon: "📊",
    //   gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    //   link: "/",
    // },
    {
      id: 7,
      title: "Settings",
      icon: "⚙️",
      gradient: "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)",
      link: "/",
    },
    {
      id: 8,
      title: "Notifications",
      icon: "🔔",
      gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      link: "/",
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">HR Portal</h1>
      <p className="dashboard-subtitle">
        Access all your workplace tools in one place
      </p>

      <div className="container d-flex justify-content-center">
        <div className="cards-container row">
          {cardData.map((card) => (
            <div className="col-6 col-md-4 col-lg-3">
              <Link key={card.id} to={card.link} className="card-link ">
                <div
                  className="dashboard-card mb-4"
                  style={{ background: card.gradient }}
                >
                  <div className="card-icon">{card.icon}</div>
                  <h3 className="card-title">{card.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
