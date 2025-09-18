import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [isUserLogin, setUserLogin] = useState(false);
  const [employeeMailId, setEmployeeMailId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "home"
  );

  // Check login status once when app starts
  useEffect(() => {
    const getData = localStorage.getItem("employee");
    if (getData === null) {
      setUserLogin(false);
    } else {
      const parseData = JSON.parse(getData);
      setUserLogin(true);
      setEmployeeMailId(parseData.id);
      setEmployeeName(parseData.name);
      setEmployeeRole(parseData.role);
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
    }
  }, [isUserLogin, employeeMailId, employeeName, employeeRole]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
