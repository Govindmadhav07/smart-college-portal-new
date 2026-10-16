import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Attendance() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAttendance = async () => {
            try {
                const email = localStorage.getItem('email')

                if (!email) {
                    setLoading(false)
                    return
                }

                const res = await fetch(
                    `https://smart-college-management-portal.onrender.com/api/attendance?email=${encodeURIComponent(email)}`
                )

                if (!res.ok) {
                    throw new Error('Failed to fetch attendance')
                }

                const result = await res.json()
                setData(result)
            } catch (error) {
                console.log('Attendance Error:', error)
            } finally {
                setLoading(false)
            }
        }

        getAttendance()
    }, [])

    const overallPercentage =
        data.length > 0
            ? (
                data.reduce(
                    (sum, item) =>
                        sum + Number(item.percentage),
                    0
                ) / data.length
            ).toFixed(1)
            : '0.0'

    return (
        <div className="hero">
            <h1>📊 My Attendance</h1>

            <Link to="/dashboard">
                <button>← Back to Dashboard</button>
            </Link>

            <br />
            <br />

            {loading && (
                <p>Loading attendance...</p>
            )}

            {!loading && data.length === 0 && (
                <p>No attendance records found.</p>
            )}

            {!loading && data.length > 0 && (
                <>
                    <h2>
                        Overall Attendance: {overallPercentage}%
                    </h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Attendance</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map(a => (
                                <tr key={a._id}>
                                    <td>{a.subject}</td>

                                    <td>
                                        {a.percentage}%
                                    </td>

                                    <td>
                                        {Number(a.percentage) >= 75
                                            ? 'Good'
                                            : 'Low'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

export default Attendance