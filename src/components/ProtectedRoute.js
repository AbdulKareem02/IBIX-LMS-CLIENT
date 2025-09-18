import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const getData = JSON.parse(localStorage.getItem("employee"));
  if (getData === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
