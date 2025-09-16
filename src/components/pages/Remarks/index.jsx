import React, { useState } from "react";
import {
  List,
  Input,
  Button,
  message,
  Card,
  Avatar,
  Tag,
  Divider,
  Select,
  Space,
  Typography,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const Remarks = ({
  student,
  remarksData,
  onAddRemark,
  handleStatusChangeConfirm,
}) => {
  const [remarkText, setRemarkText] = useState("");
  const [remarkType, setRemarkType] = useState("general");
  const [loading, setLoading] = useState(false);

  // Filter remarks for the selected student and sort by date (newest first)
  const studentRemarks = remarksData
    .filter((r) => r.studentId === student.studentId)
    .sort(
      (a, b) => new Date(b.datetime || b.date) - new Date(a.datetime || a.date)
    );

  const handleAddRemark = async () => {
    if (!remarkText.trim()) {
      message.error("Remark cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const timestamp = new Date().toISOString();
      const newRemark = {
        studentId: student.studentId,
        remark: remarkText,
        content: remarkText,
        type: remarkType,
        datetime: timestamp,
        date: timestamp,
        author: "Current User", // In a real app, this would come from auth context
      };

      const res = await fetch(
        `https://ibix-lms-server.onrender.com/ibix-api/remarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRemark),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update remark");
      }

      alert("Remark updated successfully!");

      await onAddRemark(newRemark);
      handleStatusChangeConfirm(newRemark);
      setRemarkText("");
      setRemarkType("general");
      message.success("Remark added successfully!");
    } catch (error) {
      message.error("Failed to add remark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      follow_up: "blue",
      information: "green",
      info_request: "green",
      issue: "red",
      general: "default",
      callback: "orange",
      enrollment: "purple",
      no_answer: "red",
    };
    return typeColors[type] || "default";
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, YYYY [at] h:mm A");
  };

  return (
    <Card style={{ boxShadow: "none", border: "none" }}>
      {/* Remarks List */}
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
        {remarksData.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={remarksData?.[0]?.remarks || []}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <List.Item.Meta
                  title={
                    <div>
                      <Tag color="blue">{item.type}</Tag>{" "}
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {formatDate(item.datetime)}
                      </span>
                    </div>
                  }
                  description={
                    <div>
                      <p>{item.remark}</p>
                      <small>Author: {item.author}</small>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            <MessageOutlined
              style={{ fontSize: "24px", marginBottom: "8px" }}
            />
            <p>No remarks yet. Be the first to add one!</p>
          </div>
        )}
      </div>

      <Divider />

      {/* Add Remark Form */}
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Select
          value={remarkType}
          onChange={setRemarkType}
          style={{ width: "100%" }}
        >
          <Option value="call-done">Call Done</Option>
          <Option value="callback">Call Back</Option>
          <Option value="not-answering">Not Answering</Option>
          <Option value="follow-up">Follow Up Needed</Option>
          <Option value="interested">Interested</Option>
          <Option value="not-interested">Not Interested</Option>
          <Option value="willing-to-join">Willing to join</Option>
          <Option value="priority-call">Priority Call</Option>
          <Option value="others">Others</Option>
        </Select>

        <TextArea
          rows={3}
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          placeholder="Enter your remark here..."
          style={{ resize: "vertical" }}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRemark}
          loading={loading}
          disabled={!remarkText.trim()}
          block
        >
          Add Remark
        </Button>
      </Space>
    </Card>
  );
};

export default Remarks;
