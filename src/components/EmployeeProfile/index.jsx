import React, { useContext } from "react";
import "./index.css";
import { Card } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext";
import ClockInOut from "../ClockInOut";
import AttendanceCalendar from "../AttendanceCalendar/AttendanceCalendar";

const Profile = () => {
  const { employeeMailId, employeeName, employeeRole } = useContext(AppContext);

  return (
    <>
      <div className="profile-container p-5">
        <Card className="profile-card" bordered={false}>
          <div className="profile-header">
            <div className="profile-avatar">
              <UserOutlined style={{ fontSize: "48px", color: "#fff" }} />
            </div>
            <h2 className="profile-name">{employeeName}</h2>
            <p className="profile-designation">{employeeRole}</p>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <MailOutlined className="detail-icon" />
              <span>{employeeMailId}</span>
            </div>
            {/* <div className="detail-item">
            <IdcardOutlined className="detail-icon" />
            <span>Employee ID: EMP12345</span>
          </div> */}
          </div>
        </Card>
      </div>
      <AttendanceCalendar />
    </>
  );
};

export default Profile;
