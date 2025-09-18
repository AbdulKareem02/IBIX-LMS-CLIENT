import React, { useContext, useEffect, useState } from "react";

import "./index.css";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUserLogin, setEmployeeMailId, setEmployeeName, setEmployeeRole } =
    useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/employees/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (data.message === "Login successful" && data.token !== "") {
        setUserLogin(true);
        setEmployeeMailId(data.mail);
        setEmployeeName(data.name);
        setEmployeeRole(data.designation);
        setLoginStatus("");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Failed to login. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" container-fluid overflow-hidden">
      <div className="row align-items-center">
        <div className="col-12 col-lg-6 ">
          <div className="bg-white p-5 logo-cont d-none d-lg-block">
            <img
              src="https://iqteche.in/static/media/wl_client_images/5267335d68274f459cc598d0433650dc.png"
              alt=""
              className="login-page-image "
            />
            <p className="login-tagline">Learn Today, Lead Tomorrow</p>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="login-form-cont d-flex align-items-center justify-content-center">
            <div className="login-card shadow ">
              <div className="p-5 logo-cont d-lg-none">
                <img
                  src="https://iqteche.in/static/media/wl_client_images/5267335d68274f459cc598d0433650dc.png"
                  alt=""
                  className="w-100"
                />
                <p className="login-tagline">Learn Today, Lead Tomorrow</p>
              </div>
              <div className="login-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue your journey</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form" noValidate>
                {errors.submit && (
                  <div className="error-message submit-error">
                    {errors.submit}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password ">Password</label>
                  <div className="password-input-container">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.password ? "error" : ""
                      }`}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>

                {/* <div className="form-options">
                  <label className="checkbox-container">
                    Remember me
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                  </label>

                  <a href="#forgot" className="forgot-link">
                    Forgot password?
                  </a>
                </div> */}
                <p style={{ color: "red" }}>{loginStatus}</p>

                <button
                  type="submit"
                  className={`login-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
