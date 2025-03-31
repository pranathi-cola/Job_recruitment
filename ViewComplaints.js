import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistically update the UI
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.ID === id ? { ...complaint, Status: newStatus } : complaint
      )
    );

    // Save the action to the database via a POST request
    try {
      const response = await fetch('/update_complaint_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      console.log("Status update saved:", result);
    } catch (error) {
      console.error("Error saving status update:", error);
      alert("Failed to update status in database");
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('/complaints_page', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setComplaints(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        alert('Failed to load complaints');
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="container">
      <h1>All Complaints</h1>
      <div className="complaints-table">
        <div className="table-header">
          <div className="header-cell">User Type</div>
          <div className="header-cell">User Name</div>
          <div className="header-cell">Description</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Action</div>
        </div>
        {complaints.map((complaint) => (
          <div className="table-row" key={complaint.ID}>
            <div className="cell">{complaint.UserType}</div>
            <div className="cell">{complaint.UserName}</div>
            <div className="cell">{complaint.Description}</div>
            <div className="cell">{complaint.Status}</div>
            <div className="cell">
              <select
                value={complaint.Status}
                onChange={(e) => handleStatusChange(complaint.ID, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <Link to="/admin_dashboard">
        <button
          className="back-btn"
          onClick={() => alert("Returning to Dashboard")}
        >
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

// Inline CSS using Flex layout and keeping original color scheme
const styles = `
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    overflow-x: auto;
  }
  .complaints-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
  }
  .table-header, .table-row {
    display: flex;
    width: 100%;
  }
  .header-cell, .cell {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
    word-wrap: break-word;
  }
  .table-header {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  .back-btn {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  .back-btn:hover {
    background-color: #0056b3;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ComplaintsPage;
