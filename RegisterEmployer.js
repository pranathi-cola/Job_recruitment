import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterEmployer = () => {
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_of_poc: "",
    contact_info: ""
  });

  const [flashMessage, setFlashMessage] = useState(null); // ✅ For success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = { ...formData, user_id };  // ✅ Include user_id
  
    try {
      const response = await fetch("http://127.0.0.1:5000/register_employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // ✅ Sends session cookies
        body: JSON.stringify(payload),  // ✅ Send updated data
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (response.ok) {
        setFlashMessage({ type: "success", message: data.message });
        setFormData({ name_of_poc: "", contact_info: "" });
        alert(data.message);
  
        if (data.redirect) {
          navigate(data.redirect);
        }
      } else {
        setFlashMessage({ type: "error", message: data.error });
      }
    } catch (error) {
      setFlashMessage({ type: "error", message: "Server error, please try again later." });
    }
  };
  

  return (
    <div className="register-employer-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name_of_poc">Name of Point of Contact:</label>
        <input
          type="text"
          name="name_of_poc"
          value={formData.name_of_poc}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact_info">Contact Info:</label>
        <input
          type="text"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          required
        />

        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
};

// Embedded CSS as a JavaScript string
const styles = `
  .register-employer-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .register-employer-container form {
    display: flex;
    flex-direction: column;
  }
  .register-employer-container label {
    margin: 10px 0 5px;
    font-weight: bold;
  }
  .register-employer-container input {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  .register-employer-container button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  .register-employer-container button:hover {
    background-color: #0056b3;
  }
`;

// Append the CSS styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RegisterEmployer;