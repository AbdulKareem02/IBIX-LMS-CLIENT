import { Route, Routes } from "react-router-dom";
import "./App.css";
import "antd/dist/reset.css";
import LoginForm from "./components/Login";
import Home from "./components/Home";
import LeaveRequestForm from "./components/ApplyLeave";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected group */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/apply-leave" element={<LeaveRequestForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
