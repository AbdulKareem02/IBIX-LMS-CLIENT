import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./index.css";
import Calls from "../pages/Calls";
import Dashboard from "../Dashboard";
import HRDashboard from "../pages/HR";
import HolidayCalendar from "../HolidayCalendar";

const { Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Load active tab from localStorage (default: "home")
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "home"
  );

  // ✅ Save tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Detect screen size dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard />;
      case "hr":
        return <HRDashboard />;
      case "calls":
        return <Calls />;
      case "calendar":
        return <HolidayCalendar />;
      default:
        return <h2>Welcome</h2>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="md"
          collapsedWidth="60"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            items={[
              { key: "home", icon: <HomeOutlined />, label: "Home" },
              { key: "hr", icon: <UserOutlined />, label: "HR" },
              { key: "calls", icon: <PhoneOutlined />, label: "Calls" },
              {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: "Calendar",
              },
            ]}
          />
        </Sider>
      )}

      {/* Main Content */}
      <Layout style={{ marginLeft: !isMobile ? (collapsed ? 60 : 200) : 0 }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "calc(100vh - 60px)",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>

      {/* Bottom Nav for Mobile */}
      {isMobile && (
        <div className="bottom-nav">
          <div
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <HomeOutlined />
            <span>Home</span>
          </div>
          <div
            className={`nav-item ${activeTab === "hr" ? "active" : ""}`}
            onClick={() => setActiveTab("hr")}
          >
            <UserOutlined />
            <span>HR</span>
          </div>
          <div
            className={`nav-item ${activeTab === "calls" ? "active" : ""}`}
            onClick={() => setActiveTab("calls")}
          >
            <PhoneOutlined />
            <span>Calls</span>
          </div>
          <div
            className={`nav-item ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarOutlined />
            <span>Calendar</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
