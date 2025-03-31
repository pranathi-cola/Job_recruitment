import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  // State for toggling between login and register forms ("", "login", or "register")
  const [activeForm, setActiveForm] = useState("");
  // Dummy state for flash messages (would be populated by server in a real app)
  const [flashMessages, setFlashMessages] = useState([
    // Example: { category: "success", message: "Welcome back!" }
  ]);
  const [userType, setUserType] = useState(""); // Store user type on login
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    if (userType === "Employee") {
      navigate("/employeedashboard");
    } else if (userType === "Employer") {
      navigate("/employerdashboard");
    }
  };

  // Hide flash messages after 3 seconds
  useEffect(() => {
    if (flashMessages.length > 0) {
      const timer = setTimeout(() => {
        setFlashMessages([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessages]);

  // Handlers to show forms
  const showForm = (type) => {
    setActiveForm(type);
  };

  return (
    <div className="container">
      {/* Flash Messages */}
      {flashMessages.map((msg, index) => (
        <div key={index} className={`alert alert-${msg.category}`}>
          {msg.message}
        </div>
      ))}

      <h2>Welcome!</h2>
      <div className="button-group">
        <button onClick={() => showForm("login")}>Login</button>
        <button onClick={() => showForm("register")}>Register</button>
      </div>

      {/* Login Form */}
      <div className={activeForm === "login" ? "" : "hidden"}>
        <h3>Login</h3>
        <form action="/login" method="POST" onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <select onChange={(e) => setUserType(e.target.value)} required>
            <option value="">Select User Type</option>
            <option value="Employer">Recruiter</option>
            <option value="Employee">Candidate</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>

      {/* Register Form */}
      <div className={activeForm === "register" ? "" : "hidden"}>
        <h3>Register</h3>
        <form action="/register" method="POST">
          <input type="text" name="name" placeholder="Full Name" required />
          <input type="text" name="username" placeholder="Username" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <select name="user_type" required>
            <option value="">Select User Type</option>
            <option value="Employer">Recruiter</option>
            <option value="Employee">Candidate</option>
          </select>
          <Link to="/login">
            <button type="submit">Register</button>
          </Link>
        </form>
      </div>

      <br />

      {/* Admin Login Button */}
      <form method="GET" action="/admin-login">
        <Link to="/adminlogin">
          <button type="submit" className="admin-btn">
            Login as Admin
          </button>
        </Link>
      </form>
    </div>
  );
};

// Embedded CSS as a string
const styles = `
  body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #f4f4f4;
  }
  .container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 350px;
    text-align: center;
  }
  input, button, select {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  button {
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  .hidden {
    display: none;
  }
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  .button-group button {
    width: 48%;
  }
  .alert {
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
  }
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }
  .admin-btn {
    background: red;
  }
`;

// Append the embedded CSS to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoginRegister;
