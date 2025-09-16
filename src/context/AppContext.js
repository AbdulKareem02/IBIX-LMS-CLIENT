import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [isUserLogin, setUserLogin] = useState(true);
  const [employeeMailId, setEmployeeMailId] = useState("");
  const [employeeName, setEmployeeName] = useState("IBIX Employee");

  useEffect(() => {
    switch (employeeMailId) {
      case "kareem@ibix.in":
        setEmployeeName("Abdul Kareem");
        break;
      case "shaikjelani@ibix.in":
        setEmployeeName("Shaik Jelani Basha");
        break;
      case "shaikfariyad@ibix.in":
        setEmployeeName("Shaik Fariyad");
        break;
      case "rajkumar@ibix.in":
        setEmployeeName("Raj Kumar");
        break;
      case "shaiksonu@ibix.in":
        setEmployeeName("Shaik Sonu");
        break;
      case "anushka@ibix.in":
        setEmployeeName("Anushka");
        break;
      default:
        setEmployeeName("IBIX Warrior");
    }
  }, [employeeMailId]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
