import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const EmployeeDashboard = () => {
  // You can later replace this with props or context data
  const location = useLocation();
  const { username, id } = location.state || {};
  console.log(username, id);
  // Example message state, you can populate this as needed
  const [messages, setMessages] = useState([
    // { category: "success", message: "Profile updated successfully!" }
  ]);

  return (
    <div className="dashboard-container">
      {/* Logout Button */}
      
      {/* Greeting */}
      <h2>Welcome, {username || 'Guest'}!</h2>

      {/* Navigation buttons */}
      <ul className="dashboard-menu">
        <li>
          <Link to="/add_skills" state= {{id: id}}>
          <button>
            Add Skills
          </button>
          </Link>
        </li>
        <li>
          <Link to="/update_resume" state= {{id: id}}>
          <button>
            Update Resume
          </button>
          </Link>
        </li>
        <li>
        <Link to="/submit_complaint" state= {{id: id}}>
        <button>
            Submit Complaint
          </button>
          </Link>
        </li>
        <li>
          <Link to="/view_jobs" state= {{id: id}}>
          <button>
            View All Jobs
          </button>
          </Link>
        </li>
        <li>
          <Link to="/matching_jobs" state= {{id: id}}>
          <button>
            Jobs Matching My Skills
          </button>
          </Link>
        </li>
        <li>
        <Link to="/review" state= {{id: id}}>
          <button>
            Write Review
          </button>
          </Link>
        </li>
        <li>
          <Link to="/viewscheduled_interviews" state= {{id: id, employee: 1}}>
          <button>
            Scheduled Interviews
          </button>
          </Link>
        </li>
      </ul>
      <Link to="/login">
      <button>
        Logout
      </button>
      </Link>


      {/* Flash messages */}
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} className={msg.category}>
            {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
};

// CSS styles as a string
const styles = `
.dashboard-container {
  position: relative;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}

.dashboard-menu {
  list-style-type: none;
  padding: 0;
  margin-top: 40px;
}

.dashboard-menu li {
  margin: 10px 0;
}

.dashboard-menu button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.dashboard-menu button:hover {
  background-color: #0056b3;
}

.messages p {
  margin: 10px 0;
  font-size: 14px;
}

.messages .success {
  color: green;
}

.messages .error {
  color: red;
}
`;

// Append CSS to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default EmployeeDashboard;
