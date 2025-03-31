import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AddSkills = () => {
    const [skills, setSkills] = useState([]);
    const [selectedSkillIDs, setSelectedSkillIDs] = useState([]); // Store skill IDs
    const [message, setMessage] = useState({ text: '', type: '' });

    const location = useLocation();
    const { id } = location.state || {};
    console.log(id);
    // Mock skill data - replace with API call
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('/skills');
                if (!response.ok) {
                    throw new Error('Failed to fetch skills');
                }
                const data = await response.json();
                console.log(data);
                setSkills(data.skills);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setMessage({ text: 'Error fetching skills', type: 'error' });
            }
        };
        fetchSkills();
    }, []);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Selected Skill IDs:", selectedSkillIDs); // Debugging

        try {
            const response = await fetch('/add_skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: id, skills: selectedSkillIDs })
            });

            if (!response.ok) throw new Error('Failed to add skills');

            setMessage({ text: 'Skills added successfully!', type: 'success' });
            setSelectedSkillIDs([]);

        } catch (error) {
            setMessage({ text: 'Failed to add skills.', type: 'error' });
            console.error("Error submitting skills:", error);
        }

        // Clear message after 3 seconds
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    return (
        <div className="skills-container">
            <h2>Select Your Skills</h2>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="skills-input">Choose skills:</label>
                <select
                    id="skills-input"
                    multiple
                    value={selectedSkillIDs} // Use state array instead of setter function
                    onChange={(e) => {       // Add onChange handler
                        const selectedOptions = Array.from(e.target.selectedOptions);
                        const selectedValues = selectedOptions.map(option => parseInt(option.value));
                        setSelectedSkillIDs(selectedValues);
                    }}
                    className="skills-select"
                    required
                    >
                    {skills.map(skill => (
                        <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.Name}
                        </option>
                    ))}
                </select>
                
                <button type="submit" className="submit-button">
                    Add Skills
                </button>
            </form>

            <style jsx>{`
                .skills-container {
                    max-width: 600px;
                    margin: 2rem auto;
                    padding: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 8px;
                }

                .alert {
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border-radius: 4px;
                }

                .alert-success {
                    background-color: #e6ffee;
                    color: #2a662a;
                    border: 1px solid #9fdf9f;
                }

                .alert-error {
                    background-color: #ffe6e6;
                    color: #662a2a;
                    border: 1px solid #df9f9f;
                }

                .skills-select {
                    width: 100%;
                    min-height: 150px;
                    padding: 0.5rem;
                    margin: 1rem 0;
                    border: 2px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                    background-color: white;
                }

                .skills-select:focus {
                    outline: none;
                    border-color: #646cff;
                    box-shadow: 0 0 0 2px rgba(100,108,255,0.2);
                }

                .submit-button {
                    display: block;
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #646cff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .submit-button:hover {
                    background-color: #4a52cc;
                }

                label {
                    font-weight: 500;
                    font-size: 0.9rem;
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default AddSkills;