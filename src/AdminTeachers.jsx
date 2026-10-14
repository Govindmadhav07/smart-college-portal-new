import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminTeachers() {
    const [teacher, setTeacher] = useState({
        name: '',
        email: '',
        subject: ''
    })

    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(false)

    const getTeachers = async () => {
        try {
            const res = await fetch(
                'http://localhost:5000/api/teachers'
            )

            if (!res.ok) {
                throw new Error('Failed to fetch teachers')
            }

            const data = await res.json()
            setTeachers(data)
        } catch (error) {
            console.log('Teachers Error:', error)
            alert('Failed to load teachers')
        }
    }

    useEffect(() => {
        getTeachers()
    }, [])

    const addTeacher = async () => {
        if (
            !teacher.name ||
            !teacher.email ||
            !teacher.subject
        ) {
            alert('Please fill all fields')
            return
        }

        try {
            setLoading(true)

            const res = await fetch(
                'http://localhost:5000/api/teachers',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(teacher)
                }
            )

            if (!res.ok) {
                throw new Error('Failed to add teacher')
            }

            alert('Teacher Added')

            setTeacher({
                name: '',
                email: '',
                subject: ''
            })

            getTeachers()
        } catch (error) {
            console.log('Add Teacher Error:', error)
            alert('Failed to add teacher')
        } finally {
            setLoading(false)
        }
    }

    const editTeacher = async teacherData => {
        const name = window.prompt(
            'Enter new name',
            teacherData.name
        )

        if (!name || name === teacherData.name) {
            return
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/teachers/${teacherData._id}`,
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
                throw new Error('Failed to update teacher')
            }

            alert('Teacher Updated')
            getTeachers()
        } catch (error) {
            console.log('Edit Teacher Error:', error)
            alert('Failed to update teacher')
        }
    }

    const deleteTeacher = async id => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this teacher?'
        )

        if (!confirmDelete) {
            return
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/teachers/${id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!res.ok) {
                throw new Error('Failed to delete teacher')
            }

            alert('Teacher Deleted')
            getTeachers()
        } catch (error) {
            console.log('Delete Teacher Error:', error)
            alert('Failed to delete teacher')
        }
    }

    return (
        <div className="hero">
            <h1>Manage Teachers</h1>

            <Link to="/admin-dashboard">
                <button>← Back to Dashboard</button>
            </Link>

            <br />
            <br />

            <input
                placeholder="Name"
                value={teacher.name}
                onChange={e =>
                    setTeacher({
                        ...teacher,
                        name: e.target.value
                    })
                }
            />

            <input
                type="email"
                placeholder="Email"
                value={teacher.email}
                onChange={e =>
                    setTeacher({
                        ...teacher,
                        email: e.target.value
                    })
                }
            />

            <input
                placeholder="Subject"
                value={teacher.subject}
                onChange={e =>
                    setTeacher({
                        ...teacher,
                        subject: e.target.value
                    })
                }
            />

            <br />
            <br />

            <button
                onClick={addTeacher}
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Teacher'}
            </button>

            <button onClick={getTeachers}>
                Refresh Teachers
            </button>

            <p>
                Total Teachers:{' '}
                <strong>{teachers.length}</strong>
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {teachers.map(t => (
                        <tr key={t._id}>
                            <td>{t.name}</td>
                            <td>{t.email}</td>
                            <td>{t.subject}</td>

                            <td>
                                <button
                                    onClick={() =>
                                        editTeacher(t)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteTeacher(t._id)
                                    }
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

export default AdminTeachers