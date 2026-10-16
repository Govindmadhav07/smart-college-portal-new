
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

function TeacherDashboard() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [assignments, setAssignments] = useState([])

  const name = localStorage.getItem('name')
  const email = localStorage.getItem('email')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          studentsRes,
          attendanceRes,
          resultsRes,
          assignmentsRes
        ] = await Promise.all([
          fetch('https://smart-college-management-portal.onrender.com/api/students'),
          fetch('https://smart-college-management-portal.onrender.com/api/attendance'),
          fetch('https://smart-college-management-portal.onrender.com/api/results'),
          fetch('https://smart-college-management-portal.onrender.com/api/assignments')
        ])

        if (studentsRes.ok) {
          setStudents(await studentsRes.json())
        }

        if (attendanceRes.ok) {
          setAttendance(await attendanceRes.json())
        }

        if (resultsRes.ok) {
          setResults(await resultsRes.json())
        }

        if (assignmentsRes.ok) {
          setAssignments(await assignmentsRes.json())
        }
      } catch (error) {
        console.log('Teacher Dashboard Error:', error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="hero">
      <Logout />

      <h1>Teacher Dashboard</h1>

      <p>
        Welcome, <strong>{name || 'Teacher'}</strong>!
      </p>

      <p>{email}</p>

      <div className="cards">
        <Link to="/teacher-students">
          <div>
            👨‍🎓
            <h2>{students.length}</h2>
            <p>Students</p>
          </div>
        </Link>

        <Link to="/teacher-attendance">
          <div>
            📊
            <h2>{attendance.length}</h2>
            <p>Attendance Records</p>
          </div>
        </Link>

        <Link to="/teacher-marks">
          <div>
            📝
            <h2>{results.length}</h2>
            <p>Results</p>
          </div>
        </Link>

        <Link to="/teacher-assignments">
          <div>
            📚
            <h2>{assignments.length}</h2>
            <p>Assignments</p>
          </div>
        </Link>

        <Link to="/teacher-marks-report">
          <div>
            📈
            <h2>Report</h2>
            <p>Assignment Marks Report</p>
          </div>
        </Link>
      </div>

      <div className="buttons">
        <Link to="/teacher-students">
          <button>👨‍🎓 Students</button>
        </Link>

        <Link to="/teacher-attendance">
          <button>📊 Attendance</button>
        </Link>

        <Link to="/teacher-marks">
          <button>📝 Marks</button>
        </Link>

        <Link to="/teacher-assignments">
          <button>📚 Assignments</button>
        </Link>

        <Link to="/teacher-marks-report">
          <button>📈 Marks Report</button>
        </Link>
      </div>
    </div>
  )
}

export default TeacherDashboard
