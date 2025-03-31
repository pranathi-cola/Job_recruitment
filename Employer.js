import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const Employer = () => {
  const location = useLocation();
  const {id} = location.state || {};
  // Set a default username. In a real app, this could come from props, context, or an API call.
  const [username, setUsername] = useState("Employer");
  // Flash messages state (an array of objects with a "category" and "message")
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState([]);
  // Form state for posting a job
  const [skillOptions, setSkillOptions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    qualification: [],
    description: "",
    locations: "",
    job_type: "Full-Time",
  });
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/skills");
        if (!res.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await res.json();
        setSkillOptions(data.skills);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSkills();
  }, []);

  const handleQualificationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, qualification: selected }));
  };

  // Update formData state on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data payload to send
    const dataToSend = {
      empid: id,
      salary: formData.salary,
      description: formData.description,
      locations: formData.locations,
      job_type: formData.job_type,
      skills: formData.qualification,
      title: formData.title
    };

    try {
      const response = await fetch("/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        throw new Error("Failed to schedule interview.");
      }
      const result = await response.json();
      // Optionally, navigate back or reset form
    } catch (err) {
      setError(err.message);
    }
    // Reset the form after submission
    setFormData({
      title: "",
      salary: "",
      qualification: [],
      description: "",
      locations: "",
      job_type: "Full-Time",
    });
  };

  return (
    <div className="container">
      <h2>Employer Dashboard</h2>
      <p>Welcome, {username}! You can post a job below.</p>

      {/* Flash Messages */}
      {messages.map((msg, index) => (
        <div key={index} className={`alert alert-${msg.category}`}>
          {msg.message}
          <button
            className="close-btn"
            onClick={() =>
              setMessages(messages.filter((_, i) => i !== index))
            }
          >
            &times;
          </button>
        </div>
      ))}

      <h3>Post a Job</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            className="form-control"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Salary:</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            required
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Qualification:</label>
          <select
            name="qualification"
            className="form-control"
            multiple
            value={formData.qualification}
            onChange={handleQualificationChange}
          >
            <option value="">-- Select a Skill --</option>
            {skillOptions.map((skill) => (
              <option key={skill.skill_id} value={skill.Name}>
                {skill.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            className="form-control"
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Locations:</label>
          <input
            type="text"
            name="locations"
            className="form-control"
            required
            value={formData.locations}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Job Type:</label>
          <select
            name="job_type"
            className="form-control"
            required
            value={formData.job_type}
            onChange={handleChange}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Post Job
        </button>
      </form>
      <Link to="/login">
      <button>        
        Logout
      </button>
      </Link>
    </div>
  );
};

// CSS styles as a JS string (embedded and appended to the document head)
const styles = `
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h2, h3 {
  text-align: center;
}

p {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.btn {
  display: inline-block;
  padding: 10px 15px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
}

.logout-btn {
  width: 100%;
  margin-top: 20px;
}

.alert {
  position: relative;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-error {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
}
`;

// Append the CSS to the document head so it applies to this component.
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Employer;
