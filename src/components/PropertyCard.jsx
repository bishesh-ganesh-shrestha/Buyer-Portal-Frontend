import { useNavigate } from 'react-router-dom'
import './PropertyCard.css'

export default function PropertyCard({ property, onToggleFavourite }) {
  const navigate = useNavigate()

  return (
    <div className="card" onClick={() => navigate(`/properties/${property.id}`)}>
      <div className="card-image">
        <img
          src={property.image_url}
          alt={property.title}
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
        />
        <span className="property-type">{property.property_type}</span>
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="property-title">{property.title}</h3>
          <button
            className={`favourite-btn ${property.favourited ? 'favourited' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavourite(property)
            }}
          >
            ♥
          </button>
        </div>
        <p className="property-address">📍 {property.address}</p>
        <p className="property-description">{property.description}</p>

        <div className="property-details">
          <span>🛏 {property.bedrooms} beds</span>
          <span>🚿 {property.bathrooms} baths</span>
          <span>📐 {property.area_sqft} sqft</span>
        </div>

        <div className="card-footer">
          <span className="property-price">
            NPR {property.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}