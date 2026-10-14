import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminStudents() {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    course: ''
  })

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

  const getStudents = async () => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/students'
      )

      const data = await res.json()
      setStudents(data)
    } catch (error) {
      console.log('Students Error:', error)
      alert('Failed to load students')
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  const addStudent = async () => {
    if (
      !student.name ||
      !student.email ||
      !student.rollNo ||
      !student.course
    ) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(
        'http://localhost:5000/api/students',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(student)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to add student')
        return
      }

      alert(
        `Student Added\n\nLogin Email: ${student.email}\nDefault Password: 123456`
      )

      setStudent({
        name: '',
        email: '',
        rollNo: '',
        course: ''
      })

      getStudents()
    } catch (error) {
      console.log('Add Student Error:', error)
      alert('Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    )

    if (!confirmDelete) return

    try {
      const res = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      alert('Student deleted')
      getStudents()
    } catch (error) {
      console.log('Delete Error:', error)
      alert('Failed to delete student')
    }
  }

  const editStudent = async studentData => {
    const name = window.prompt(
      'Enter new name',
      studentData.name
    )

    if (!name || name === studentData.name) return

    try {
      const res = await fetch(
        `http://localhost:5000/api/students/${studentData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name
          })
        }
      )

      if (!res.ok) {
        throw new Error('Update failed')
      }

      alert('Student updated')
      getStudents()
    } catch (error) {
      console.log('Edit Error:', error)
      alert('Failed to update student')
    }
  }

  return (
    <div className="hero">
      <h1>Manage Students</h1>

      <Link to="/admin-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <br />
      <br />

      <input
        placeholder="Name"
        value={student.name}
        onChange={e =>
          setStudent({
            ...student,
            name: e.target.value
          })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={student.email}
        onChange={e =>
          setStudent({
            ...student,
            email: e.target.value
          })
        }
      />

      <input
        placeholder="Roll Number"
        value={student.rollNo}
        onChange={e =>
          setStudent({
            ...student,
            rollNo: e.target.value
          })
        }
      />

      <input
        placeholder="Course"
        value={student.course}
        onChange={e =>
          setStudent({
            ...student,
            course: e.target.value
          })
        }
      />

      <br />
      <br />

      <button
        onClick={addStudent}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Student'}
      </button>

      <button onClick={getStudents}>
        Refresh Students
      </button>

      <p>
        Total Students: <strong>{students.length}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No.</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.rollNo}</td>
              <td>{s.course}</td>

              <td>
                <button
                  onClick={() => editStudent(s)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteStudent(s._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminStudents