
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

const API = 'http://localhost:5000/api'

function AdminFees() {
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [studentEmail, setStudentEmail] = useState('')
  const [totalFees, setTotalFees] = useState('')
  const [academicYear, setAcademicYear] = useState('2026-27')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [studentsRes, feesRes] = await Promise.all([
        fetch(`${API}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/fees?academicYear=${encodeURIComponent(academicYear)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!studentsRes.ok) {
        throw new Error('Students load nahi hue. Admin login check karo.')
      }

      if (!feesRes.ok) {
        throw new Error('Fees records load nahi hue. Backend check karo.')
      }

      const studentsData = await studentsRes.json()
      const feesData = await feesRes.json()

      setStudents(Array.isArray(studentsData) ? studentsData : [])
      setFees(Array.isArray(feesData) ? feesData : [])
    } catch (err) {
      setError(err.message || 'Data load nahi ho saka.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [academicYear])

  const saveFees = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!studentEmail || totalFees === '' || Number(totalFees) < 0) {
      setError('Student aur valid total fees select karo.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`${API}/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentEmail,
          totalFees: Number(totalFees),
          academicYear
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Fees save nahi hui.')
      }

      setMessage(data.message || 'Fees successfully saved.')
      setTotalFees('')
      await loadData()
    } catch (err) {
      setError(err.message || 'Fees save nahi hui.')
    } finally {
      setSaving(false)
    }
  }

  const money = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(Number(amount || 0))

  const totalAssigned = fees.reduce(
    (sum, fee) => sum + Number(fee.totalFees || 0),
    0
  )

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paid || 0),
    0
  )

  const totalPending = fees.reduce(
    (sum, fee) => sum + Number(fee.balance || 0),
    0
  )

  return (
    <div className="hero">
      <Logout />

      <h1>Fees Management</h1>
      <p>Manage student fees and payment records.</p>

      <div className="buttons">
        <Link to="/admin-dashboard">
          <button>← Admin Dashboard</button>
        </Link>
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div className="cards">
        <div>
          <h3>Total Assigned</h3>
          <h2>{money(totalAssigned)}</h2>
        </div>

        <div>
          <h3>Total Paid</h3>
          <h2>{money(totalPaid)}</h2>
        </div>

        <div>
          <h3>Total Pending</h3>
          <h2>{money(totalPending)}</h2>
        </div>
      </div>

      <section style={{ margin: '30px auto', maxWidth: '650px' }}>
        <h2>Set Student Fees</h2>

        <form onSubmit={saveFees}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="academicYear">Academic Year</label>
            <select
              id="academicYear"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '6px' }}
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
              <option value="2027-28">2027-28</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="studentEmail">Select Student</label>
            <select
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '6px' }}
            >
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student._id} value={student.email}>
                  {student.name} ({student.rollNo || student.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="totalFees">Total Fees (₹)</label>
            <input
              id="totalFees"
              type="number"
              min="0"
              step="0.01"
              value={totalFees}
              onChange={(e) => setTotalFees(e.target.value)}
              placeholder="Enter total fees"
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '6px' }}
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Fees'}
          </button>
        </form>
      </section>

      <section style={{ marginTop: '35px', overflowX: 'auto' }}>
        <h2>Student Fee Records</h2>

        {loading ? (
          <p>Loading fees...</p>
        ) : fees.length === 0 ? (
          <p>No fee records found for {academicYear}.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Roll No.</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Total Fees</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Paid</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Pending</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Payments</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id}>
                  <td style={{ padding: '10px' }}>{fee.studentName}</td>
                  <td style={{ padding: '10px' }}>{fee.rollNo || '-'}</td>
                  <td style={{ padding: '10px' }}>{money(fee.totalFees)}</td>
                  <td style={{ padding: '10px' }}>{money(fee.paid)}</td>
                  <td style={{ padding: '10px' }}>{money(fee.balance)}</td>
                  <td style={{ padding: '10px' }}>
                    {fee.payments?.filter((p) => p.status === 'Paid').length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default AdminFees
