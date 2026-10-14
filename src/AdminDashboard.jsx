
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [notices, setNotices] = useState([])

  const name = localStorage.getItem('name')
  const email = localStorage.getItem('email')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          studentsRes,
          teachersRes,
          coursesRes,
          noticesRes
        ] = await Promise.all([
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/teachers'),
          fetch('http://localhost:5000/api/courses'),
          fetch('http://localhost:5000/api/notices')
        ])

        if (studentsRes.ok) {
          setStudents(await studentsRes.json())
        }

        if (teachersRes.ok) {
          setTeachers(await teachersRes.json())
        }

        if (coursesRes.ok) {
          setCourses(await coursesRes.json())
        }

        if (noticesRes.ok) {
          setNotices(await noticesRes.json())
        }
      } catch (error) {
        console.log('Admin Dashboard Error:', error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="hero">
      <Logout />

      <h1>Admin Dashboard</h1>

      <p>
        Welcome, <strong>{name || 'Admin'}</strong>!
      </p>

      <p>{email}</p>

      <div className="cards">
        <Link to="/admin-students">
          <div>
            👨‍🎓
            <h2>{students.length}</h2>
            <p>Total Students</p>
          </div>
        </Link>

        <Link to="/admin-teachers">
          <div>
            👨‍🏫
            <h2>{teachers.length}</h2>
            <p>Total Teachers</p>
          </div>
        </Link>

        <Link to="/admin-courses">
          <div>
            📚
            <h2>{courses.length}</h2>
            <p>Total Courses</p>
          </div>
        </Link>

        <Link to="/admin-notices">
          <div>
            📢
            <h2>{notices.length}</h2>
            <p>Total Notices</p>
          </div>
        </Link>

        <Link to="/admin-fees">
          <div>
            💰
            <h2>Fees</h2>
            <p>Fees Management</p>
          </div>
        </Link>
      </div>

      <div className="buttons">
        <Link to="/admin-students">
          <button>👨‍🎓 Students</button>
        </Link>

        <Link to="/admin-teachers">
          <button>👨‍🏫 Teachers</button>
        </Link>

        <Link to="/admin-courses">
          <button>📚 Courses</button>
        </Link>

        <Link to="/admin-notices">
          <button>📢 Notices</button>
        </Link>

        <Link to="/admin-fees">
          <button>💰 Fees Management</button>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
