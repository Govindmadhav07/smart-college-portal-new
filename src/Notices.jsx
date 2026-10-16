import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getNotices = async () => {
      try {
        const res = await fetch(
          'https://smart-college-management-portal.onrender.com/api/notices'
        )

        if (!res.ok) {
          throw new Error('Failed to fetch notices')
        }

        const data = await res.json()
        setNotices(data)
      } catch (error) {
        console.log('Notices Error:', error)
        setError('Unable to load notices')
      } finally {
        setLoading(false)
      }
    }

    getNotices()
  }, [])

  const formatDate = date => {
    if (!date) {
      return 'Date not available'
    }

    const formattedDate = new Date(date)

    if (isNaN(formattedDate.getTime())) {
      return 'Date not available'
    }

    return formattedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="hero">
      <h1>📢 Notice Board</h1>

      <Link to="/dashboard">
        <button>← Back to Dashboard</button>
      </Link>

      <br />
      <br />

      {loading && (
        <p>Loading notices...</p>
      )}

      {!loading && error && (
        <p>{error}</p>
      )}

      {!loading &&
        !error &&
        notices.length === 0 && (
          <p>No notices found.</p>
        )}

      {!loading &&
        !error &&
        notices.length > 0 && (
          <div className="cards">
            {notices.map(n => (
              <div key={n._id}>
                <h3>📢 {n.title}</h3>

                <p>{n.details}</p>

                <p>
                  <strong>Published:</strong>{' '}
                  {formatDate(
                    n.createdAt || n.updatedAt
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default Notices