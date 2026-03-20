import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login, token } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setLoading(true)

    try {
      const url = isRegister
        ? 'http://localhost:3000/api/v1/register'
        : 'http://localhost:3000/api/v1/login'

      const payload = isRegister
        ? { user: formData }
        : { email: formData.email, password: formData.password }

      const response = await axios.post(url, payload)
      login(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (token) {
    return <Navigate to="/dashboard" />
  }

  function validateForm() {
    if (isRegister) {
      if (!formData.name || formData.name.trim().split(/\s+/).length < 2) {
        setError('Please enter your full name (first and last name).')
        return false
      }
      if (/\d/.test(formData.name)) {
        setError('Full name cannot contain numbers.')
        return false
      }
      if (/[^a-zA-Z\s\-']/.test(formData.name)) {
        setError('Full name can only contain letters, spaces, hyphens and apostrophes.')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address.')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return false
      }
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match.')
        return false
      }
    }
    return true
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🏠 Buyer Portal</h1>
        <h2 className="subtitle">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <input
              className="input"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          )}
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span className="link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  )
}