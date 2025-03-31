import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [formData, setFormData] = useState({ admin_username: "", admin_password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending data:", formData); // Debugging log

        try {
            // Correcting the axios request
            const response = await axios.post("/admin_login", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Send session cookies
            });

            // Server response is directly available as JSON
            const data = response.data;
            console.log("Server Response:", data); // Debugging log

            if (response.status === 200) {
                navigate(data.redirect); // Redirect on success
            } else {
                setErrorMessage(data.error || "Invalid credentials!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Server error! Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="admin_username">Username:</label>
                    <input
                        type="text"
                        id="admin_username"
                        name="admin_username"
                        value={formData.admin_username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="admin_password">Password:</label>
                    <input
                        type="password"
                        id="admin_password"
                        name="admin_password"
                        value={formData.admin_password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
