// import React, { useContext } from "react";
// import "./index.css";
// import { Card } from "antd";
// import { UserOutlined, MailOutlined } from "@ant-design/icons";
// import { AppContext } from "../../context/AppContext";

// import AttendanceCalendar from "../AttendanceCalendar/AttendanceCalendar";

// const Profile = () => {
//   const { employeeMailId, employeeName, employeeRole } = useContext(AppContext);

//   return (
//     <>
//       <div className="profile-container p-5">
//         <Card className="profile-card" bordered={false}>
//           <div className="profile-header">
//             <div className="profile-avatar">
//               <UserOutlined style={{ fontSize: "48px", color: "#fff" }} />
//             </div>
//             <h2 className="profile-name">{employeeName}</h2>
//             <p className="profile-designation">{employeeRole}</p>
//           </div>

//           <div className="profile-details">
//             <div className="detail-item">
//               <MailOutlined className="detail-icon" />
//               <span>{employeeMailId}</span>
//             </div>
//             {/* <div className="detail-item">
//             <IdcardOutlined className="detail-icon" />
//             <span>Employee ID: EMP12345</span>
//           </div> */}
//           </div>
//         </Card>
//       </div>
//       <AttendanceCalendar />
//     </>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { Tabs, Card, Button, List, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext";
import AttendanceCalendar from "../AttendanceCalendar/AttendanceCalendar";
import "./index.css";
import { useContext } from "react";
import LeaveRequestForm from "../ApplyLeave";

const { TabPane } = Tabs;

// Small helpers to persist to localStorage
const storage = {
  get(key, defaultValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

export default function Profile() {
  const { employeeMailId, employeeName, employeeRole, employee } =
    useContext(AppContext);
  // Profile
  const [profile] = useState(
    storage.get("attendance_profile", { name: "", email: "", contact: "" })
  );

  // Clock records: array of { type: "in"|"out", ts }
  const [clockRecords] = useState(storage.get("attendance_clock", []));

  // Leaves
  const [leaves, setLeaves] = useState(storage.get("attendance_leaves", []));

  useEffect(() => {
    storage.set("attendance_profile", profile);
  }, [profile]);

  useEffect(() => {
    storage.set("attendance_clock", clockRecords);
  }, [clockRecords]);

  useEffect(() => {
    storage.set("attendance_leaves", leaves);
  }, [leaves]);

  const removeLeave = (id) => {
    setLeaves((s) => s.filter((l) => l.id !== id));
    message.success("Leave removed");
  };

  return (
    <Card style={{ maxWidth: 1000, margin: "24px auto" }}>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <UserOutlined /> Profile
            </span>
          }
          key="1"
        >
          <div className="d-lg-flex algin-items-center">
            <Card className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <UserOutlined
                    style={{ fontSize: "48px", color: "#f5ffffff" }}
                  />
                </div>
                <h2 className="profile-name">{employeeName}</h2>
                <p className="profile-designation">{employeeRole}</p>
                <div className="detail-item">
                  <MailOutlined className="detail-icon" />
                  <span>{employeeMailId}</span>
                </div>
              </div>
            </Card>
            <Card className="w-100 text-start personal-details-card">
              <h3>Employee Personal Details:</h3>
              <div className="emp-details mt-3">
                <div className="profile-details">
                  <div className="detail-item">
                    <MailOutlined className="detail-icon" />
                    <span>
                      Mail: <strong>{employee.pEmail}</strong>
                    </span>
                  </div>

                  <div className="detail-item">
                    <PhoneOutlined className="detail-icon" />
                    <span>
                      Phone No: <strong>{employee.phone}</strong>
                    </span>
                  </div>

                  <div className="detail-item">
                    <PhoneOutlined className="detail-icon" />
                    <span>
                      Company Phone No: <strong>{employee.cPhone}</strong>
                    </span>
                  </div>

                  <div className="detail-item">
                    <MailOutlined className="detail-icon" />
                    <span>
                      Address: <strong>{employee.address}</strong>
                    </span>
                  </div>

                  <div className="card-right">
                    <h3>Referral Information</h3>
                    <div className="referral-box">
                      <p>Your Unique Referral Code:</p>
                      <div className="referral-code">{employee.refCode}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ClockCircleOutlined /> Clock In / Clock Out
            </span>
          }
          key="2"
        >
          <AttendanceCalendar />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CalendarOutlined /> Apply Leave
            </span>
          }
          key="3"
        >
          <LeaveRequestForm />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CalendarOutlined /> My Leaves
            </span>
          }
          key="4"
        >
          <div style={{ flex: 1 }}>
            <Card>
              <h3>Applied leaves</h3>
              <List
                dataSource={leaves}
                renderItem={(l) => (
                  <List.Item
                    actions={[
                      <Button
                        size="small"
                        danger
                        onClick={() => removeLeave(l.id)}
                      >
                        Remove
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`${l.type} leave — ${dayjs(l.from).format(
                        "YYYY-MM-DD"
                      )} to ${dayjs(l.to).format("YYYY-MM-DD")}`}
                      description={l.reason || "-"}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
}
