import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ViewApplicants = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Destructure id from location state
  const [jobsWithApplicants, setJobsWithApplicants] = useState({});
  const [error, setError] = useState(null);

  console.log(id);
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!id) {
        setError('Employer ID is required.');
        return;
      }

      try {
        const response = await fetch(`/view_applicants?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicants.');
        }
        const data = await response.json();
        console.log(data.jobs)
        setJobsWithApplicants(data.jobs);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplicants();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Applicants by Job</h2>
      {Object.entries(jobsWithApplicants).map(([jobId, job]) => (
        <div key={jobId}>
          <h3>{job.title || 'Untitled Job'}</h3>
          {job.candidates && job.candidates.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {job.candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.name || 'Unnamed Candidate'}</td>
                    <td>
                      <Link to="/applicant_details" state={{user: id, applicant: candidate.id}} className="btn">
                        View Details
                      </Link>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applicants for this job.</p>
          )}
        </div>
      ))}
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
  .job-title {
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
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
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
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

export default ViewApplicants;
