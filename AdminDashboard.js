import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);  // Initially set to null
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/admin_dashboard") // Update URL if needed
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard data");
                }
                return response.json();
            })
            .then(data => setDashboardData(data))
            .catch(error => setError(error.message));
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!dashboardData) {
        return <p>Loading...</p>; // Prevents "Cannot read properties of null" error
    }

    return (
        <div className="admin-dashboard">
            <div className="header">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="container">
                <h3>Welcome, Admin</h3>

                <div className="card">
                    <h4>Total Users: {dashboardData.totalUsers}</h4>
                    <Link to="/view_users">
                        <a href="/users">View All</a>
                    </Link>
                </div>

                <div className="card">
                    <h4>Total Recruiters: {dashboardData.totalRecruiters}</h4>
                </div>

                <div className="card">
                    <h4>Total Candidates: {dashboardData.totalCandidates}</h4>
                </div>

                <div className="card">
                    <h4>Total Jobs Posted: {dashboardData.totalJobs}</h4>
                </div>

                <div className="card">
                    <h4>Open Jobs: {dashboardData.openJobs}</h4>
                </div>

                <div className="card">
                    <h4>Total Applications: {dashboardData.totalApplications}</h4>
                </div>

                <div className="card">
                    <h4>Scheduled Interviews: {dashboardData.scheduledInterviews}</h4>
                </div>

                <div className="card">
                    <h4>Recent Complaints</h4>
                    <ul>
                        {dashboardData.recentComplaints.map(complaint => (
                            <li key={complaint.id}>
                                {complaint.text} - <strong>Status:</strong> {complaint.status}
                            </li>
                        ))}
                    </ul>
                    <Link to="/complaints_page">
                        <a href="/complaints">Manage Complaints</a>
                    </Link>
                </div>

                <Link to="/login">
                    <a href="/logout" className="logout">Logout</a>
                </Link>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    font-family: Arial, sans-serif;
                    background: #f4f4f4;
                    min-height: 100vh;
                }

                .header {
                    background: #007bff;
                    color: white;
                    padding: 15px;
                    text-align: center;
                }

                .container {
                    width: 80%;
                    margin: 20px auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .card {
                    background: #ffffff;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card h4 {
                    margin: 0;
                }

                .card a {
                    text-decoration: none;
                    background: #007bff;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    transition: background 0.3s;
                }

                .card a:hover {
                    background: #0056b3;
                }

                .logout {
                    display: inline-block;
                    padding: 10px;
                    margin-top: 15px;
                    background: red;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    text-align: center;
                    width: 100%;
                    transition: background 0.3s;
                }

                .logout:hover {
                    background: darkred;
                }

                ul {
                    padding-left: 20px;
                    margin: 10px 0;
                }

                li {
                    margin: 5px 0;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;