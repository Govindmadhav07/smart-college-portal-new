import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TeacherStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/students'
        )

        if (!res.ok) {
          throw new Error('Failed to fetch students')
        }

        const data = await res.json()
        setStudents(data)
      } catch (error) {
        console.log('Students Error:', error)
        setError('Unable to load students')
      } finally {
        setLoading(false)
      }
    }

    getStudents()
  }, [])

  return (
    <div className="hero">
      <h1>Students</h1>

      <Link to="/teacher-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <p>
        Total Students: <strong>{students.length}</strong>
      </p>

      {loading && <p>Loading students...</p>}

      {!loading && error && (
        <p>{error}</p>
      )}

      {!loading && !error && students.length === 0 && (
        <p>No students found.</p>
      )}

      {!loading && !error && students.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roll No.</th>
              <th>Course</th>
            </tr>
          </thead>

          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.rollNo}</td>
                <td>{student.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TeacherStudents