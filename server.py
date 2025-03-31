import os
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
from dotenv import load_dotenv

# Load environment variables from a .env file (if available)
# This lets you store sensitive information like DB credentials outside of your code.
load_dotenv()

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) so your React app (running on a different port)
# can communicate with this Flask backend.
CORS(app)

# Set up a secret key for JWT. This should be kept secret and ideally loaded from environment variables.
JWT_SECRET = os.getenv("JWT_SECRET", "your_secret_key")

# Create a MySQL database connection. Notice we're specifying port 3308 as you mentioned.
# This connection will be used to execute SQL queries against your MySQL database.
db = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=3308,
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASS", "Pranathi#01"),
    database=os.getenv("DB_NAME", "new")
)

# Create a cursor that returns rows as dictionaries so we can reference columns by name.
cursor = db.cursor(dictionary=True)

@app.route('/register', methods=['POST'])
def register():
    try:
        # Check if the request data is in JSON format or as form data.
        if request.is_json:
            data = request.get_json()
            name = data.get("name")
            username = data.get("username")
            password = data.get("password")
            user_type = data.get("user_type")
        else:
            name = request.form.get("name")
            username = request.form.get("username")
            password = request.form.get("password")
            user_type = request.form.get("user_type")

        # Validate that all required fields are provided.
        if not name or not username or not password or not user_type:
            return jsonify({"message": "All fields are required"}), 400

        # Hash the provided password using bcrypt.
        # Hashing secures the password before storing it in the database.
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert the new user record into the "user" table.
        # The table columns must match the values provided here.
        query = "INSERT INTO user (name, username, password, user_type) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, username, hashed, user_type))
        db.commit()

        # Return a success message if the registration was successful.
        return jsonify({"message": "User registered successfully"}), 201

    except mysql.connector.Error as err:
        # If there's a MySQL error (like duplicate username), return an error message.
        return jsonify({"message": "Database error", "error": str(err)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

###############################
# ERROR HANDLING
###############################
# A basic error handler that returns JSON for 404 errors.
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

# Run the Flask application.
if __name__ == '__main__':
    app.run(debug=True, port=5000)
