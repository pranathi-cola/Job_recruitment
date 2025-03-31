import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const user_id = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resume: "",
    email: ""
  });

  const [flashMessage, setFlashMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/register_employee", { // ✅ Corrected API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,  // ✅ Include user_id in the request
          resume: formData.resume,
          email: formData.email
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        setFlashMessage({ type: "success", message: data.message });
        alert(data.message); // Show a success alert

        if (data.redirect) {
          console.log("Navigating to:", data.redirect);
          navigate(data.redirect);
        }
      } else {
        setFlashMessage({ type: "error", message: data.error });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFlashMessage({ type: "error", message: "Server error, please try again later." });
    }
  };

  return (
    <div className="register-employee-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="resume">Resume:</label>
        <textarea
          name="resume"
          value={formData.resume}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
};

// Embedded CSS
const styles = `
  .register-employee-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .register-employee-container form {
    display: flex;
    flex-direction: column;
  }
  .register-employee-container label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  .register-employee-container textarea,
  .register-employee-container input {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  .register-employee-container button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  .register-employee-container button:hover {
    background-color: #0056b3;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RegisterEmployee;