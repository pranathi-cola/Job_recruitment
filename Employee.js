import React from "react";
import { useState } from "react";

const Employee = () => {
  const [username, setUsername] = useState("Employee");

  return (
    <div className="dashboard">
      <h1>Welcome, {username}!</h1>
      <p>This is your employee dashboard.</p>
      <a href="/logout" className="logout-button">Logout</a>
    </div>
  );
};

export default Employee;

// CSS in JS format (can be moved to a separate styles.css file)
const styles = `
.dashboard {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 50px;
}

.logout-button {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 15px;
  text-decoration: none;
  color: white;
  background-color: #ff4d4d;
  border-radius: 5px;
}

.logout-button:hover {
  background-color: #cc0000;
}
`;

// Append styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
