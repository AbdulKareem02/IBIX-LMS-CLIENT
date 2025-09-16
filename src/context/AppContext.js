import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [isUserLogin, setUserLogin] = useState(true);
  const [employeeMailId, setEmployeeMailId] = useState("");
  const [employeeName, setEmployeeName] = useState("IBIX Employee");
  const [employeeRole, setEmployeeRole] = useState("IBIX Employee");

  // Check login status once when app starts
  useEffect(() => {
    const getData = localStorage.getItem("employee");
    if (getData === null) {
      setUserLogin(false);
    } else {
      setUserLogin(true);
      const empData = JSON.parse(localStorage.getItem("employee"));
      setEmployeeMailId(empData.id);
      setUserLogin(true);
    }
  }, []); // ✅ no dependencies

  // Store login state when it changes
  useEffect(() => {
    const empData = {
      id: employeeMailId,
      status: isUserLogin,
    };

    if (isUserLogin) {
      localStorage.setItem("employee", JSON.stringify(empData));
    }
  }, [isUserLogin, employeeMailId]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
