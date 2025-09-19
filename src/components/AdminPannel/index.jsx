// AdminPanel.jsx
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Tabs,
  Card,
  Statistic,
  List,
  Avatar,
  Table,
  Tag,
  Switch,
  Row,
  Col,
  Space,
  Typography,
  Button,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./index.css";
import Calls from "../pages/Calls";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminPanel = () => {
  const { employeeMailId, employeeName, employeeRole, setEmployeeMailId } =
    useContext(AppContext);
  const [selectEmp, setSelectEmp] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample data for demonstration
  const dashboardData = {
    stats: [
      {
        title: "Total Users",
        value: 2453,
        icon: <UserOutlined />,
        change: "+12%",
        color: "#1890ff",
      },
      {
        title: "Revenue",
        value: 4234,
        prefix: "$",
        icon: <DollarOutlined />,
        change: "+8%",
        color: "#52c41a",
      },
      {
        title: "Tasks Completed",
        value: 327,
        icon: <CheckCircleOutlined />,
        change: "+5%",
        color: "#faad14",
      },
      {
        title: "Pending Issues",
        value: 18,
        icon: <ExclamationCircleOutlined />,
        change: "-3%",
        color: "#f5222d",
      },
    ],
    recentActivities: [
      { user: "John Doe", action: "Created new project", time: "2 min ago" },
      { user: "Sarah Smith", action: "Updated profile", time: "10 min ago" },
      { user: "Mike Johnson", action: "Completed task", time: "1 hour ago" },
      { user: "Emma Wilson", action: "Submitted report", time: "3 hours ago" },
    ],
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEmpFilter = (e) => {
    if (e.target.value !== "") {
      setEmployeeMailId(e.target.value);
      setSelectEmp(e.target.value);
    } else {
      setEmployeeMailId(employeeMailId);
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <Title level={2} className="header-title">
            Admin Panel
          </Title>
          <Space className="user-info">
            <Avatar size="large" style={{ backgroundColor: "#1890ff" }}>
              {employeeName ? employeeName.charAt(0) : "U"}
            </Avatar>
            <div className="user-details">
              <Text strong>{employeeName}</Text>
              <Text type="secondary">{employeeRole}</Text>
            </div>
          </Space>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabPosition="top"
          type="line"
          size="large"
        >
          <TabPane
            tab={
              <span>
                <DashboardOutlined />
                Dashboard
              </span>
            }
            key="dashboard"
          >
            <div className="tab-content">
              <Row gutter={[16, 16]}>
                {dashboardData.stats.map((stat, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        prefix={stat.icon}
                        valueStyle={{ color: stat.color }}
                        suffix={stat.change}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                  <Card title="Recent Activities">
                    <List
                      itemLayout="horizontal"
                      dataSource={dashboardData.recentActivities}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={item.user}
                            description={
                              <>
                                <div>{item.action}</div>
                                <Text type="secondary">{item.time}</Text>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Quick Actions">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Button type="primary" block>
                        Add New Employee
                      </Button>
                      <Button block>Generate Report</Button>
                      <Button block>View Analytics</Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Employees
              </span>
            }
            key="employees"
          >
            <select
              className="select-employee"
              onChange={handleEmpFilter}
              value={selectEmp}
            >
              <option value="">--Select Employee--</option>
              <option value={process.env.REACT_APP_EMP_1}>
                {process.env.REACT_APP_EMPN_1}
              </option>
              <option value={process.env.REACT_APP_EMP_2}>
                {process.env.REACT_APP_EMPN_2}
              </option>
              <option value={process.env.REACT_APP_EMP_3}>
                {process.env.REACT_APP_EMPN_3}
              </option>
              <option value={process.env.REACT_APP_EMP_4}>
                {process.env.REACT_APP_EMPN_4}
              </option>
            </select>
            <Calls />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Settings
              </span>
            }
            key="settings"
          >
            <div className="tab-content">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Account Settings">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div className="setting-item">
                        <Text>Email Notifications</Text>
                        <Switch defaultChecked />
                      </div>
                      <div className="setting-item">
                        <Text>Dark Mode</Text>
                        <Switch />
                      </div>
                      <div className="setting-item">
                        <Text>Auto Backup</Text>
                        <Switch defaultChecked />
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Profile Information">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div className="info-item">
                        <Text type="secondary">Name:</Text>
                        <Text strong>{employeeName}</Text>
                      </div>
                      <div className="info-item">
                        <Text type="secondary">Email:</Text>
                        <Text strong>{employeeMailId}</Text>
                      </div>
                      <div className="info-item">
                        <Text type="secondary">Role:</Text>
                        <Text strong>{employeeRole}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
