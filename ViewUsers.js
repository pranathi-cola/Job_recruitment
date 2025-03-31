import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/view_users', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) 
        {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>All Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>User Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.Name}</td>
              <td>{user.Username}</td>
              <td>{user.UserType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin_dashboard">
        <button className="btn" onClick={() => alert("Returning to Dashboard")}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

// Inline CSS
const styles = `
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .table th {
    background-color: #f4f4f4;
  }
  .btn {
    display: inline-block;
    margin-top: 20px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  .btn:hover {
    background-color: #0056b3;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ViewUsers;
