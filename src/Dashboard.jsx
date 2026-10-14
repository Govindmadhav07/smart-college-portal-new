import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

function Dashboard() {
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notices, setNotices] = useState([])

  const name = localStorage.getItem('name')
  const email = localStorage.getItem('email')

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!email) {
          return
        }

        const [
          attendanceRes,
          resultsRes,
          assignmentsRes,
          noticesRes
        ] = await Promise.all([
          fetch(
            `http://localhost:5000/api/attendance?email=${encodeURIComponent(email)}`
          ),
          fetch(
            `http://localhost:5000/api/results?email=${encodeURIComponent(email)}`
          ),
          fetch('http://localhost:5000/api/assignments'),
          fetch('http://localhost:5000/api/notices')
        ])

        setAttendance(await attendanceRes.json())
        setResults(await resultsRes.json())
        setAssignments(await assignmentsRes.json())
        setNotices(await noticesRes.json())
      } catch (error) {
        console.log('Dashboard Error:', error)
      }
    }

    loadData()
  }, [email])

  // Overall Attendance
  const overallAttendance =
    attendance.length > 0
      ? (
          attendance.reduce(
            (sum, item) => sum + Number(item.percentage || 0),
            0
          ) / attendance.length
        ).toFixed(1)
      : null

  // Average Result
  const averageResult =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) =>
              sum +
              (Number(result.marks) / Number(result.total)) * 100,
            0
          ) / results.length
        ).toFixed(1)
      : null

  return (
    <div className="dashboard">
      <aside>
        <h2>College Portal</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/results">Results</Link>
        <Link to="/assignments">Assignments</Link>
        <Link to="/notices">Notices</Link>
      </aside>

      <main>
        <Logout />

        <h1>Student Dashboard</h1>

        <p>
          Welcome, <strong>{name || 'Student'}</strong>!
        </p>

        <p>{email}</p>

        <div className="cards">

          <Link to="/attendance">
            <div>
              📊 Attendance

              <h2>
                {overallAttendance
                  ? `${overallAttendance}%`
                  : 'No Data'}
              </h2>

              <p>Overall Attendance</p>
            </div>
          </Link>

          <Link to="/results">
            <div>
              📝 Results

              <h2>
                {averageResult
                  ? `${averageResult}%`
                  : 'No Data'}
              </h2>

              <p>Average Result</p>
            </div>
          </Link>

          <Link to="/assignments">
            <div>
              📚 Assignments

              <h2>{assignments.length}</h2>

              <p>Total Assignments</p>
            </div>
          </Link>

          <Link to="/notices">
            <div>
              📢 Notices

              <h2>{notices.length}</h2>

              <p>Total Notices</p>
            </div>
          </Link>

        </div>
      </main>
    </div>
  )
}

export default Dashboard