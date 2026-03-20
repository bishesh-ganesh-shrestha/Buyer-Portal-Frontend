import './PropertyCard.css'

export default function PropertyCard({ property, onToggleFavourite }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="property-type">{property.property_type}</span>
        <button
          className={`favourite-btn ${property.favourited ? 'favourited' : ''}`}
          onClick={() => onToggleFavourite(property)}
        >
          {property.favourited ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <h3 className="property-title">{property.title}</h3>
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