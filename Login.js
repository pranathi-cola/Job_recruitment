import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Use this to redirect after login

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    try {
      const response = await fetch("/login", {
        method: "POST", // Use POST for sending data
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Enable session cookies
        body: JSON.stringify(formData), // Convert formData to JSON string
      });
  
      // Parse the JSON response
      const data = await response.json();
      console.log(data);
      const username = data.user;
      const id = data.id;

      if (data.usertype==="Employee") {
        navigate('/employee_dashboard', { state: { username, id } });
      } else if (data.usertype==="Employer") {
        navigate('/employer_dashboard', { state: { username, id } });
      } else {
        setErrorMessage("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Server error! Please try again later.");
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Show error message if login fails */}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Login</button>
      </form>

      <br />

      {/* Admin Login Button */}
      <button onClick={() => navigate("/admin_login")}>Login as Admin</button>
    </div>
  );
};

// Embedded CSS styles (Fixed syntax issue)
const styles = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f4f4f4;
  }
  .login-container {
    background: white;
    padding: 20px;
    max-width: 400px;
    margin: 40px auto;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    text-align: center;
  }
  .flash-messages {
    margin-bottom: 15px;
  }
  .flash-messages p {
    margin: 5px 0;
  }
  .form-group {
    margin: 10px 0;
    text-align: left;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
`;

// Append the CSS to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Login;
