import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const Review = () => {
    const { state } = useLocation();
    const { id } = state || {};
    console.log(id);
  
  const [users, setUsers] = useState([]);   
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [flashMessage, setFlashMessage] = useState(null);

  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/review?id=${id}`, { // Corrected line
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
      
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setUsers(data.users);
        } else {
          setFlashMessage({ type: "error", message: data.error });
        }
      } catch (error) {
        setFlashMessage({ type: "error", message: "Server error, try again later." });
      }
    };

    fetchUsers();
  }, []);

  // ✅ Handle Review Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !reviewText || !rating) {
      setFlashMessage({ type: "error", message: "All fields are required!" });
      return;
    }

    console.log(selectedUser, reviewText, rating);


    try {
      const response = await fetch('/review_submit', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewed_id: selectedUser,
          review_text: reviewText,
          rating: parseInt(rating),
          id: id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFlashMessage({ type: "success", message: data.message });
        setReviewText("");
        setRating("");
        setSelectedUser(null);
      } else {
        setFlashMessage({ type: "error", message: data.error });
      }
    } catch (error) {
      setFlashMessage({ type: "error", message: "Server error, try again later." });
    }
  };

  return (
    <div className="review-container">
      <h2>Leave a Review</h2>
      {flashMessage && <p className={`flash-${flashMessage.type}`}>{flashMessage.message}</p>}

      <label>Select User to Review:</label>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser || ""}>
        <option value="">-- Select a user --</option>
        {users.map((user) => (
          <option key={user.ID} value={user.ID}>
            {user.Name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <label>Review Text:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />

        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

// ✅ Add CSS Styles
const styles = `
  .review-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  .review-container label {
    display: block;
    font-weight: bold;
    margin-top: 10px;
  }
  .review-container select, .review-container textarea, .review-container input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .review-container button {
    display: block;
    margin-top: 15px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .review-container button:hover {
    background-color: #0056b3;
  }
  .flash-success { color: green; font-weight: bold; }
  .flash-error { color: red; font-weight: bold; }
`;

// Append styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Review;