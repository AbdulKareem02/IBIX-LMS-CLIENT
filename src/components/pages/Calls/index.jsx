import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Select,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Statistic,
  Row,
  Col,
  Input,
  message,
  ColorPicker,
} from "antd";
import {
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Remarks from "../Remarks";
import { AppContext } from "../../../context/AppContext";
import Cookies from "js-cookie";
import "./index.css";

const { TabPane } = Tabs;
const { Option } = Select;

const Calls = () => {
  const { students, empIdStatus } = useContext(AppContext);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState(students);
  const [remarksData, setRemarksData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [remarksModalVisible, setRemarksModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [statusChangeModal, setStatusChangeModal] = useState({
    visible: false,
    record: null, // full record object
    newStatus: "",
    remark: "",
  });

  const getRemarks = async (studentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/get-remarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${Cookies.get("akt")}`,
          },
          body: JSON.stringify({ studentId }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch remarks");
      }

      setRemarksData(result.data);
    } catch (error) {
      console.error("Error fetching remarks:", error);
      return [];
    }
  };

  useEffect(() => {
    // include employeeMailId in deps so it re-fetches when it changes
    fetch(`${process.env.REACT_APP_BASE_URL}/get-students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${Cookies.get("akt")}`,
      },
      body: JSON.stringify({
        employee: empIdStatus,
      }),
    })
      .then((response) => response.json())
      .then((resp) => {
        // ensure each item has a unique key property for antd Table
        const normalized = (resp.data || []).map((item, idx) => ({
          key: item.studentId || item.id || idx,
          ...item,
        }));
        setData(normalized);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [empIdStatus]);

  // Show status-change modal (store full record)
  // const showStatusChangeModal = (record, newStatus) => {
  //   setStatusChangeModal({
  //     visible: true,
  //     record, // store full record object
  //     newStatus,
  //     remark: "",
  //   });
  // };

  // Confirm status change
  const handleStatusChangeConfirm = async (props) => {
    const { studentId, type, remark } = props;

    if (!studentId) return;

    const getStatus = () => {
      switch (type) {
        case "call-done":
          return "Call Done";
        default:
          return "Updated";
      }
    };

    try {
      // Call your backend API to update the call status
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/calls/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${Cookies.get("akt")}`,
          },
          body: JSON.stringify({
            status: type,
            remark: remark || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update call status");
      }

      // Update UI after DB success
      const newData = data.map((item) =>
        item.studentId === studentId ? { ...item, status: type } : item
      );
      setData(newData);

      // Add remark if any
      if (remark && remark.trim() !== "") {
        const newRemark = {
          id: remarksData.length + 1,
          studentId: studentId,
          author: "Agent",
          content: remark,
          datetime: new Date().toISOString(),
          type: getStatus(),
        };
        setRemarksData((prev) => [...prev, newRemark]);
      }

      message.success("Call status updated in DB!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update call status!");
    }

    // Reset modal
    setStatusChangeModal({
      visible: false,
      record: null,
      newStatus: "",
      remark: "",
    });
  };

  // Cancel status change
  const handleStatusChangeCancel = () => {
    setStatusChangeModal({
      visible: false,
      record: null,
      newStatus: "",
      remark: "",
    });
  };

  // Filter data by tab and search
  const getFilteredData = () =>
    data.filter((item) => {
      const matchesTab = activeTab === "all" ? true : item.status === activeTab;
      const q = searchText.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.studentId || "").toLowerCase().includes(q) ||
        (item.phone || "").toString().toLowerCase().includes(q) ||
        (item.name || "").toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });

  const filteredData = getFilteredData();

  // Statistics followUpCalls
  const totalCalls = data.length;
  const completedCalls = data.filter((i) => i.status === "call-done").length;
  const pendingCalls = data.filter((i) => i.status === "Yet to Contact").length;
  const followUpCalls = data.filter((i) => i.status === "follow-up").length;
  const interestedCalls = data.filter((i) => i.status === "interested").length;
  const notInterestedCalls = data.filter(
    (i) => i.status === "not-interested"
  ).length;
  const otherCalls = data.filter((i) => i.status === "others").length;
  const priorityCalls = data.filter((i) => i.status === "priority-call").length;
  const willingToJoin = data.filter(
    (i) => i.status === "willing-to-join"
  ).length;

  const noAnswerCalls = data.filter((i) => i.status === "no-answer").length;

  // View student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setDetailsModalVisible(true);
  };

  // View remarks
  const handleViewRemarks = (student) => {
    setSelectedStudent(student);
    setRemarksModalVisible(true);
  };

  // Close modals
  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedStudent(null);
  };
  const handleCloseRemarksModal = () => {
    setRemarksModalVisible(false);
    setSelectedStudent(null);
  };

  const handleAddRemark = (newRemark) => {
    setRemarksData((prev) => [
      ...prev,
      {
        ...newRemark,
        id: prev.length + 1,
        studentId: selectedStudent.studentId,
      },
    ]);
  };

  // Columns for table
  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: [
        { text: "Web Development", value: "Web Development" },
        { text: "Data Science", value: "Data Science" },
        { text: "UX Design", value: "UX Design" },
      ],
      onFilter: (value, record) => record.course === value,
    },
    {
      title: "Call Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color, icon, text;
        switch (status) {
          case "call-done":
            color = "green";
            icon = <CheckCircleOutlined />;
            text = "Call Done";
            break;
          case "no-answer":
            color = "orange";
            icon = <CloseCircleOutlined />;
            text = "No Answer";
            break;
          case "not-interested":
            color = "red";
            icon = <CloseCircleOutlined />;
            text = "Not Interested";
            break;
          case "callback":
            color = "blue";
            icon = <PhoneOutlined />;
            text = "Callback Requested";
            break;
          case "follow-up":
            color = "violet";
            icon = <PhoneOutlined />;
            text = "Follow Up";
            break;
          case "interested":
            color = "green";
            icon = <PhoneOutlined />;
            text = "Interested";
            break;
          case "willing-to-join":
            color = "pink";
            icon = <PhoneOutlined />;
            text = "WILLING TO JOIN";
            break;
          case "priority-call":
            color = "gold";
            icon = <PhoneOutlined />;
            text = "Priority Calls";
            break;
          case "others":
            color = "gray";
            icon = <PhoneOutlined />;
            text = "Others";
            break;

          default:
            color = "pink";
            icon = <ExclamationCircleOutlined />;
            text = "Yet To Contact";
        }
        return (
          <Tag icon={icon} color={color}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Call Attempts",
      dataIndex: "callAttempts",
      key: "callAttempts",
      sorter: (a, b) => a.callAttempts - b.callAttempts,
    },
    {
      title: "Last Call",
      dataIndex: "lastCall",
      key: "lastCall",
      sorter: (a, b) => new Date(a.lastCall) - new Date(b.lastCall),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Select
            value={record.status} // controlled by row data
            style={{ width: 150 }}
            // onChange={(value) => showStatusChangeModal(record, value)}
            onChange={(value) => {
              handleViewRemarks(record, value);
              getRemarks(record.studentId);
            }}
          >
            <Option value="callback">Call Back</Option>
            <Option value="follow-up">Follow Up</Option>
            <Option value="no-answer">No Answer</Option>
            <Option value="call-done">Call Done</Option>
            <Option value="interested">Interested</Option>
            <Option value="not-interested">Not Interested</Option>
            <Option value="willing-to-join">Willing to join</Option>
            <Option value="priority-call">Priority Calls</Option>
            <Option value="others">Others</Option>
          </Select>

          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewStudent(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<MessageOutlined />}
            onClick={() => {
              handleViewRemarks(record);
              getRemarks(record.studentId);
            }}
          >
            Remarks
          </Button>
        </Space>
      ),
    },
  ];

  // Student Details Modal
  const StudentDetailsModal = ({ student, visible, onCancel }) => (
    <Modal
      title="Student Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={600}
    >
      <Row gutter={16}>
        <Col span={12}>
          <h3>Basic Information</h3>
          <p>
            <strong>ID:</strong> {student.studentId}
          </p>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Phone:</strong> {student.phone}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
        </Col>
        <Col span={12}>
          <h3>Course Information</h3>
          <p>
            <strong>Course:</strong> {student.course}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Tag
              color={
                student.status === "call-done"
                  ? "green"
                  : student.status === "yet-to-contact"
                  ? "light-blue"
                  : student.status === "follow-up"
                  ? "yellow"
                  : student.status === "interested"
                  ? "light-green"
                  : student.status === "not-interested"
                  ? "red"
                  : student.status === "willing-to-join"
                  ? "pink"
                  : student.status === "priority-call"
                  ? "gold"
                  : student.status === "no-answer"
                  ? "orange"
                  : student.status === "others"
                  ? "gray"
                  : student.status === "callback"
                  ? "blue"
                  : "default"
              }
            >
              {student.status === "call-done"
                ? "Call Done"
                : student.status === "yet-to-contact"
                ? "Yet To Contact"
                : student.status === "follow-up"
                ? "Follow Up"
                : student.status === "interested"
                ? "Interested"
                : student.status === "not-interested"
                ? "Not Interested"
                : student.status === "willing-to-join"
                ? "Willing To Join"
                : student.status === "priority-call "
                ? "Priority Calls "
                : student.status === "no-answer"
                ? "No Answer"
                : student.status === "others"
                ? "gray"
                : student.status === "callback"
                ? "Callback Requested"
                : "Pending"}
            </Tag>
          </p>
          <p>
            <strong>Call Attempts:</strong> {student.callAttempts}
          </p>
          <p>
            <strong>Last Call:</strong> {student.lastCall}
          </p>
        </Col>
      </Row>
    </Modal>
  );

  return (
    <div className="calls-container">
      <h1>Task Flow</h1>

      <div className="warning-container">
        <ExclamationCircleOutlined className="warning-icon" />
        <div className="warning-text">
          <h3>Confidentiality Notice</h3>
          <p>
            Unauthorized disclosure or sharing of company call data or personal
            information is strictly prohibited and may result in disciplinary
            action or legal consequences.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Calls"
              value={totalCalls}
              prefix={<PhoneOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Calls"
              value={completedCalls}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title=" Yet to Call"
              value={pendingCalls}
              valueStyle={{ color: "#faad14" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="No Answer"
              value={noAnswerCalls}
              valueStyle={{ color: "#cf1322" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Input
        placeholder="Search by ID or phone"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 250, margin: "16px 0" }}
      />

      {/* Tabs */}
      {data.length <= 0 ? (
        <p>Please wait. Fetching details...</p>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Select
              defaultValue={pageSize}
              style={{ width: 120 }}
              onChange={setPageSize}
            >
              <Option value={10}>10 per page</Option>
              <Option value={20}>20 per page</Option>
              <Option value={50}>50 per page</Option>
            </Select>
          }
        >
          <TabPane tab={`All Calls (${totalCalls})`} key="all">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane
            tab={`Yet To Contact (${pendingCalls})`}
            key="Yet to Contact"
          >
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "Yet to Contact"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane tab={`Follow-Up (${followUpCalls})`} key="follow-up">
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "follow-up"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane tab={`No Answer (${noAnswerCalls})`} key="no-answer">
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "no-answer"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane tab={`Call Done (${completedCalls})`} key="call-done">
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "call-done"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane tab={`Interested (${interestedCalls})`} key="interested">
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "interested"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane
            tab={`Not Interested (${notInterestedCalls})`}
            key="not-interested"
          >
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "not-interested"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane
            tab={`Willing to Join (${willingToJoin})`}
            key="willing-to-join"
          >
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "willing-to-join"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane
            tab={`Priority Calls (${priorityCalls})`}
            key="priority-call"
          >
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "priority-call"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane tab={`Others (${otherCalls})`} key="others">
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (item) => item.status === "others"
              )}
              pagination={{ pageSize }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      )}

      {/* Status Change Modal */}
      <Modal
        title={`Change status for ${statusChangeModal.record?.name || ""}`}
        visible={statusChangeModal.visible}
        onOk={handleStatusChangeConfirm}
        onCancel={handleStatusChangeCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to change status to{" "}
          <strong>{statusChangeModal.newStatus}</strong>?
        </p>
        <Input.TextArea
          placeholder="Add remark for this status change (optional)"
          value={statusChangeModal.remark}
          onChange={(e) =>
            setStatusChangeModal((prev) => ({
              ...prev,
              remark: e.target.value,
            }))
          }
          rows={4}
        />
      </Modal>

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          visible={detailsModalVisible}
          onCancel={handleCloseDetailsModal}
        />
      )}

      {/* Remarks Modal */}
      {selectedStudent && (
        <Modal
          title={`Remarks for ${selectedStudent.name}`}
          visible={remarksModalVisible}
          onCancel={handleCloseRemarksModal}
          footer={null}
          width={700}
        >
          <Remarks
            student={selectedStudent}
            remarksData={remarksData}
            onAddRemark={handleAddRemark}
            handleStatusChangeConfirm={handleStatusChangeConfirm}
          />
        </Modal>
      )}
    </div>
  );
};

export default Calls;
