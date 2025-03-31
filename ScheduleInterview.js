import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScheduleInterview = () => {
  const location = useLocation();
  const { applicant, jobid, user } = location.state || {};
  const navigate = useNavigate();
  // Manage form state for interview time and mode
  console.log(applicant, jobid, user)
  const [formData, setFormData] = useState({
    time: "",
    mode: "Online"
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data payload to send
    const dataToSend = {
      applicant: applicant, // ID of the candidate
      jobid: jobid,         // Job ID for which the interview is scheduled
      time: formData.time,
      mode: formData.mode
    };

    try {
      const response = await fetch("/schedule_interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        throw new Error("Failed to schedule interview.");
      }
      const result = await response.json();
      // Optionally, navigate back or reset form
    } catch (err) {
      setError(err.message);
    }
    // Reset the form after submission
    setFormData({
      time: "",
      mode: "Online"
    });
  };

  return (
    <div className="schedule-interview-container">
      <h2>Schedule Interview</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="time">Interview Time:</label>
        <input
          type="datetime-local"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label htmlFor="mode">Interview Mode:</label>
        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          required
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <button type="submit" className="confirm-btn">
          Confirm Interview
        </button>
      </form>
    </div>
  );
};

// Embedded CSS styles as a JavaScript string
const styles = `
  .schedule-interview-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .schedule-interview-container h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  .schedule-interview-container form {
    display: flex;
    flex-direction: column;
  }
  .schedule-interview-container label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  .schedule-interview-container input,
  .schedule-interview-container select {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  .confirm-btn {
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  .confirm-btn:hover {
    background-color: #218838;
  }
`;

// Append the embedded CSS to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ScheduleInterview;
