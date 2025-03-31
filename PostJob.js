import React, { useState, useEffect } from "react";

const PostJob = () => {
  // Dummy skills data (in a real app, this might come from an API)
  const skillsData = [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "Python" },
    { id: 3, name: "React" },
    { id: 4, name: "CSS" }
  ];

  // Form state
  const [formData, setFormData] = useState({
    salary: "",
    description: "",
    locations: "",
    title: "",
    job_type: "Full-Time",
    skills: []
  });

  // Flash messages state (for demonstration)
  const [flashMessages, setFlashMessages] = useState([]);

  // Handle text/textarea/select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multi-select changes for skills
  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, skills: selectedOptions }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission (in a real app, submit via fetch or axios)
    console.log("Job Posted:", formData);
    // Add a success flash message
    setFlashMessages([{ category: "success", message: "Job posted successfully!" }]);
    // Reset form fields
    setFormData({
      salary: "",
      description: "",
      locations: "",
      title: "",
      job_type: "Full-Time",
      skills: []
    });
  };

  // Automatically clear flash messages after 3 seconds
  useEffect(() => {
    if (flashMessages.length > 0) {
      const timer = setTimeout(() => setFlashMessages([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessages]);

  return (
    <div className="post-job-container">
      {/* Display flash messages */}
      {flashMessages.map((msg, index) => (
        <div key={index} className={`alert alert-${msg.category}`}>
          {msg.message}
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="salary">Salary:</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Job Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="locations">Location:</label>
        <input
          type="text"
          name="locations"
          value={formData.locations}
          onChange={handleChange}
          required
        />

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="job_type">Job Type:</label>
        <select
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          required
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>

        {/* Multi-select dropdown for skills */}
        <label htmlFor="skills">Select Skills (Qualifications):</label>
        <select
          name="skills"
          id="skills"
          multiple
          value={formData.skills}
          onChange={handleSkillsChange}
          required
        >
          {skillsData.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

// Embedded CSS styles as a string
const styles = `
  .post-job-container {
    width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    background: #fff;
  }
  .post-job-container form {
    display: flex;
    flex-direction: column;
  }
  .post-job-container label {
    margin: 10px 0 5px;
  }
  .post-job-container input,
  .post-job-container textarea,
  .post-job-container select,
  .post-job-container button {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  .post-job-container button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  .post-job-container button:hover {
    background-color: #0056b3;
  }
  .alert {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
`;

// Append the embedded CSS to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PostJob;
