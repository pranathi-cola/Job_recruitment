import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const EmployerDashboard = () => {
    const location = useLocation();
    const { username, id } = location.state || {};
    console.log(username, id);
    return (
        <div className="dashboard-container">
            <h1>Welcome, {username || 'Guest'}</h1>
            <Link to="/view_applicants" state= {{ id: id }}>
                <button>
                    View Job Applicants
                </button>
            </Link>
            <Link to="/employer" state= {{id: id}}>
                <button>
                    Post a New Job
                </button>
            </Link>
            <Link to="/edit_job" state={{id: id}}>
                <button>
                    Edit a Job
                </button>
            </Link>
            <Link to="/submit_complaint" state= {{id: id}}>
                <button>
                    Submit Complaint
                </button>
            </Link>
            <Link to="/review" state= {{id: id}}>
                <button>
                    Write Review
                </button>
            </Link>
            <Link to="/viewscheduled_interviews" state={{id: id, employee: 0}}>
                <button>
                    View Interviews
                </button>
            </Link>
            <Link to="/login">
                <button>
                    Logout
                </button>
            </Link>
        </div>
    );
};

// Embedded CSS styles
const styles = `
  body {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    margin: 0;
    position: relative;
  }

  .dashboard-container {
    max-width: 600px;
    margin: 0 auto;
  }

  button {
    display: block;
    margin: 10px auto;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: 220px;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default EmployerDashboard;
