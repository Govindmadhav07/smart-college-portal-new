import { useState } from 'react'

function Login() {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
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

      if (data.role !== 'student') {
        alert('Student account required')
        return
      }

      // Get student details
      const studentRes = await fetch(
        `http://localhost:5000/api/students`
      )

      const students = await studentRes.json()

      const student = students.find(
        s => s.email?.toLowerCase() === login.email.toLowerCase()
      )

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      if (student) {
        localStorage.setItem('name', student.name)
      } else {
        localStorage.setItem('name', data.name || 'Student')
      }

      window.location.href = '/dashboard'
    } catch (error) {
      console.log('Login Error:', error)
      alert('Server se connection nahi ho raha')
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

export default Login