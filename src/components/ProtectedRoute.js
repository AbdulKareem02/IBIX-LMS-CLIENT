import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isUserLogin, employeeMailId } = useContext(AppContext);

  if (employeeMailId === "" && !isUserLogin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
