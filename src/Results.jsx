import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Results() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getResults = async () => {
            try {
                const email = localStorage.getItem('email')

                if (!email) {
                    setLoading(false)
                    return
                }

                const res = await fetch(
                    `https://smart-college-management-portal.onrender.com/api/results?email=${encodeURIComponent(email)}`
                )

                if (!res.ok) {
                    throw new Error('Failed to fetch results')
                }

                const data = await res.json()
                setResults(data)
            } catch (error) {
                console.log('Results Error:', error)
            } finally {
                setLoading(false)
            }
        }

        getResults()
    }, [])

    return (
        <div className="hero">
            <h1>📝 My Results</h1>

            <Link to="/dashboard">
                <button>← Back to Dashboard</button>
            </Link>

            <br />
            <br />

            {loading && (
                <p>Loading results...</p>
            )}

            {!loading && results.length === 0 && (
                <p>No results found.</p>
            )}

            {!loading && results.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks</th>
                            <th>Total</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map(r => {
                            const percentage =
                                r.total > 0
                                    ? ((r.marks / r.total) * 100).toFixed(1)
                                    : '0.0'

                            return (
                                <tr key={r._id}>
                                    <td>{r.subject}</td>

                                    <td>{r.marks}</td>

                                    <td>{r.total}</td>

                                    <td>
                                        {percentage}%
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

export default Results