
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

function Dashboard() {
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notices, setNotices] = useState([])
  const [feeData, setFeeData] = useState(null)

  const name = localStorage.getItem('name')
  const email = localStorage.getItem('email')

  useEffect(() => {
    const loadData = async () => {
      if (!email) return

      try {
        const token = localStorage.getItem('token')

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {}

        const [
          attendanceRes,
          resultsRes,
          assignmentsRes,
          noticesRes,
          feesRes
        ] = await Promise.all([
          fetch(
            `http://localhost:5000/api/attendance?email=${encodeURIComponent(email)}`
          ),
          fetch(
            `http://localhost:5000/api/results?email=${encodeURIComponent(email)}`
          ),
          fetch('http://localhost:5000/api/assignments'),
          fetch('http://localhost:5000/api/notices'),
          fetch('http://localhost:5000/api/fees/mine', {
            headers
          })
        ])

        if (!attendanceRes.ok) {
          throw new Error('Could not load attendance')
        }

        if (!resultsRes.ok) {
          throw new Error('Could not load results')
        }

        if (!assignmentsRes.ok) {
          throw new Error('Could not load assignments')
        }

        if (!noticesRes.ok) {
          throw new Error('Could not load notices')
        }

        if (!feesRes.ok) {
          throw new Error(
            `Fees API error: ${feesRes.status}`
          )
        }

        const [
          attendanceData,
          resultsData,
          assignmentsData,
          noticesData,
          feesResponse
        ] = await Promise.all([
          attendanceRes.json(),
          resultsRes.json(),
          assignmentsRes.json(),
          noticesRes.json(),
          feesRes.json()
        ])

        setAttendance(
          Array.isArray(attendanceData) ? attendanceData : []
        )
        setResults(
          Array.isArray(resultsData) ? resultsData : []
        )
        setAssignments(
          Array.isArray(assignmentsData) ? assignmentsData : []
        )
        setNotices(
          Array.isArray(noticesData) ? noticesData : []
        )

        setFeeData(feesResponse.fee || null)
      } catch (error) {
        console.error('Dashboard Error:', error)
      }
    }

    loadData()
  }, [email])

  const overallAttendance =
    attendance.length > 0
      ? (
          attendance.reduce(
            (sum, item) =>
              sum + Number(item.percentage || 0),
            0
          ) / attendance.length
        ).toFixed(1)
      : null

  const validResults = results.filter(
    result => Number(result.total) > 0
  )

  const averageResult =
    validResults.length > 0
      ? (
          validResults.reduce(
            (sum, result) =>
              sum +
              (Number(result.marks || 0) /
                Number(result.total)) * 100,
            0
          ) / validResults.length
        ).toFixed(1)
      : null

  const totalFees = Number(feeData?.totalFees || 0)
  const paidFees = Number(feeData?.paid || 0)
  const remainingFees = Number(
    feeData?.balance ?? Math.max(0, totalFees - paidFees)
  )

  const formatAmount = amount =>
    `₹${amount.toLocaleString('en-IN')}`

  return (
    <div className="dashboard">
      <aside>
        <h2>College Portal</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/results">Results</Link>
        <Link to="/assignments">Assignments</Link>
        <Link to="/notices">Notices</Link>
        <Link to="/student-fees">Fees Management</Link>
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
                {overallAttendance !== null
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
                {averageResult !== null
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

          <Link to="/student-fees">
            <div>
              💰 Fees Management

              {feeData ? (
                <>
                  <h2>{formatAmount(totalFees)}</h2>
                  <p>Total Fees</p>

                  <p>
                    Paid Fees: {formatAmount(paidFees)}
                  </p>

                  <p>
                    Remaining Fees: {formatAmount(remainingFees)}
                  </p>
                </>
              ) : (
                <>
                  <h2>Not Assigned</h2>
                  <p>Fees have not been assigned yet</p>
                </>
              )}
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
