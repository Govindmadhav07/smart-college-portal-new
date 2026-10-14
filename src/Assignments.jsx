
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:5000/api/assignments'

function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState({})

  const token = localStorage.getItem('token')

  const getAssignments = async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to load assignments')

      const data = await res.json()
      setAssignments(data)

      if (token) {
        const results = await Promise.all(
          data.map(async assignment => {
            try {
              const response = await fetch(
                `${API}/${assignment._id}/my-submission`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )

              if (!response.ok) return [assignment._id, null]

              return [assignment._id, await response.json()]
            } catch {
              return [assignment._id, null]
            }
          })
        )

        setSubmissions(Object.fromEntries(results))
      }
    } catch (error) {
      console.error(error)
      alert('Assignments load nahi ho paaye')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAssignments()
  }, [])

  const formatDate = date => {
    if (!date) return 'Not specified'

    const formattedDate = new Date(date)
    if (isNaN(formattedDate.getTime())) return date

    return formattedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const submitAssignment = async assignment => {
    const file = files[assignment._id]

    if (!token) {
      alert('Please login again')
      return
    }

    if (!file) {
      alert('Pehle assignment file choose karo')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(prev => ({ ...prev, [assignment._id]: true }))

      const res = await fetch(
        `${API}/${assignment._id}/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed')
      }

      alert('Assignment successfully submit ho gaya!')
      setFiles(prev => ({ ...prev, [assignment._id]: null }))
      await getAssignments()
    } catch (error) {
      alert(error.message || 'Assignment submit nahi hua')
    } finally {
      setUploading(prev => ({ ...prev, [assignment._id]: false }))
    }
  }

  return (
    <div className="hero">
      <h1>Assignments</h1>

      <Link to="/dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      {loading && <p>Loading assignments...</p>}

      {!loading && assignments.length === 0 && (
        <p>No assignments found.</p>
      )}

      <div className="cards">
        {assignments.map(a => {
          const submission = submissions[a._id]

          return (
            <div key={a._id}>
              <h3>{a.title}</h3>

              <p><strong>Subject:</strong> {a.subject}</p>
              <p>{a.description}</p>
              <p>
                <strong>Due Date:</strong> {formatDate(a.dueDate)}
              </p>

              <hr />

              <h3>Submit Your Assignment</h3>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={e =>
                  setFiles(prev => ({
                    ...prev,
                    [a._id]: e.target.files?.[0] || null
                  }))
                }
              />

              <p><small>PDF, DOC, DOCX, JPG, PNG — maximum 10 MB.</small></p>

              <button
                onClick={() => submitAssignment(a)}
                disabled={!!uploading[a._id]}
              >
                {uploading[a._id] ? 'Uploading...' : 'Submit Assignment'}
              </button>

              {submission && (
                <div>
                  <p><strong>Submitted file:</strong> {submission.fileName}</p>
                  <p>
                    <strong>Submitted on:</strong>{' '}
                    {formatDate(submission.submittedAt)}
                  </p>
                  <p><strong>Status:</strong> {submission.status}</p>

                  {submission.marks !== null && (
                    <p><strong>Marks:</strong> {submission.marks}</p>
                  )}

                  {submission.feedback && (
                    <p><strong>Teacher feedback:</strong> {submission.feedback}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Assignments
