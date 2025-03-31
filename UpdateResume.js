import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const UpdateResume = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const [resume, setResume] = useState("");
    const [message, setMessage] = useState(null);

    // Fetch the current resume from the backend
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch("/resume", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: id }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch resume");
                }

                const data = await response.json();
                console.log(data)
                if (data.length > 0) {
                    setResume(data|| "");
                } else {
                    setResume("");
                }
            } catch (error) {
                console.error("Error fetching resume:", error);
                setMessage({ text: "Error fetching resume", type: "error" });
            }
        };

        if (id) {
            fetchResume();
        }
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        setResume(e.target.value);
    };

    // Handle resume submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/update_resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: id, resume: resume }),
            });

            if (!response.ok) {
                throw new Error("Failed to update resume");
            }

            setMessage({ text: "Resume updated successfully!", type: "success" });

            // Fetch updated resume after updating
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            console.error("Error updating resume:", error);
            setMessage({ text: "Failed to update resume", type: "error" });
        }
    };

    return (
        <div className="update-resume-container">
            <h2>Update Your Resume</h2>

            {message && <div className={message.type}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="resume">Resume:</label>
                <br />
                <textarea
                    id="resume"
                    name="resume"
                    rows="5"
                    cols="50"
                    value={resume}
                    onChange={handleChange}
                ></textarea>
                <br />
                <br />
                <button type="submit">Update Resume</button>
            </form>
            <br />
            <Link to="/employee_dashboard" state={{id: id}}>Back to Dashboard</Link>
        </div>
    );
};

// Embedded CSS
const styles = `
  .update-resume-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .update-resume-container h2 {
    text-align: center;
  }
  .update-resume-container label {
    font-weight: bold;
  }
  .update-resume-container textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .update-resume-container button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .update-resume-container button:hover {
    background-color: #0056b3;
  }
  .update-resume-container a {
    display: block;
    text-align: center;
    margin-top: 20px;
    text-decoration: none;
    color: #007bff;
  }
  .update-resume-container a:hover {
    text-decoration: underline;
  }
  .success {
    color: green;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
  .error {
    color: red;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
`;

// Apply styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UpdateResume;
