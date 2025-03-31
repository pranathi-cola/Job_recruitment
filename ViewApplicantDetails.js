import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const ApplicantDetails = () => {
  const location = useLocation();
  const { user, applicant } = location.state || {}; // Passed as IDs
  const navigate = useNavigate();

  const [applicantDetails, setApplicantDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !applicant) {
      setError("Invalid access. Required data not provided.");
      return;
    }

    const fetchApplicantDetails = async () => {
      try {
        const response = await fetch(
          `/applicant_details?user=${user}&applicant=${applicant}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applicant details.");
        }
        const data = await response.json();
        // data.jobs is an array of arrays; use the first record
        if (data.jobs && data.jobs.length > 0) {
          const record = data.jobs[0];
          const applicantObj = {
            id: record[0],
            name: record[1],
            username: record[2],
            email: record[3],
            resume: record[4],
            skills: record[5],
            jobIDs: record[6],    // e.g., "5,6,7"
            jobTitles: record[7]   // e.g., "Database Developer,IT Consultant,IT Job"
          };
          setApplicantDetails(applicantObj);
        } else {
          setError("No applicant details found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplicantDetails();
  }, [user, applicant, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!applicantDetails) {
    return <div>Loading...</div>;
  }

  // Convert comma-separated job IDs and titles to an array of job objects
  const appliedJobs =
    applicantDetails.jobIDs && applicantDetails.jobTitles
      ? applicantDetails.jobIDs.split(",").map((jobId, index) => {
          const jobTitlesArr = applicantDetails.jobTitles.split(",");
          return {
            id: jobId,
            title: jobTitlesArr[index] || "Untitled Job"
          };
        })
      : [];

  return (
    <div className="container">
      <h2>Applicant Details</h2>
      <p>
        <strong>Name:</strong> {applicantDetails.name}
      </p>
      <p>
        <strong>Email:</strong> {applicantDetails.email}
      </p>
      <p>
        <strong>Resume:</strong>{" "}
        {applicantDetails.resume ? (
          <a
            href={applicantDetails.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        ) : (
          "Not available"
        )}
      </p>
      <p>
        <strong>Skills:</strong> {applicantDetails.skills}
      </p>

      <h3>Applied Jobs</h3>
      {appliedJobs.length > 0 ? (
        <ul>
          {appliedJobs.map((job) => (
            <li key={job.id}>
              <strong>{job.title}</strong> (Job ID: {job.id})
              <Link to="/schedule_interview" state={{applicant: applicant, jobid: job.id, user: user}}>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    scheduleInterview(applicantDetails.id, job.id)
                  }
                >
                  Schedule Interview
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-danger">No jobs applied.</p>
      )}
      <Link to="/viewapplicants" state={{id: user}}>
        <button className="btn btn-secondary">Back to Applicants</button>
      </Link>
    </div>
  );
};

const scheduleInterview = (candId, jobId) => {
  alert(`Scheduling interview for Candidate ID: ${candId}, Job ID: ${jobId}`);
};

export default ApplicantDetails;

// CSS (inside the same JS file for single file requirement)
const styles = `
  .container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .btn {
    display: inline-block;
    margin: 10px 0;
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
  }
  .btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
  }
  .text-danger {
    color: red;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
