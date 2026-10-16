
import { useState } from 'react'

const API = 'https://smart-college-management-portal.onrender.com/api'

function Login() {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!login.email.trim() || !login.password) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: login.email.trim(),
          password: login.password
        })
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

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email || login.email.trim())
      localStorage.setItem('name', data.name || 'Student')

      // HashRouter-compatible redirect
      window.location.hash = '/dashboard'
    } catch (error) {
      console.error('Login error:', error)
      alert('Server connection failed. Please check the backend and CORS.')
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
        autoComplete="username"
        value={login.email}
        onChange={e =>
          setLogin({ ...login, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={login.password}
        onChange={e =>
          setLogin({ ...login, password: e.target.value })
        }
        onKeyDown={e => {
          if (e.key === 'Enter' && !loading) handleLogin()
        }}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}

export default Login
