import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminNotices() {
  const [notice, setNotice] = useState({
    title: '',
    details: ''
  })

  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(false)

  const getNotices = async () => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/notices'
      )

      if (!res.ok) {
        throw new Error('Failed to fetch notices')
      }

      const data = await res.json()
      setNotices(data)
    } catch (error) {
      console.log('Notices Error:', error)
      alert('Failed to load notices')
    }
  }

  useEffect(() => {
    getNotices()
  }, [])

  const addNotice = async () => {
    if (!notice.title || !notice.details) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(
        'http://localhost:5000/api/notices',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notice)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to publish notice')
        return
      }

      alert('Notice Published')

      setNotice({
        title: '',
        details: ''
      })

      getNotices()
    } catch (error) {
      console.log('Add Notice Error:', error)
      alert('Failed to publish notice')
    } finally {
      setLoading(false)
    }
  }

  const editNotice = async noticeData => {
    const title = window.prompt(
      'Enter new notice title',
      noticeData.title
    )

    if (!title) {
      return
    }

    const details = window.prompt(
      'Enter notice details',
      noticeData.details
    )

    if (!details) {
      return
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/notices/${noticeData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            details
          })
        }
      )

      if (!res.ok) {
        throw new Error('Update failed')
      }

      alert('Notice updated')
      getNotices()
    } catch (error) {
      console.log('Edit Notice Error:', error)
      alert('Failed to update notice')
    }
  }

  const deleteNotice = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this notice?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/notices/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      alert('Notice deleted')
      getNotices()
    } catch (error) {
      console.log('Delete Notice Error:', error)
      alert('Failed to delete notice')
    }
  }

  return (
    <div className="hero">
      <h1>Manage Notices</h1>

      <Link to="/admin-dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <br />
      <br />

      <input
        placeholder="Notice Title"
        value={notice.title}
        onChange={e =>
          setNotice({
            ...notice,
            title: e.target.value
          })
        }
      />

      <textarea
        placeholder="Notice Details"
        value={notice.details}
        onChange={e =>
          setNotice({
            ...notice,
            details: e.target.value
          })
        }
      />

      <br />
      <br />

      <button
        onClick={addNotice}
        disabled={loading}
      >
        {loading ? 'Publishing...' : 'Publish Notice'}
      </button>

      <button onClick={getNotices}>
        Refresh Notices
      </button>

      <p>
        Total Notices: <strong>{notices.length}</strong>
      </p>

      <div className="cards">
        {notices.map(n => (
          <div key={n._id}>
            <h3>{n.title}</h3>

            <p>{n.details}</p>

            <br />

            <button
              onClick={() => editNotice(n)}
            >
              Edit
            </button>

            <button
              onClick={() => deleteNotice(n._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminNotices