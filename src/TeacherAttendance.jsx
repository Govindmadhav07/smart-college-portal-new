import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])

  const [data, setData] = useState({
    studentEmail: '',
    subject: '',
    percentage: ''
  })

  const getStudents = async () => {
    try {
      const res = await fetch(
        'https://smart-college-management-portal.onrender.com/api/students'
      )

      const result = await res.json()
      setStudents(result)
    } catch (error) {
      console.log('Students Error:', error)
    }
  }

  const getAttendance = async () => {
  try {
    const res = await fetch(
      `https://smart-college-management-portal.onrender.com/api/attendance?t=${Date.now()}`,
      {
        cache: 'no-store'
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch attendance')
    }

    const result = await res.json()
    setAttendance(result)
  } catch (error) {
    console.log('Attendance Error:', error)
  }
}
  useEffect(() => {
    getStudents()
    getAttendance()
  }, [])

  const saveAttendance = async () => {
    if (
      !data.studentEmail ||
      !data.subject ||
      data.percentage === ''
    ) {
      alert('Please fill all fields')
      return
    }

    if (
      Number(data.percentage) < 0 ||
      Number(data.percentage) > 100
    ) {
      alert('Percentage must be between 0 and 100')
      return
    }

    try {
      const res = await fetch(
        'https://smart-college-management-portal.onrender.com/api/attendance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...data,
            percentage: Number(data.percentage)
          })
        }
      )

      if (!res.ok) {
        throw new Error('Failed to save attendance')
      }

      alert('Attendance Saved')

      setData({
        studentEmail: '',
        subject: '',
        percentage: ''
      })

      getAttendance()
    } catch (error) {
      console.log('Attendance Error:', error)
      alert('Failed to save attendance')
    }
  }

  const editAttendance = async attendanceData => {
    const percentage = window.prompt(
      'Enter new percentage',
      attendanceData.percentage
    )

    if (percentage === null) {
      return
    }

    if (
      percentage === '' ||
      Number(percentage) < 0 ||
      Number(percentage) > 100
    ) {
      alert('Enter percentage between 0 and 100')
      return
    }

    try {
      const res = await fetch(
        `https://smart-college-management-portal.onrender.com/api/attendance/${attendanceData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            percentage: Number(percentage)
          })
        }
      )

      if (!res.ok) {
        throw new Error('Failed to update attendance')
      }

      alert('Attendance Updated')
      getAttendance()
    } catch (error) {
      console.log('Edit Attendance Error:', error)
      alert('Failed to update attendance')
    }
  }

  const deleteAttendance = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this attendance record?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const res = await fetch(
        `https://smart-college-management-portal.onrender.com/api/attendance/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!res.ok) {
        throw new Error('Failed to delete attendance')
      }

      alert('Attendance Deleted')
      getAttendance()
    } catch (error) {
      console.log('Delete Attendance Error:', error)
      alert('Failed to delete attendance')
    }
  }

  return (
    <div className="hero">
      <h1>Mark Attendance</h1>

      <Link to="/teacher-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <br />
      <br />

      <select
        value={data.studentEmail}
        onChange={e =>
          setData({
            ...data,
            studentEmail: e.target.value
          })
        }
      >
        <option value="">
          Select Student
        </option>

        {students.map(student => (
          <option
            key={student._id}
            value={student.email}
          >
            {student.name} — {student.email}
          </option>
        ))}
      </select>

      <input
        placeholder="Subject"
        value={data.subject}
        onChange={e =>
          setData({
            ...data,
            subject: e.target.value
          })
        }
      />

      <input
        type="number"
        min="0"
        max="100"
        placeholder="Percentage"
        value={data.percentage}
        onChange={e =>
          setData({
            ...data,
            percentage: e.target.value
          })
        }
      />

      <br />
      <br />

      <button onClick={saveAttendance}>
        Save Attendance
      </button>

      <button onClick={getAttendance}>
        Refresh
      </button>

      <br />
      <br />

      <h2>Attendance Records</h2>

      {attendance.length === 0 && (
        <p>No attendance records found.</p>
      )}

      {attendance.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Percentage</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map(a => {
              const student = students.find(
                s => s.email === a.studentEmail
              )

              return (
                <tr key={a._id}>
                  <td>
                    {student
                      ? student.name
                      : 'Unknown'}
                  </td>

                  <td>{a.studentEmail}</td>

                  <td>{a.subject}</td>

                  <td>{a.percentage}%</td>

                  <td>
                    <button
                      onClick={() =>
                        editAttendance(a)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteAttendance(a._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TeacherAttendance