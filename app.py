from flask import Flask, request, jsonify, session
import mysql.connector as mysql
from flask_cors import CORS
from flask_session import Session

import traceback

app = Flask(__name__)

# ✅ Secure session settings
app.secret_key = "your_secret_key"
app.config["SESSION_TYPE"] = "filesystem"  # Stores session on the server
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True  # Prevent JavaScript from accessing cookies
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # ✅ Required for cross-origin requests
app.config["SESSION_COOKIE_SECURE"] = False  # ❌ Set to True if using HTTPS
app.config["SESSION_REFRESH_EACH_REQUEST"] = True
app.config["SESSION_COOKIE_NAME"] = 'flask_session'

app.secret_key = 'your_secure_random_key_here'  # Add this line

Session(app)  # ✅ Enable Flask-Session
mylol = {}

# ✅ CORS setup to allow frontend requests and credentials (cookies)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, expose_headers=["Content-Type"], allow_headers=["Content-Type", "Authorization"])

config = {
    'host': 'localhost',
    'port': 3308,
    'user': 'root',
    'password': 'Pranathi#01',
    'database': 'new',
    'auth_plugin': 'Pranathi#01'  # Required for MySQL 8+
}

# Error handling
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error", "details": traceback.format_exc()}), 500


# Database connection
def get_db_connection():
    return mysql.connect(**config)



