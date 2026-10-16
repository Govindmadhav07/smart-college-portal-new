
import { useState } from 'react'

const API = 'https://smart-college-management-portal.onrender.com/api'

function Login() {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!login.email || !login.password) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Login failed')
        return
      }

      if (data.role !== 'student') {
        alert('Student account required')
        return
      }

      const studentRes = await fetch(`${API}/students`, {
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      })

      let student = null

      if (studentRes.ok) {
        const students = await studentRes.json()
        const list = Array.isArray(students)
          ? students
          : students.students || []

        student = list.find(
          s => s.email?.toLowerCase() === login.email.trim().toLowerCase()
        )
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email || login.email)
      localStorage.setItem(
        'name',
        student?.name || data.name || 'Student'
      )

      window.location.href = `${import.meta.env.BASE_URL}dashboard`
    } catch (error) {
      console.error('Login error:', error)
      alert('Server se connection nahi ho raha. Backend URL aur CORS check karo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <h2>Student Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={login.email}
        onChange={e =>
          setLogin({ ...login, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={login.password}
        onChange={e =>
          setLogin({ ...login, password: e.target.value })
        }
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}

export default Login
