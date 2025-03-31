import React, {useState, useEffect} from "react";
import { useLocation, Link } from "react-router-dom";

const ViewScheduledInterviews = () => {
  const [interviews, setInterview] = useState([]);
  const location = useLocation();
  const {id, employee} = location.state || {};
  console.log(id, employee)
  useEffect(() => {
    const fetchInterview = async () => {
      if(employee==1)
      {
        try {
        const response = await fetch('/viewscheduled_interviews', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setInterview(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching interview:', error);
        alert('Failed to load interview');
      }}
      else
      {
        try {
          console.log(id);
          const response = await fetch('/viewscheduled_interviews_emp', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          const data = await response.json();
          setInterview(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching interview:', error);
          alert('Failed to load interview');
        }
      }
    };
  
    fetchInterview();
  }, [id]);
  
  return (
    <div className="container">
      <h2>Your Scheduled Interviews</h2>
      {interviews.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Date & Time</th>
              <th>Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview, index) => (
              <tr key={index}>
                <td>{interview.title}</td>
                <td>{interview.Time}</td>
                <td>{interview.Mode}</td>
                <td>{interview.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No scheduled interviews.</p>
      )}
      <Link to="/employer_dashboard" state={{id: id}}>
      <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
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
  .btn-secondary {
    display: inline-block;
    margin-top: 20px;
    padding: 8px 12px;
    background-color: #6c757d;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  .btn-secondary:hover {
    background-color: #545b62;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ViewScheduledInterviews;
