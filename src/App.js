import { Route, Routes } from "react-router-dom";
import "antd/dist/reset.css";
import LoginForm from "./components/Login";
import Home from "./components/Home";
import LeaveRequestForm from "./components/ApplyLeave";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/apply-leave" element={<LeaveRequestForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
