
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TeacherMarksReport() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(
          'https://smart-college-management-portal.onrender.com/api/assignments/report',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load marks')
        }

        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [])

  const formatDate = date => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="hero">
      <h1>Teacher Marks Report</h1>

      <Link to="/teacher-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <h3>Total Submissions: {report.length}</h3>
      <h3>
        Checked: {report.filter(s => s.status === 'Checked').length}
      </h3>
      <h3>
        Pending: {report.filter(s => s.status !== 'Checked').length}
      </h3>

      {loading && <p>Loading marks report...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && report.length === 0 && (
        <p>No submissions found yet.</p>
      )}

      {!loading && !error && report.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            background: 'white'
          }}>
            <thead>
              <tr>
                {[
                  'Student',
                  'Roll No.',
                  'Assignment',
                  'Subject',
                  'Marks',
                  'Status',
                  'Feedback',
                  'Submitted'
                ].map(title => (
                  <th key={title} style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    textAlign: 'left'
                  }}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {report.map(s => (
                <tr key={s._id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.studentName}
                    <br />
                    <small>{s.studentEmail}</small>
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.rollNo || '-'}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.assignmentTitle}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.subject}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.marks === null || s.marks === undefined
                      ? 'Pending'
                      : s.marks}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.status}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {s.feedback || '-'}
                  </td>

                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {formatDate(s.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TeacherMarksReport