@app.route('/jobs', methods=['GET'])
def get_jobs():
    id = request.args.get("id")
    print(id)
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                j.Job_ID as job_id,
                j.title as title,
                j.Description as description,
                j.Locations as location,
                j.Type as type,
                j.Salary as salary,
                j.Status as status
            FROM Job j
            WHERE j.Emp_Id = %s;
        """, (id, ))
        
        jobs = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(jobs), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update a job
@app.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        data = request.get_json()

        print(data)
        conn = get_db_connection()
        cursor = conn.cursor()
        
        update_fields = []
        params = []
        
        if data['title']:
            update_fields.append("title = %s")
            params.append(data['title'])
        if data['description']:
            update_fields.append("Description = %s")
            params.append(data['description'])
        if data['location']:
            update_fields.append("Locations = %s")
            params.append(data['location'])
        if data['type']:
            update_fields.append("Type = %s")
            params.append(data['type'])
        if data['salary']:
            update_fields.append("Salary = %s")
            params.append(data['salary'])
        if data['status']:
            update_fields.append("Status = %s")
            params.append(data['status'])
            
        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
            
        query = f"""
            UPDATE Job
            SET {", ".join(update_fields)}
            WHERE Job_ID = %s;
        """
        params.append(job_id)

        print(query, tuple(params))
        
        cursor.execute(query, tuple(params))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Job updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/skills', methods=['POST'])
def skills():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, name FROM Skill;')
    skills = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(skills)


@app.route('/add_skills', methods=['POST'])
def add_skills():
    data = request.get_json()
    candidate_id = data.get('user_id')
    skill_ids = data.get('skills')

    print(candidate_id, skill_ids)

    if not candidate_id or not skill_ids:
        return jsonify({'error': 'Missing candidate_id or skill_ids'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for skill_id in skill_ids:
            cursor.execute(
                'INSERT INTO candiskill (Cand_ID, Skill_ID) VALUES (%s, %s);',
                (candidate_id, skill_id)
            )
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Skills added successfully'}), 201


@app.route('/jobs', methods=['POST'])
def jobs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT Job_ID, title, Description, Type, Salary, Name, TimeOfPosting FROM job, user  WHERE job.Emp_ID = user.ID;')
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(jobs)


@app.route('/matching_jobs', methods=['POST'])
def matching_jobs():
    data = request.get_json()
    user_id = data.get('id')

    conn=get_db_connection()
    cursor=conn.cursor()

    def create_job_dict(row):
        return {
            'Job_ID': row[0],
            'Title': row[1],
            'Description': row[2],
            'Type': row[3],
            'Salary': row[4],
            'Employer': row[5]
        }

    cursor.execute("""
         SELECT DISTINCT j.Job_ID,j.Title,j.Description,j.Type,j.Salary,u.Name AS Employer
        FROM Job j
        JOIN Employer e ON j.Emp_ID=e.ID
        JOIN User u ON e.ID=u.ID
        JOIN JobQuali jq ON j.Job_ID=jq.Job_ID
        WHERE jq.Skill_ID IN (
            SELECT cs.Skill_ID
            FROM CandiSkill cs
            WHERE cs.Cand_ID=%s
        ) && j.Status='Open'
        GROUP BY j.Job_ID
        HAVING COUNT(DISTINCT jq.Skill_ID)=(
            SELECT COUNT(DISTINCT cs.Skill_ID)
            FROM CandiSkill cs
            WHERE cs.Cand_ID=%s
        );
    """,(user_id,user_id))

    perfect_match_jobs = [create_job_dict(row) for row in cursor.fetchall()]

    cursor.execute("""
         SELECT DISTINCT j.Job_ID,j.Title,j.Description,j.Type,j.Salary,u.Name AS Employer
        FROM Job j
        JOIN Employer e ON j.Emp_ID=e.ID
        JOIN User u ON e.ID=u.ID
        JOIN JobQuali jq ON j.Job_ID=jq.Job_ID
        WHERE jq.Skill_ID IN (
            SELECT cs.Skill_ID
            FROM CandiSkill cs
            WHERE cs.Cand_ID=%s
        ) && j.Status='Open';
    """,(user_id,))
    partial_match_jobs = [create_job_dict(row) for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    print(perfect_match_jobs)
    print(partial_match_jobs)

    return jsonify({"perfect": perfect_match_jobs, "partial": partial_match_jobs})


@app.route('/view_job', methods=['POST'])
def view_job():
    data = request.get_json()
    candidate_id = data.get('id')
    job_id = data.get('job_id')
    status = "Applied"

    print(job_id, candidate_id, status)

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('INSERT INTO application (User_ID, Job_ID, Status) VALUES (%s, %s, %s);', (candidate_id, job_id, status,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Applied to the job successfully"})


@app.route('/resume', methods=['POST'])
def resume():
    data = request.get_json()
    user_id = data.get('user_id')

    print(user_id)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT Resume from employee WHERE ID = %s;", (user_id,))
    resume = cursor.fetchone()
    print(resume)
    cursor.close()
    conn.close()
    return jsonify(resume[0])



@app.route('/update_resume', methods=['POST'])
def update_resume():
    data = request.get_json()
    candidate_id = data.get('user_id')
    resume = data.get('resume')

    if not candidate_id or not resume:
        return jsonify({'error': 'Missing candidate_id or skill_ids'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'UPDATE employee SET Resume = %s WHERE ID = %s;',
            (resume,candidate_id,)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Resume updated successfully'}), 201




@app.route('/register', methods=['POST'])
def register():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        user_type = data.get('user_type')
        password = data.get('password')

        if not all([name, username, user_type, password]):
            return jsonify({"error": "All fields are required"}), 400

        # Check if username already exists
        cursor.execute("SELECT COUNT(*) AS count FROM User WHERE Username = %s", (username,))
        if cursor.fetchone()["count"] > 0:
            return jsonify({"error": "Username already exists!"}), 409

        # Insert user into DB
        sql = "INSERT INTO User (Name, Username, UserType, Password) VALUES (%s, %s, %s, %s)"
        values = (name, username, user_type, password)
        cursor.execute(sql, values)
        conn.commit()

        user_id = cursor.lastrowid  # Get the newly created user's ID

        redirect_url = "/register_employer" if user_type == "Employer" else "/register_employee"

        return jsonify({
            "message": "User registered successfully!",
            "user_id": user_id,  # ✅ Send user_id to frontend
            "user_type": user_type,
            "redirect": redirect_url
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/register_employer', methods=['POST'])
def register_employer():
    data = request.get_json()
    
    user_id = data.get('user_id')  # Receiving user_id from frontend
    name_of_poc = data.get('name_of_poc')
    contact_info = data.get('contact_info')
    no_of_openings = data.get('no_of_openings', 0)  # Default value if not provided
    
    if not all([user_id, name_of_poc, contact_info]):
        return jsonify({"error": "All fields are required"}), 400
    
    sql = "INSERT INTO Employer (ID, NameOfPOC, ContactInfo, NoOfOpenings) VALUES (%s, %s, %s, %s)"
    values = (user_id, name_of_poc, contact_info, no_of_openings)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(sql, values)
        conn.commit()
        return jsonify({"message": "Employer profile completed! You can now log in.", "redirect": "/login"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/register_employee', methods=['POST'])
def register_employee():
    print("here")
    data = request.json  # Get JSON data from React
    user_id = data.get('user_id')  # Receiving user_id from frontend
    resume = data.get('resume')
    email= data.get('email')
    status='Active'
    #no_of_openings = data.get('no_of_openings', 0)  # Default value if not provided
    if not all([user_id, resume, email]):
        return jsonify({"error": "All fields are required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "INSERT INTO Employee (ID, Resume, Email, Status) VALUES (%s, %s, %s, %s)"
    values = (user_id, resume, email, status)

    try:
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Employee profile completed! You can now log in.", "redirect": "/login"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    
@app.route('/review', methods=['GET', 'POST'])
def review():
    # Extract user details from frontend request
    print("entered")
    user_id = request.args.get('id')
    print(id)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT usertype FROM user WHERE ID=%s;",(user_id,))
    user_type = cursor.fetchone()
    print(user_id,user_type)

    if not user_id or not user_type:
        return jsonify({"error": "User authentication required!"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get users to review (opposite user type)
    if user_type == "Employer":
        cursor.execute("SELECT ID, Name FROM User WHERE usertype='Employee'")
    else:
        cursor.execute("SELECT ID, Name FROM User WHERE usertype='Employer'")

    users_to_review = cursor.fetchall()

    conn.close()
    return jsonify({"users": users_to_review}), 200


@app.route("/review_submit", methods=["POST"])
def review_submit():
    data = request.get_json()
    review_text = data.get('review_text')
    rating = data.get('rating')
    reviewed_id = data.get('reviewed_id')
    user_id = data.get('id')

    print(review_text, rating, reviewed_id)

    if not reviewed_id or not review_text or not rating:
        return jsonify({"error": "Please fill out all fields."}), 400
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    # Check if the reviewed user exists
    cursor.execute("SELECT ID, usertype FROM User WHERE ID = %s", (reviewed_id,))
    reviewed_user = cursor.fetchone()
    cursor.execute("SELECT usertype FROM user WHERE ID=%s;",(user_id,))
    user_type = cursor.fetchone()

    if not reviewed_user:
        return jsonify({"error": "User not found!"}), 404

    if reviewed_user['usertype'] == user_type:
        return jsonify({"error": "You can only review users of the opposite type!"}), 403

    try:
        cursor.execute("""
            INSERT INTO Reviews (reviewer_id, reviewed_id, review_text, rating)
            VALUES (%s, %s, %s, %s)
        """, (user_id, reviewed_id, review_text, rating))

        conn.commit()
        return jsonify({"message": "Review submitted successfully!"}), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"error": "Error submitting review. Please try again."}), 500

    finally:
        conn.close()


@app.route("/login", methods=["POST"])
def login():
   # print("Request Content-Type:", request.content_type)  # Debugging

    # Parse JSON request
    #if request.is_json:
    #    data = request.get_json()
    #else:
    #    data = json.loads(request.data.decode("utf-8"))  # Handle non-JSON requests

    data = request.get_json(force=True)

    

    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Missing username or password"}), 400
    
    print("Received Data:", data)  # Debugging

    username = data["username"]
    password = data["password"]

    # Connect to DB and fetch user details
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM User WHERE Username = %s", (username, ))
    user = cursor.fetchone()
    db.close()

    print("Fetched User:", user)  # Debugging
    print("Expected Password ", password)
    print("My Password ", user["Password"])

    if user and user["Password"] == password:
        session["user_id"] = user["ID"]
        session["user_type"] = user["UserType"]
        session.modified = True
        session.permanent = True

        # Determine redirection path based on user type
        return jsonify({"user": user["Name"], "username": user["Username"], "id": user["ID"], "usertype": user["UserType"]}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    


@app.route('/admin_login', methods=['POST'])
def admin_login():
    try:
        print("Request received at /admin_login")
        
        if not request.is_json:
            print("Error: Request is not JSON")
            return jsonify({"error": "Invalid request, expected JSON"}), 400

        data = request.get_json()
        print("Received Data:", data)

        # Validate required fields
        required_fields = ['admin_username', 'admin_password']
        if not all(field in data for field in required_fields):
            print("Error: Missing required fields")
            return jsonify({"error": "Missing username or password"}), 400

        # Hardcoded admin credentials (consider moving to environment variables)
        ADMIN_USERNAME = "admin"
        ADMIN_PASSWORD = "123"

        if data['admin_username'] == ADMIN_USERNAME and data['admin_password'] == ADMIN_PASSWORD:
            # Set session variables
            session["user_id"] = 0  # Consider using a different identifier
            session["user_type"] = "admin"
            session.permanent = True
            
            # Explicitly save the session
            session.modified = True
            mylol = {
                'user_id': 0,
                'user_type': "admin"
            }
            
            print("Session after admin login:", session)
            return jsonify({
                "message": "Admin login successful!",
                "redirect": "/admin_dashboard"
            }), 200

        print("Error: Invalid credentials")
        return jsonify({"error": "Invalid admin credentials!"}), 401

    except Exception as e:
        print(f"Error in admin_login: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route('/check_session', methods=['GET'])
def check_session():
    return jsonify(session)


@app.route('/admin_dashboard', methods=['GET'])
def admin_dashboard():
    #if 'user_id' not in session or session.get('user_type') != "admin":
     #   return jsonify({"error": "Unauthorized access!"}), 403
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetching statistics
    cursor.execute("SELECT COUNT(*) FROM User")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM User WHERE UserType = 'Employer'")
    total_recruiters = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM User WHERE UserType = 'Employee'")
    total_candidates = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Job")
    total_jobs = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Job WHERE Status = 'Open'")
    open_jobs = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Application")
    total_applications = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Interview WHERE Status = 'Scheduled'")
    scheduled_interviews = cursor.fetchone()[0]

    cursor.execute("SELECT Complaint_ID, Description, Status FROM Complaint ORDER BY Complaint_ID DESC LIMIT 5")
    recent_complaints = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "totalUsers": total_users,  # Match frontend keys
        "totalRecruiters": total_recruiters,
        "totalCandidates": total_candidates,
        "totalJobs": total_jobs,
        "openJobs": open_jobs,
        "totalApplications": total_applications,
        "scheduledInterviews": scheduled_interviews,
        "recentComplaints": [{"id": c[0], "text": c[1], "status": c[2]} for c in recent_complaints]  # Match 'text' instead of 'description'
    })


@app.route('/view_users', methods=['GET'])
def view_users():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM User")
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()



@app.route('/complaints_page', methods=['GET'])
def complaints_page():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT c.complaint_id AS 'ID', u.UserType AS 'UserType', u.Name AS 'UserName', c.Description, c.Status FROM complaint c INNER JOIN user u ON c.Complainer_ID = u.ID;")
        users = cursor.fetchall()
        print(users)
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/update_complaint_status', methods=['POST'])
def update_complaint_status():
    data = request.get_json()
    complaint_id = data.get('id')
    new_status = data.get('status')

    if not complaint_id or new_status is None:
        return jsonify({"error": "Invalid data"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Update the complaint status. Adjust the table and column names as necessary.
        query = "UPDATE complaint SET Status = %s WHERE complaint_id = %s"
        cursor.execute(query, (new_status, complaint_id))
        conn.commit()
        return jsonify({"success": True, "message": "Status updated"})
    except Exception as e:
        print("Error updating complaint status:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()



@app.route('/view_applicants', methods=['GET'])
def view_applicants():
    id = request.args.get('id')
    print(id)
    if not id:
        return jsonify({'error': 'Employer ID is required'}), 400
    try:
        id = int(id)
    except ValueError:
        return jsonify({'error': 'Invalid Employer ID'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch only jobs that have at least one applicant
    cursor.execute("""
        SELECT
        J.Job_ID,
        J.title AS Job_Title,
        U.ID AS Applicant_ID,
        U.Name AS Applicant_Name
    FROM
        Job J
    LEFT JOIN
        Application A ON J.Job_ID = A.Job_ID
    LEFT JOIN
        User U ON A.User_ID = U.ID
    WHERE
        J.Emp_ID = %s;
    """, (id,))

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    print(results)

    # Grouping candidates by job
    jobs_with_candidates = {}
    for job_id, job_title, cand_id, cand_name in results:
        if job_id not in jobs_with_candidates:
            jobs_with_candidates[job_id] = {
                'title': job_title,
                'candidates': []
            }
        jobs_with_candidates[job_id]['candidates'].append({'id': cand_id, 'name': cand_name})

    # Return the results as a JSON response
    return jsonify(jobs=jobs_with_candidates)


@app.route("/submit_complaint", methods=["GET", "POST"])
def submit_complaint():
    if request.method == "POST":
        data = request.get_json()
        complainer_id = data.get("complainer_id")
        description = data.get("description")
        
        if not complainer_id or not description:
            return jsonify({"error": "Missing required fields: complainer_id and description"}), 400
        try:
            complainer_id = int(complainer_id)
        except ValueError:
            return jsonify({"error": "Invalid complainer_id, must be an integer"}), 400
        
        status = "Pending"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO Complaint (Complainer_ID, Description, Status)
                VALUES (%s, %s, %s)
                """,
                (complainer_id, description, status)
            )
            conn.commit()
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
            
        return jsonify({"message": "Complaint submitted successfully"}), 200

    elif request.method == "GET":
        complainer_id = request.args.get("complainer_id")
        if not complainer_id:
            return jsonify({"error": "Missing required field: complainer_id"}), 400
        try:
            complainer_id = int(complainer_id)
        except ValueError:
            return jsonify({"error": "Invalid complainer_id, must be an integer"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            print(complainer_id)
            cursor.execute("SELECT * FROM Complaint WHERE Complainer_ID = %s;", (complainer_id,))
            complaints = cursor.fetchall()
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
        
        return jsonify({"complaints": complaints})



@app.route('/viewscheduled_interviews', methods=['POST'])
def viewscheduled_interviews():
    data = request.get_json()
    id = data.get('id')
    print(id)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT job.title, interview.Job_ID, interview.Time, interview.Mode, interview.Status FROM interview, job WHERE interview.Job_ID = job.Job_ID AND User_ID = %s;', (id,))
    interviews = cursor.fetchall()
    print(interviews)
    cursor.close()
    conn.close()
    return jsonify(interviews)


@app.route("/viewscheduled_interviews_emp", methods=["POST"])
def viewscheduled_interviews_emp():
    data = request.get_json()
    id = data.get('id')
    print(id)
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
        SELECT i.User_ID,u.Name,j.Job_ID,j.Title AS title,i.Time,i.Mode,i.Status
        FROM Interview i
        JOIN User u ON i.User_ID=u.ID
        JOIN Job j ON i.Job_ID=j.Job_ID
        WHERE j.Emp_ID=%s
        ORDER BY i.Time ASC;
    """,(id,))
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()



@app.route('/applicant_details', methods=['GET'])
def applicant_details():
    user = request.args.get('user')
    applicant = request.args.get('applicant')

    print(user, applicant)
    if not user or not applicant:
        return jsonify({'error': 'Employer ID is required'}), 400
    try:
        user = int(user)
        applicant = int(applicant)
    except ValueError:
        return jsonify({'error': 'Invalid Employer ID'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch only jobs that have at least one applicant
    cursor.execute("""
        SELECT U.ID,U.Name,U.Username,E.Email,E.resume,
               GROUP_CONCAT(DISTINCT S.Name SEPARATOR ',') AS Skills,
               GROUP_CONCAT(DISTINCT A.Job_ID SEPARATOR ',') AS Job_IDs,
               GROUP_CONCAT(DISTINCT J.Title SEPARATOR ',') AS Job_Titles
        FROM User U
        JOIN Employee E ON U.ID=E.ID
        JOIN Application A ON E.ID=A.User_ID
        JOIN Job J ON A.Job_ID=J.Job_ID
        LEFT JOIN CandiSkill CS ON E.ID=CS.Cand_ID
        LEFT JOIN Skill S ON CS.Skill_ID=S.skill_ID
        WHERE U.ID=%s  AND J.Emp_ID=%s
        GROUP BY U.ID;
    """, (applicant, user))

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    print(results)

    # Return the results as a JSON response
    return jsonify(jobs=results)


@app.route("/schedule_interview", methods=["POST"])
def schedule_interview():
    data = request.get_json()
    applicant = data.get('applicant')
    jobid = data.get('jobid')
    time = data.get('time')
    mode = data.get('mode')

    print(applicant, jobid, time, mode)

    if not jobid or not applicant or not time or not mode:
        return jsonify({'error': 'Employer ID is required'}), 400
    try:
        jobid = int(jobid)
        applicant = int(applicant)
    except ValueError:
        return jsonify({'error': 'Invalid Employer ID'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch only jobs that have at least one applicant
    cursor.execute("""
        INSERT INTO Interview (User_ID,Job_ID,Time,Mode,Status) 
                VALUES (%s,%s,%s,%s,'Scheduled')
    """, (applicant, jobid, time, mode))

    results = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()

    print(results)

    # Return the results as a JSON response
    return jsonify(results)


@app.route("/employer", methods=["POST"])
def employer():
    data = request.get_json()
    empid = data.get('empid')
    salary = data.get('salary')
    description = data.get('description')
    locations = data.get('locations')
    job_type = data.get('job_type')
    skills = data.get('skills')
    title = data.get('title')

    #print

    if not salary or not empid or not job_type or not locations:
        return jsonify({'error': 'Employer ID is required'}), 400
    try:
        empid = int(empid)
        salary = int(salary)
    except ValueError:
        return jsonify({'error': 'Invalid Employer ID'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    sql_job="""INSERT INTO Job (Emp_ID,Salary,Description,Locations,Title,Type,TimeOfPosting,No_Apps,Status)
        VALUES (%s,%s,%s,%s,%s,%s,NOW(),0,'Open')"""
    values_job=(empid,salary,description,locations,title,job_type)
    cursor.execute(sql_job, values_job)
    job_id=cursor.lastrowid 
    values_jobquali = []
    for skill in skills:
        cursor.execute("SELECT skill_id FROM Skill WHERE Name = %s", (skill,))
        result = cursor.fetchone()
        print(result)
        if result:
            values_jobquali.append((job_id, result['skill_id']))
        else:
            print(f"Skill '{skill}' not found in Skill table.")
    print(values_jobquali)
    
    for skill in values_jobquali:
        cursor.execute("INSERT INTO JobQuali (Job_ID, Skill_ID) VALUES (%s, %s)", job_id, skill)

    results = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()

    print(results)

    # Return the results as a JSON response
    return jsonify(results)

@app.route("/skills", methods=["GET"])
def get_skills():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT skill_id, Name FROM Skill")
    skills = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"skills": skills})

# Logout Route
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)

