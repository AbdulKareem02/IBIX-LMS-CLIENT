// components/AttendanceCalendar.js
import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  addMonths,
  parseISO,
  getDay,
} from "date-fns";
import "./AttendanceCalendar.css";
import { AppContext } from "../../context/AppContext";

const AttendanceCalendar = () => {
  const { employeeMailId } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate, employeeMailId]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/emp-attendance/calendar/${employeeMailId}?year=${currentDate.getFullYear()}&month=${
          currentDate.getMonth() + 1
        }`
      );
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
    setLoading(false);
  };

  const handleClockIn = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/emp-attendance/clockin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId: employeeMailId }),
        }
      );

      const resData = await response.json();
      console.log("clockin res", resData);

      if (response.ok) {
        fetchAttendanceData();
        toast.success("Clocked in successfully!");
      } else if (response.status === 400) {
        toast.warning("Already clocked in today");
      } else {
        toast.warning("Something went wrong!");
      }
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/emp-attendance/clockout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId: employeeMailId }),
        }
      );

      const resData = await response.json();
      console.log("clock out:", resData);

      if (response.ok) {
        fetchAttendanceData();
        toast.success("Clocked out successfully!");
      } else if (response.status === 400) {
        toast.warning("Already clocked out today");
      } else {
        toast.warning("Something went wrong!");
      }
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  const getDayStatus = (day) => {
    const attendance = attendanceData.find(
      (a) => isSameDay(parseISO(a.date), day) // ✅ avoids timezone shifts
    );

    if (!attendance) {
      if (isBefore(day, new Date()) && !isToday(day)) {
        return "absent";
      }
      return null;
    }

    return attendance.status;
  };

  const getDayColor = (day) => {
    const status = getDayStatus(day);

    switch (status) {
      case "present":
        return "green";
      case "incomplete":
        return "orange";
      case "absent":
        return "red";
      default:
        return isSameMonth(day, currentDate)
          ? isToday(day)
            ? "blue"
            : "gray"
          : "lightgray";
    }
  };

  // Calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart); // how many blanks before 1st

  const navigateMonth = (direction) => {
    setCurrentDate(addMonths(currentDate, direction));
  };

  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>&lt;</button>
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => navigateMonth(1)}>&gt;</button>
      </div>

      <div className="clock-buttons">
        <button onClick={handleClockIn} className="clock-in-btn">
          Clock In
        </button>
        <button onClick={handleClockOut} className="clock-out-btn">
          Clock Out
        </button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* empty slots before 1st of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}

        {/* actual days */}
        {monthDays.map((day) => (
          <div
            key={day.toString()}
            className={`calendar-day ${getDayColor(day)}`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="legend">
        <h3>Attendance Status Guide</h3>
        <p>Here’s what each color in the calendar means:</p>
        <div className="d-flex align-items-center justify-content-center">
          <div className="legend-item">
            <div className="color-box green"></div>
            <span>
              <strong>Present</strong>
            </span>
          </div>

          <div className="legend-item">
            <div className="color-box orange"></div>
            <span>
              <strong>Incomplete</strong>
            </span>
          </div>

          <div className="legend-item">
            <div className="color-box red"></div>
            <span>
              <strong>Absent</strong>
            </span>
          </div>

          <div className="legend-item">
            <div className="color-box blue"></div>
            <span>
              <strong>Today</strong>
            </span>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AttendanceCalendar;
