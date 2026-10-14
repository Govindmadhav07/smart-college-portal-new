import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TeacherMarks() {
    const [students, setStudents] = useState([])
    const [results, setResults] = useState([])

    const [result, setResult] = useState({
        studentEmail: '',
        subject: '',
        marks: '',
        total: ''
    })

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
        }
    }
    const getResults = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/results?t=${Date.now()}`
            )

            if (!res.ok) {
                throw new Error('Failed to fetch results')
            }

            const data = await res.json()
            setResults(data)
        } catch (error) {
            console.log('Results Error:', error)
        }
    }

    useEffect(() => {
        getStudents()
        getResults()
    }, [])

    const saveMarks = async () => {
        if (
            !result.studentEmail ||
            !result.subject ||
            result.marks === '' ||
            result.total === ''
        ) {
            alert('Please fill all fields')
            return
        }

        if (
            Number(result.marks) < 0 ||
            Number(result.total) <= 0
        ) {
            alert('Enter valid marks')
            return
        }

        if (Number(result.marks) > Number(result.total)) {
            alert('Marks cannot be greater than total marks')
            return
        }

        try {
            const res = await fetch(
                'http://localhost:5000/api/results',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentEmail: result.studentEmail,
                        subject: result.subject,
                        marks: Number(result.marks),
                        total: Number(result.total)
                    })
                }
            )

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(
                    errorData.message || 'Failed to save marks'
                )
            }

            alert('Marks Saved')

            setResult({
                studentEmail: '',
                subject: '',
                marks: '',
                total: ''
            })

            await getResults()
        } catch (error) {
            console.log('Marks Error:', error)
            alert('Failed to save marks')
        }
    }

    const editResult = async resultData => {
        const marks = window.prompt(
            `Enter new marks out of ${resultData.total}`,
            resultData.marks
        )

        if (marks === null) {
            return
        }

        if (
            marks === '' ||
            Number(marks) < 0 ||
            Number(marks) > Number(resultData.total)
        ) {
            alert('Enter valid marks')
            return
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/results/${resultData._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        marks: Number(marks)
                    })
                }
            )

            if (!res.ok) {
                throw new Error('Failed to update marks')
            }

            alert('Marks Updated')
            await getResults()
        } catch (error) {
            console.log('Edit Marks Error:', error)
            alert('Failed to update marks')
        }
    }

    const deleteResult = async id => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this result?'
        )

        if (!confirmDelete) {
            return
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/results/${id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!res.ok) {
                throw new Error('Failed to delete result')
            }

            alert('Marks Deleted')
            await getResults()
        } catch (error) {
            console.log('Delete Marks Error:', error)
            alert('Failed to delete marks')
        }
    }

    return (
        <div className="hero">
            <h1>Enter Student Marks</h1>

            <Link to="/teacher-dashboard">
                <button>← Back to Dashboard</button>
            </Link>

            <br />
            <br />

            <select
                value={result.studentEmail}
                onChange={e =>
                    setResult({
                        ...result,
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
                value={result.subject}
                onChange={e =>
                    setResult({
                        ...result,
                        subject: e.target.value
                    })
                }
            />

            <input
                type="number"
                min="0"
                placeholder="Marks"
                value={result.marks}
                onChange={e =>
                    setResult({
                        ...result,
                        marks: e.target.value
                    })
                }
            />

            <input
                type="number"
                min="1"
                placeholder="Total Marks"
                value={result.total}
                onChange={e =>
                    setResult({
                        ...result,
                        total: e.target.value
                    })
                }
            />

            <br />
            <br />

            <button onClick={saveMarks}>
                Save Marks
            </button>

            <button onClick={getResults}>
                Refresh
            </button>

            <br />
            <br />

            <h2>Student Results</h2>

            {results.length === 0 && (
                <p>No results found.</p>
            )}

            {results.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Marks</th>
                            <th>Percentage</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map(r => {
                            const student = students.find(
                                s => s.email === r.studentEmail
                            )

                            const percentage =
                                r.total > 0
                                    ? ((r.marks / r.total) * 100).toFixed(1)
                                    : '0.0'

                            return (
                                <tr key={r._id}>
                                    <td>
                                        {student
                                            ? student.name
                                            : 'Unknown'}
                                    </td>

                                    <td>{r.studentEmail}</td>

                                    <td>{r.subject}</td>

                                    <td>
                                        {r.marks} / {r.total}
                                    </td>

                                    <td>
                                        {percentage}%
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                editResult(r)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteResult(r._id)
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

export default TeacherMarks