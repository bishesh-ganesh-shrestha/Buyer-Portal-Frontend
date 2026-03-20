import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'
import './Dashboard.css'

export default function Dashboard() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'all'

  function handleTabChange(tab) {
    setSearchParams({ tab })
  }

  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  })

  async function fetchProperties() {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/properties', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProperties(response.data)
    } catch {
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  async function toggleFavourite(property) {
    try {
      if (property.favourited) {
        await axios.delete(`http://localhost:3000/api/v1/favourites/${property.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:3000/api/v1/favourites',
          { property_id: property.id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      setProperties(properties.map(p =>
        p.id === property.id ? { ...p, favourited: !p.favourited } : p
      ))
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const filteredProperties = activeTab === 'all'
    ? properties
    : properties.filter(p => p.favourited)

  if (loading) return <div className="loading">Loading properties...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">🏠 Buyer Portal</h1>
          <p className="header-subtitle">Find your dream property</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Properties ({properties.length})
          </button>
          <button
            className={`tab ${activeTab === 'favourites' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('favourites')}
          >
            My Favourites ({properties.filter(p => p.favourited).length})
          </button>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="empty">
            {activeTab === 'favourites'
              ? "You haven't added any favourites yet. Browse properties and click ♡ to save them."
              : 'No properties available.'}
          </div>
        ) : (
          <div className="grid">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}