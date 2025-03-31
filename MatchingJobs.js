import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const MatchingJobs = () => {
  const location = useLocation();
  const { id } = location.state || {};

  const [perfectMatchJobs, setPerfectMatchJobs] = useState([]);
  const [partialMatchJobs, setPartialMatchJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJobs = async () => {
        try {
            const response = await fetch("/matching_jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Check data structure immediately after receiving
            console.log("Raw API response:", data);
            
            setPerfectMatchJobs(data.perfect || []);
            setPartialMatchJobs(data.partial || []);
            console.log(perfectMatchJobs)
            console.log(partialMatchJobs)

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchJobs();
}, [id]);

  const applyJob = (jobId) => {
    fetch("/matching_jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error applying for job:", error));
  };

  

  return (
    <div className="matching-jobs-container">
      <h2>Perfectly Matching Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : perfectMatchJobs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Salary</th>
              <th>Employer</th>
              <th>Apply</th>
            </tr>
          </thead>
          <tbody>
            {perfectMatchJobs.map((job) => (
              <tr key={job.Job_ID}>
                <td>{job.Job_ID}</td>
                <td>{job.Title}</td>
                <td>{job.Description}</td>
                <td>{job.Type}</td>
                <td>₹{job.Salary}</td>
                <td>{job.Employer}</td>
                <td>
                  <button className="apply-link" onClick={() => applyJob(job.Job_ID)}>
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-jobs">No perfect matches found.</p>
      )}

      <h2>Jobs Matching At Least One Skill</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : partialMatchJobs.length > 0 ? (
        <table>
          <thead>
            <tr>
            <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Salary</th>
              <th>Employer</th>
              <th>Apply</th>
            </tr>
          </thead>
          <tbody>
            {partialMatchJobs.map((job) => (
              <tr key={job.Job_ID}>
                <td>{job.Job_ID}</td>
                <td>{job.Title}</td>
                <td>{job.Description}</td>
                <td>{job.Type}</td>
                <td>₹{job.Salary}</td>
                <td>{job.Employer}</td>
                <td>
                  <button className="apply-link" onClick={() => applyJob(job.Job_ID)}>
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-jobs">No partial matches found.</p>
      )}

      <Link to="/employee_dashboard" state={{id: id}} className="back-btn">
        Back to Dashboard
      </Link>
    </div>
  );
};

// Embedded CSS as a JavaScript string
const styles = `
  .matching-jobs-container {
    font-family: Arial, sans-serif;
    margin: 20px;
    padding: 20px;
  }
  h2 {
    color: #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
  }
  .no-jobs {
    color: red;
    font-weight: bold;
    margin-top: 10px;
  }
  .back-btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  .back-btn:hover {
    background-color: #0056b3;
  }
  .apply-link {
    background: none;
    border: none;
    color: green;
    cursor: pointer;
    text-decoration: underline;
    font-size: 1em;
  }
`;

// Append the CSS styles to the document head so they are applied to the component.
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default MatchingJobs;
