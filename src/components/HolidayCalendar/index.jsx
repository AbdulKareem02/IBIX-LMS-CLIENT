import React, { useState } from "react";
import "./index.css";

const HolidayCalendar = () => {
  // Sample holiday data - in a real app, this would come from an API
  const holidays = [
    { id: 5, date: "2025-08-15", name: "Independence Day", type: "public" },
    {
      id: 6,
      date: "2025-10-02",
      name: "Gandhi Jayanti & Vijayadasami",
      type: "public",
    },
    { id: 7, date: "2025-10-20", name: "Deepavali", type: "regional" },
    { id: 8, date: "2025-12-25", name: "Christmas Day", type: "regional" },
  ];

  const [selectedYear, setSelectedYear] = useState(2024);
  const [filter, setFilter] = useState("all"); // 'all', 'public', 'regional'

  // Filter holidays based on selection
  const filteredHolidays = holidays.filter((holiday) => {
    const holidayYear = new Date(holiday.date).getFullYear();
    return (
      holidayYear === selectedYear &&
      (filter === "all" || holiday.type === filter)
    );
  });

  // Group holidays by month
  const holidaysByMonth = filteredHolidays.reduce((acc, holiday) => {
    const date = new Date(holiday.date);
    const month = date.toLocaleString("default", { month: "long" });

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(holiday);
    return acc;
  }, {});

  return (
    <div className="holiday-calendar">
      <div className="calendar-header">
        <h2>Company Holiday Calendar</h2>
        <p>Plan your time off with our festival and holiday schedule</p>
      </div>

      <div className="calendar-controls">
        <div className="year-selector">
          <label>Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Holidays
          </button>
          <button
            className={filter === "public" ? "active" : ""}
            onClick={() => setFilter("public")}
          >
            Public Holidays
          </button>
          <button
            className={filter === "regional" ? "active" : ""}
            onClick={() => setFilter("regional")}
          >
            Regional Holidays
          </button>
        </div>
      </div>

      <div className="holiday-list">
        {Object.keys(holidaysByMonth).length > 0 ? (
          Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
            <div key={month} className="month-section">
              <h3 className="month-header">
                {month} {selectedYear}
              </h3>
              <div className="holiday-cards">
                {monthHolidays.map((holiday) => (
                  <div key={holiday.id} className="holiday-card">
                    <div className="holiday-date">
                      {new Date(holiday.date).getDate()}
                    </div>
                    <div className="holiday-info">
                      <h4>{holiday.name}</h4>
                      <span className={`holiday-type ${holiday.type}`}>
                        {holiday.type === "public"
                          ? "Public Holiday"
                          : "Regional Holiday"}
                      </span>
                    </div>
                    <div className="holiday-day">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-holidays">
            <p>No holidays found for the selected year and filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;
