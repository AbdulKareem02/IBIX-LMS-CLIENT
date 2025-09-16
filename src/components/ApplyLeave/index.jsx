import React, { useState } from "react";
import "./index.css";

const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    leaveType: "vacation",
    startDate: "",
    endDate: "",
    // duration: "",
    reason: "",
    contactInfo: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    // Calculate duration if both dates are selected
    if (
      (name === "startDate" || name === "endDate") &&
      formData.startDate &&
      formData.endDate
    ) {
      // calculateDuration();
    }
  };

  // const calculateDuration = () => {
  //   if (formData.startDate && formData.endDate) {
  //     const start = new Date(formData.startDate);
  //     const end = new Date(formData.endDate);
  //     const diffTime = Math.abs(end - start);
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       duration: diffDays,
  //     }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required";
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for leave is required";
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = "Contact information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form submission logic would go here

      try {
        await fetch("", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          mode: "no-cors",
        });

        setFormData({
          employeeName: "",
          employeeId: "",
          leaveType: "vacation",
          startDate: "",
          endDate: "",
          // duration: "",
          reason: "",
          contactInfo: "",
          status: "pending",
        });

        setErrors({});
        alert("Leave request submitted successfully!");
        console.log("Form submitted:", formData);
      } catch (err) {
        console.error("❌ Submission failed", err);
      }

      // Reset form after submission
      setFormData({
        employeeName: "",
        employeeId: "",
        leaveType: "vacation",
        startDate: "",
        endDate: "",
        // duration: "",
        reason: "",
        contactInfo: "",
        status: "pending",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      leaveType: "vacation",
      startDate: "",
      endDate: "",
      // duration: "",
      reason: "",
      contactInfo: "",
      status: "pending",
    });
    setErrors({});
  };

  return (
    <div className="leave-request">
      <div className="leave-request__container">
        <h1 className="leave-request__title">Leave Request Application</h1>

        <form className="leave-request__form" onSubmit={handleSubmit}>
          <div className="leave-request__form-group">
            <label htmlFor="employeeName" className="leave-request__label">
              Employee Name *
            </label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className={`leave-request__input ${
                errors.employeeName ? "leave-request__input--error" : ""
              }`}
              placeholder="Enter your full name"
            />
            {errors.employeeName && (
              <span className="leave-request__error">
                {errors.employeeName}
              </span>
            )}
          </div>

          <div className="leave-request__form-group">
            <label htmlFor="employeeId" className="leave-request__label">
              Employee ID *
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={`leave-request__input ${
                errors.employeeId ? "leave-request__input--error" : ""
              }`}
              placeholder="Enter your employee ID"
            />
            {errors.employeeId && (
              <span className="leave-request__error">{errors.employeeId}</span>
            )}
          </div>

          <div className="leave-request__form-group">
            <label htmlFor="leaveType" className="leave-request__label">
              Leave Type *
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="leave-request__select"
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="bereavement">Bereavement Leave</option>
            </select>
          </div>

          <div className="leave-request__form-row">
            <div className="leave-request__form-group">
              <label htmlFor="startDate" className="leave-request__label">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`leave-request__input ${
                  errors.startDate ? "leave-request__input--error" : ""
                }`}
              />
              {errors.startDate && (
                <span className="leave-request__error">{errors.startDate}</span>
              )}
            </div>

            <div className="leave-request__form-group">
              <label htmlFor="endDate" className="leave-request__label">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`leave-request__input ${
                  errors.endDate ? "leave-request__input--error" : ""
                }`}
              />
              {errors.endDate && (
                <span className="leave-request__error">{errors.endDate}</span>
              )}
            </div>

            {/* <div className="leave-request__form-group">
              <label htmlFor="duration" className="leave-request__label">
                Duration (Days)
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                readOnly
                className="leave-request__input leave-request__input--readonly"
              />
            </div> */}
          </div>

          <div className="leave-request__form-group">
            <label htmlFor="reason" className="leave-request__label">
              Reason for Leave *
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={`leave-request__textarea ${
                errors.reason ? "leave-request__textarea--error" : ""
              }`}
              placeholder="Please provide a reason for your leave request"
              rows="4"
            ></textarea>
            {errors.reason && (
              <span className="leave-request__error">{errors.reason}</span>
            )}
          </div>

          <div className="leave-request__form-group">
            <label htmlFor="contactInfo" className="leave-request__label">
              Contact Information During Leave *
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className={`leave-request__input ${
                errors.contactInfo ? "leave-request__input--error" : ""
              }`}
              placeholder="Phone number or email where you can be reached"
            />
            {errors.contactInfo && (
              <span className="leave-request__error">{errors.contactInfo}</span>
            )}
          </div>

          <div className="leave-request__form-actions">
            <button
              type="button"
              className="leave-request__button leave-request__button--reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="submit"
              className="leave-request__button leave-request__button--submit"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
