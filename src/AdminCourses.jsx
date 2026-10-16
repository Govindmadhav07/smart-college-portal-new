import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminCourses() {
  const [course, setCourse] = useState({
    name: '',
    code: ''
  })

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const getCourses = async () => {
    try {
      const res = await fetch(
        'https://smart-college-management-portal.onrender.com/api/courses'
      )

      if (!res.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data = await res.json()
      setCourses(data)
    } catch (error) {
      console.log('Courses Error:', error)
      alert('Failed to load courses')
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  const addCourse = async () => {
    if (!course.name || !course.code) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(
        'https://smart-college-management-portal.onrender.com/api/courses',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(course)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to add course')
        return
      }

      alert('Course Added')

      setCourse({
        name: '',
        code: ''
      })

      getCourses()
    } catch (error) {
      console.log('Add Course Error:', error)
      alert('Failed to add course')
    } finally {
      setLoading(false)
    }
  }

  const editCourse = async courseData => {
    const name = window.prompt(
      'Enter new course name',
      courseData.name
    )

    if (!name || name === courseData.name) {
      return
    }

    try {
      const res = await fetch(
        `https://smart-college-management-portal.onrender.com/api/courses/${courseData._id}`,
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

      alert('Course updated')
      getCourses()
    } catch (error) {
      console.log('Edit Course Error:', error)
      alert('Failed to update course')
    }
  }

  const deleteCourse = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this course?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const res = await fetch(
        `https://smart-college-management-portal.onrender.com/api/courses/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      alert('Course deleted')
      getCourses()
    } catch (error) {
      console.log('Delete Course Error:', error)
      alert('Failed to delete course')
    }
  }

  return (
    <div className="hero">
      <h1>Manage Courses</h1>

      <Link to="/admin-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <br />
      <br />

      <input
        placeholder="Course Name"
        value={course.name}
        onChange={e =>
          setCourse({
            ...course,
            name: e.target.value
          })
        }
      />

      <input
        placeholder="Course Code"
        value={course.code}
        onChange={e =>
          setCourse({
            ...course,
            code: e.target.value
          })
        }
      />

      <br />
      <br />

      <button
        onClick={addCourse}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Course'}
      </button>

      <button onClick={getCourses}>
        Refresh Courses
      </button>

      <p>
        Total Courses: <strong>{courses.length}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {courses.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.code}</td>

              <td>
                <button
                  onClick={() => editCourse(c)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(c._id)}
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

export default AdminCourses