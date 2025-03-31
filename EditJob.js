import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EditJob = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated status mapping for Open/Closed
  const statusToEmoji = {
    'Open': '💤️',
    'Closed': '✅'
  };

  const emojiToStatus = {
    '💤️': 'Open',
    '✅': 'Closed'
  };

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/jobs?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        
        const transformedJobs = data.map(job => ({
          id: job.job_id,
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salary: job.salary,
          status: statusToEmoji[job.status] || '💤️'
        }));
        
        setJobs(transformedJobs);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [id]);

  const handleEditClick = (job) => {
    setEditingJob(job);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingJob.title,
          description: editingJob.description,
          location: editingJob.location,
          type: editingJob.type,
          salary: editingJob.salary,
          status: emojiToStatus[editingJob.status] || 'Open'
        })
      });

      if (!response.ok) throw new Error('Update failed');

      // Update local state with modified job
      const updatedJobs = jobs.map(job => 
        job.id === editingJob.id ? editingJob : job
      );
      setJobs(updatedJobs);
      setEditingJob(null);

    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Manage Your Jobs</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Job Title</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Salary</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{job.title}</td>
              <td style={{ padding: '12px' }}>${job.salary}</td>
              <td style={{ padding: '12px' }}>{job.location}</td>
              <td style={{ padding: '12px' }}>{job.type}</td>
              <td style={{ padding: '12px' }}>{job.status}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleEditClick(job)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingJob && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>Edit Job</h2>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Job Title</label>
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Salary</label>
              <input
                type="number"
                value={editingJob.salary}
                onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                value={editingJob.description}
                onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                style={{ width: '100%', padding: '8px', height: '100px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
              <input
                type="text"
                value={editingJob.location}
                onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Job Type</label>
              <select
                value={editingJob.type}
                onChange={(e) => setEditingJob({...editingJob, type: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="Contract">Contract</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
              <select
                value={editingJob.status}
                onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="💤️">Open</option>
                <option value="✅">Closed</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditJob;