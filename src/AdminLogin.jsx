import { useState } from 'react'

function AdminLogin() {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const handleLogin = async () => {
    try {
      const res = await fetch('https://smart-college-management-portal.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }

      if (data.role !== 'admin') {
        alert('Admin account required')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      window.location.href = '/admin-dashboard'
    } catch (error) {
      console.log('Login Error:', error)
      alert('Server se connection nahi ho raha')
    }
  }

  return (
    <div className="login">
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={login.email}
        onChange={e =>
          setLogin({
            ...login,
            email: e.target.value
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={login.password}
        onChange={e =>
          setLogin({
            ...login,
            password: e.target.value
          })
        }
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default AdminLogin