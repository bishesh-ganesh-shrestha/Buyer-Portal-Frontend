import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <h1 className="navbar-title">🏠 Buyer Portal</h1>
        <p className="navbar-subtitle">Find your dream property</p>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  )
}