
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './Login'
import './App.css'
import Dashboard from './Dashboard'
import Attendance from './Attendance'
import Results from './Results'
import Assignments from './Assignments'
import Notices from './Notices'
import TeacherLogin from './TeacherLogin'
import TeacherDashboard from './TeacherDashboard'
import TeacherStudents from './TeacherStudents'
import TeacherAttendance from './TeacherAttendance'
import TeacherMarks from './TeacherMarks'
import TeacherAssignments from './TeacherAssignments'
import TeacherMarksReport from './TeacherMarksReport'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminStudents from './AdminStudents'
import AdminTeachers from './AdminTeachers'
import AdminCourses from './AdminCourses'
import AdminNotices from './AdminNotices'
import ProtectedRoute from './ProtectedRoute'
import AdminFees from './AdminFees'
import StudentFees from './StudentFees'

function Home() {
  return (
    <div className="home-page">
      <header className="home-navbar">
        <Link to="/" className="home-brand">
          <span className="brand-icon">🎓</span>
          <span>
            <strong>Smart College Portal</strong>
            <small>A Complete College Management Solution</small>
          </span>
        </Link>

        <nav className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#login-options">Login</a>
        </nav>
      </header>

      <main id="home" className="home-main">
        <section className="home-hero">
          <span className="home-tag">YOUR CAMPUS, DIGITALLY CONNECTED</span>
          <h1>
            Welcome to <span>Smart College Portal</span>
          </h1>
          <p>
            One platform for managing academics, attendance, results,
            assignments and college activities.
          </p>

          <div id="login-options" className="login-cards">
            <article className="login-card student-card">
              <div className="login-icon">🎓</div>
              <h2>Student Login</h2>
              <p>
                Access your profile, attendance, results, assignments
                and fee details.
              </p>
              <Link to="/login" className="login-button student-button">
                Login as Student <span>→</span>
              </Link>
            </article>

            <article className="login-card teacher-card">
              <div className="login-icon">👨‍🏫</div>
              <h2>Teacher Login</h2>
              <p>
                Manage students, attendance, marks, assignments
                and notices.
              </p>
              <Link
                to="/teacher-login"
                className="login-button teacher-button"
              >
                Login as Teacher <span>→</span>
              </Link>
            </article>

            <article className="login-card admin-card">
              <div className="login-icon">⚙️</div>
              <h2>Admin Login</h2>
              <p>
                Manage students, teachers, courses, notices
                and fee records.
              </p>
              <Link to="/admin-login" className="login-button admin-button">
                Login as Admin <span>→</span>
              </Link>
            </article>
          </div>
        </section>

        <section id="features" className="home-features">
          <span>ONE PORTAL</span>
          <h2>Everything you need, in one place</h2>
          <p>
            A simple and convenient way to access college services
            for students, teachers and administrators.
          </p>
        </section>
      </main>

      <footer className="home-footer">
        © {new Date().getFullYear()} Designed and Developed by{' '}
        <strong>Govind Madhav</strong>
      </footer>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute role="student">
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute role="student">
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute role="student">
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute role="student">
              <Notices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-fees"
          element={
            <ProtectedRoute role="student">
              <StudentFees />
            </ProtectedRoute>
          }
        />

        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-students"
          element={
            <ProtectedRoute role="teacher">
              <TeacherStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-attendance"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-marks"
          element={
            <ProtectedRoute role="teacher">
              <TeacherMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-assignments"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-marks-report"
          element={
            <ProtectedRoute role="teacher">
              <TeacherMarksReport />
            </ProtectedRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-students"
          element={
            <ProtectedRoute role="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-teachers"
          element={
            <ProtectedRoute role="admin">
              <AdminTeachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-courses"
          element={
            <ProtectedRoute role="admin">
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-notices"
          element={
            <ProtectedRoute role="admin">
              <AdminNotices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-fees"
          element={
            <ProtectedRoute role="admin">
              <AdminFees />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
