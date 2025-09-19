import React, { useState, useEffect, useContext } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SettingOutlined,
  CrownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./index.css";
import Calls from "../pages/Calls";
import Dashboard from "../Dashboard";
import HRDashboard from "../pages/HR";
import HolidayCalendar from "../HolidayCalendar";
import { AppContext } from "../../context/AppContext";
import Profile from "../EmployeeProfile";
import AdminPanel from "../AdminPannel";

const { Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { activeTab, setActiveTab, employeeMailId } = useContext(AppContext);

  // ✅ Load active tab from localStorage (default: "home")

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
      case "profile":
        return <Profile />;
      case "admin":
        if (
          [
            process.env.REACT_APP_ADMIN_1,
            process.env.REACT_APP_ADMIN_2,
          ].includes(employeeMailId)
        ) {
          return <AdminPanel />;
        } else {
          return <h2>Access Denied</h2>;
        }
      default:
        return <h2>Welcome</h2>;
    }
  };

  console.log(
    "dash board home mail admin",
    process.env.REACT_APP_ADMIN_1,
    employeeMailId
  );

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
              {
                key: "profile",
                icon: <SettingOutlined />,
                label: "My Profile",
              },
              {
                key: "admin",
                icon: <CrownOutlined />,
                label: "Admin",
              },
            ]}
          />
        </Sider>
      )}

      {/* Main Content */}
      <Layout style={{ marginLeft: !isMobile ? (collapsed ? 60 : 200) : 0 }}>
        <Content
          style={{
            background: "#fff",
            minHeight: "calc(100vh - 60px)",
            overflow: "hidden",
            padding: "25px",
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
          <div
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <SettingOutlined />
            <span>My Profile</span>
          </div>

          {[
            process.env.REACT_APP_ADMIN_1,
            process.env.REACT_APP_ADMIN_2,
          ].includes(employeeMailId) && (
            <div
              className={`nav-item ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              <CrownOutlined />
              <span>Admin</span>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Home;
