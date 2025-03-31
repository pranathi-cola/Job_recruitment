import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ViewJobs = () => {
  const location = useLocation();
  const { id: candidateId } = location.state || {};
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  console.log(candidateId);

  useEffect(() => {
    fetch("/jobs", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        console.log(data)
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    let sortedJobs = [...jobs];
    if (event.target.value === "salary") {
      sortedJobs.sort((a, b) => b.Salary - a.Salary);
    } else if (event.target.value === "title") {
      sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sortedJobs.sort((a, b) => new Date(b.TimeOfPosting) - new Date(a.TimeOfPosting));
    }
    setJobs(sortedJobs);
  };

  const applyForJob = (jobId) => {
    fetch("/view_job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: candidateId, job_id: jobId }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error applying for job:", error));
  };

  return (
    <div className="container">
      <h2>Available Jobs</h2>
      <label htmlFor="sort_by">Sort by:</label>
      <select id="sort_by" value={sortBy} onChange={handleSortChange}>
        <option value="date">Newest</option>
        <option value="salary">Salary</option>
        <option value="title">Title</option>
      </select>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Salary</th>
              <th>Employer</th>
              <th>Posted On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.title}</td>
                <td>{job.Description}</td>
                <td>{job.Type}</td>
                <td>₹{job.Salary}</td>
                <td>{job.Name}</td>
                <td>{new Date(job.TimeOfPosting).toLocaleDateString()}</td>
                <td>
                  <button
                    className="apply-btn"
                    onClick={() => applyForJob(job.Job_ID)} // Use job.job_id
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};


// Inline CSS
const styles = `
  .container {
    max-width: 900px;
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
  .apply-btn {
    background-color: green;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  .apply-btn:hover {
    background-color: darkgreen;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ViewJobs;
