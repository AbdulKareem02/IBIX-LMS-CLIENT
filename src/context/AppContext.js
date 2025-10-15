import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [employee, setEmployee] = useState({});
  const [isUserLogin, setUserLogin] = useState(false);
  const [employeeMailId, setEmployeeMailId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [empIdStatus, setEmpIdStatus] = useState("");
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "home"
  );

  // Check login status once when app starts

  useEffect(() => {
    const getData = localStorage.getItem("employeeData");
    if (getData === null) {
      setUserLogin(false);
    } else {
      const parseData = JSON.parse(getData);
      setUserLogin(true);
      setEmployee(parseData);
    }
  }, []); // ✅ no dependencies
  // Store login state when it changes
  useEffect(() => {
    const empData = {
      id: employeeMailId,
      status: isUserLogin,
      name: employeeName,
      role: employeeRole,
    };

    if (isUserLogin) {
      localStorage.setItem("employee", JSON.stringify(empData));
      localStorage.setItem("employeeData", JSON.stringify(employee));
    }
  }, [isUserLogin, employeeMailId, employeeName, employeeRole, employee]);

  useEffect(() => {
    if (isUserLogin) {
      fetch(`${process.env.REACT_APP_BASE_URL}/get-students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee: employeeMailId }),
      })
        .then((response) => response.json())
        .then((resp) => {
          // ensure each item has a unique key property for antd Table
          const normalized = (resp.data || []).map((item, idx) => ({
            key: item.studentId || item.id || idx,
            ...item,
          }));
          setStudents(normalized);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }
    // include employeeMailId in deps so it re-fetches when it changes
  }, [employeeMailId, isUserLogin]);

  return (
    <AppContext.Provider
      value={{
        isUserLogin,
        setUserLogin,
        employeeMailId,
        setEmployeeMailId,
        employeeName,
        setEmployeeName,
        employeeRole,
        setEmployeeRole,
        activeTab,
        setActiveTab,
        students,
        setStudents,
        empIdStatus,
        setEmpIdStatus,
        employee,
        setEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
