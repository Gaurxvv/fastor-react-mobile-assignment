import React, { useState } from 'react';
import './RestaurantCard.css';

// Fallback high-quality food images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80'
];

export function RestaurantCard({ restaurant, index, onClick }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImg = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const imageSrc = !imgError && restaurant.logo ? restaurant.logo : fallbackImg;

  // Clean address text if 'null' or missing
  const addressText =
    restaurant.address_complete && restaurant.address_complete !== 'null'
      ? restaurant.address_complete
      : 'Model Town, New Delhi';

  // Format price & item count
  const price = (150 + ((index * 37) % 250)).toFixed(2);
  const itemsCount = (index % 3) + 1;

  return (
    <div
      className="restaurant-card"
      onClick={() => onClick && onClick(restaurant)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick(restaurant);
        }
      }}
      aria-label={`View ${restaurant.restaurant_name}`}
    >
      <div className="card-image-wrap">
        <img
          src={imageSrc}
          alt={restaurant.restaurant_name}
          className="card-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>

      <div className="card-info">
        <div className="card-header-row">
          <h3 className="restaurant-title">{restaurant.restaurant_name}</h3>
          <span className="restaurant-price">₹{price}</span>
        </div>

        <div className="card-meta-row">
          <span className="restaurant-date" title={addressText}>
            {addressText.length > 32 ? addressText.slice(0, 30) + '...' : addressText}
          </span>
          <span className="restaurant-items-count">{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="card-actions-row">
          <button
            type="button"
            className="card-btn-action secondary"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(restaurant);
            }}
          >
            Cancel Order
          </button>
          <button
            type="button"
            className="card-btn-action primary"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(restaurant);
            }}
          >
            Track Driver
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
