import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './PropertyDetail.css'

export default function PropertyDetail() {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperty()
  }, [id])

  async function fetchProperty() {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProperty(response.data)
    } catch (err) {
      setError('Property not found.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleFavourite() {
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
      setProperty({ ...property, favourited: !property.favourited })
    } catch (err) {
      alert('Something went wrong. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading property...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div>
      <Navbar />
      <div className="detail-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Properties
        </button>

        <div className="detail-card">
          <div className="detail-image">
            <img
              src={property.image_url}
              alt={property.title}
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
            />
            <span className="detail-type">{property.property_type}</span>
          </div>

          <div className="detail-body">
            <div className="detail-title-row">
              <h1 className="detail-title">{property.title}</h1>
              <button
                className={`detail-favourite-btn ${property.favourited ? 'favourited' : ''}`}
                onClick={toggleFavourite}
              >
                ♥
              </button>
            </div>
            <p className="detail-address">📍 {property.address}</p>
            <p className="detail-price">NPR {property.price.toLocaleString()}</p>

            <div className="detail-stats">
              <div className="stat">
                <span className="stat-value">{property.bedrooms}</span>
                <span className="stat-label">Bedrooms</span>
              </div>
              <div className="stat">
                <span className="stat-value">{property.bathrooms}</span>
                <span className="stat-label">Bathrooms</span>
              </div>
              <div className="stat">
                <span className="stat-value">{property.area_sqft}</span>
                <span className="stat-label">Sq. Ft.</span>
              </div>
            </div>

            <div className="detail-description">
              <h3>About this property</h3>
              <p>{property.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}