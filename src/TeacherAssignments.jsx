
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = 'https://smart-college-management-portal.onrender.com/api/assignments'

function TeacherAssignments() {
  const [assignment, setAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: ''
  })

  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [reviews, setReviews] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState({})

  const token = localStorage.getItem('token')

  const authHeaders = {
    Authorization: `Bearer ${token}`
  }

  const getAssignments = async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to load assignments')
      setAssignments(await res.json())
    } catch (error) {
      console.error(error)
      alert('Assignments load nahi ho paaye')
    }
  }

  const getSubmissions = async id => {
    try {
      setLoadingReviews(prev => ({ ...prev, [id]: true }))

      const res = await fetch(`${API}/${id}/submissions`, {
        headers: authHeaders
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Submissions load nahi hui')
      }

      setSubmissions(prev => ({ ...prev, [id]: data }))

      setReviews(prev => {
        const updated = { ...prev }

        data.forEach(s => {
          updated[s._id] = {
            marks: s.marks ?? '',
            feedback: s.feedback || ''
          }
        })

        return updated
      })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoadingReviews(prev => ({ ...prev, [id]: false }))
    }
  }

  useEffect(() => {
    getAssignments()
  }, [])

  const saveAssignment = async () => {
    if (
      !assignment.title.trim() ||
      !assignment.subject.trim() ||
      !assignment.description.trim() ||
      !assignment.dueDate
    ) {
      alert('Please fill all fields')
      return
    }

    try {
      setSaving(true)

      const res = await fetch(API, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignment)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add assignment')
      }

      alert('Assignment added')
      setAssignment({
        title: '',
        subject: '',
        description: '',
        dueDate: ''
      })

      await getAssignments()
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const saveReview = async submissionId => {
    const review = reviews[submissionId] || {
      marks: '',
      feedback: ''
    }

    if (
      review.marks !== '' &&
      (!Number.isFinite(Number(review.marks)) || Number(review.marks) < 0)
    ) {
      alert('Marks must be zero or greater')
      return
    }

    try {
      const res = await fetch(
        `${API}/submissions/${submissionId}/review`,
        {
          method: 'PUT',
          headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(review)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Review save nahi hui')
      }

      alert('Marks and feedback saved')

      const assignmentId = String(data.submission.assignmentId)
      await getSubmissions(assignmentId)
    } catch (error) {
      alert(error.message)
    }
  }

  const downloadFile = async submission => {
    try {
      const res = await fetch(
        `${API}/submissions/${submission._id}/file`,
        { headers: authHeaders }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'File download failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = submission.fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert(error.message)
    }
  }

  const formatDate = date => {
    if (!date) return 'Not specified'

    const value = new Date(date)
    if (isNaN(value.getTime())) return date

    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="hero">
      <h1>Manage Assignments</h1>

      <Link to="/teacher-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <h2>Add New Assignment</h2>

      <input
        placeholder="Title"
        value={assignment.title}
        onChange={e =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <input
        placeholder="Subject"
        value={assignment.subject}
        onChange={e =>
          setAssignment({ ...assignment, subject: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        value={assignment.description}
        onChange={e =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />

      <input
        type="date"
        value={assignment.dueDate}
        onChange={e =>
          setAssignment({ ...assignment, dueDate: e.target.value })
        }
      />

      <br /><br />

      <button onClick={saveAssignment} disabled={saving}>
        {saving ? 'Adding...' : 'Add Assignment'}
      </button>

      <h2>All Assignments & Student Submissions</h2>

      {assignments.map(a => (
        <div className="card" key={a._id}>
          <h3>{a.title}</h3>
          <p><strong>Subject:</strong> {a.subject}</p>
          <p>{a.description}</p>
          <p><strong>Due date:</strong> {formatDate(a.dueDate)}</p>

          <button onClick={() => getSubmissions(a._id)}>
            View Student Submissions
          </button>

          {loadingReviews[a._id] && <p>Loading submissions...</p>}

          {submissions[a._id] && (
            <div>
              <h3>Submitted Students: {submissions[a._id].length}</h3>

              {submissions[a._id].length === 0 && (
                <p>No students have submitted this assignment yet.</p>
              )}

              {submissions[a._id].map(s => (
                <div key={s._id} className="card">
                  <p><strong>Name:</strong> {s.studentName}</p>
                  <p><strong>Roll number:</strong> {s.rollNo || 'Not available'}</p>
                  <p><strong>Email:</strong> {s.studentEmail}</p>
                  <p><strong>File:</strong> {s.fileName}</p>
                  <p><strong>Submitted:</strong> {formatDate(s.submittedAt)}</p>
                  <p><strong>Status:</strong> {s.status}</p>

                  <button onClick={() => downloadFile(s)}>
                    Download Student File
                  </button>

                  <div>
                    <label>Marks</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter marks"
                      value={reviews[s._id]?.marks ?? ''}
                      onChange={e =>
                        setReviews(prev => ({
                          ...prev,
                          [s._id]: {
                            ...prev[s._id],
                            marks: e.target.value
                          }
                        }))
                      }
                    />

                    <label>Feedback</label>
                    <textarea
                      placeholder="Teacher feedback"
                      value={reviews[s._id]?.feedback ?? ''}
                      onChange={e =>
                        setReviews(prev => ({
                          ...prev,
                          [s._id]: {
                            ...prev[s._id],
                            feedback: e.target.value
                          }
                        }))
                      }
                    />

                    <button onClick={() => saveReview(s._id)}>
                      Save Marks & Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TeacherAssignments
