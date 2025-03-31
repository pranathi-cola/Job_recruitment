import { Routes, Route } from "react-router-dom";

import LoginRegister from "./components/LoginRegister";
import AddSkills from "./components/AddSkills";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import Employee from "./components/Employee";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Employer from "./components/Employer";
import EmployerDashboard from "./components/EmployerDashboard";
import Login from "./components/Login";
import MatchingJobs from "./components/MatchingJobs";
import PostJob from "./components/PostJob";
import Register from "./components/Register";
import RegisterEmployee from "./components/RegisterEmployee";
import RegisterEmployer from "./components/RegisterEmployer";
import ScheduleInterview from "./components/ScheduleInterview";
import SubmitComplaint from "./components/SubmitComplaint";
import UpdateResume from "./components/UpdateResume";
import ViewApplicants from "./components/ViewApplicants";
import ComplaintsPage from "./components/ViewComplaints";
import ViewJobs from "./components/ViewJobs";
import ViewScheduledInterviews from "./components/ViewScheduledInterviews";
import ViewUsers from "./components/ViewUsers";
import ApplicantDetails from "./components/ViewApplicantDetails";
import Review from "./components/Review";
import EditJob from "./components/EditJob";


const applicant = {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
  resume: "https://example.com/resume.pdf",
  skills: "React, JavaScript, CSS, HTML"
};

const jobs = [
  { id: 101, title: "Frontend Developer" },
  { id: 102, title: "React Engineer" }
];
const Lol = () =>
{
    return (
    <div>
        <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/add_skills" element={<AddSkills />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/employee_dashboard" element={<EmployeeDashboard />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/employer_dashboard" element={<EmployerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/matching_jobs" element={<MatchingJobs />} />
        <Route path="/post_job" element={<PostJob />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register_employee" element={<RegisterEmployee />} />
        <Route path="/register_employer" element={<RegisterEmployer />} />
        <Route path="/schedule_interview" element={<ScheduleInterview />} />
        <Route path="/submit_complaint" element={<SubmitComplaint />} />
        <Route path="/applicant_details" element={<ApplicantDetails applicant={applicant} jobs={jobs} />} />
        <Route path="/update_resume" element={<UpdateResume />} />
        <Route name="/view_applicants" path="/:id" element={<ViewApplicants />} />
        <Route path="/complaints_page" element={<ComplaintsPage />} />
        <Route path="/view_jobs" element={<ViewJobs />} />
        <Route path="/viewscheduled_interviews" element={<ViewScheduledInterviews />} />
        <Route path="/view_users" element={<ViewUsers />} />
        <Route path="/review" element={<Review /> } />
        <Route path="/edit_job" element={<EditJob/>} />
      </Routes>
    </div>);
}

export default Lol;