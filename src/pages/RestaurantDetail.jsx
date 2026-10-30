import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { StatusBar } from '../components/HeaderBar';
import './RestaurantDetail.css';

const PORTION_OPTIONS = [
  { id: 'personal', name: 'Personal (4 Slides)', priceDiff: 0, priceLabel: '₹0.00' },
  { id: 'medium', name: 'Medium (8 Slides)', priceDiff: 3, priceLabel: '₹3.00' },
  { id: 'familiar', name: 'Familiar (10 Slides)', priceDiff: 6, priceLabel: '₹6.00' },
  { id: 'jumbo', name: 'Jumbo (12 Slides)', priceDiff: 10, priceLabel: '₹10.00' }
];

export function RestaurantDetail({ restaurant: propRestaurant, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const restaurant = propRestaurant || location.state?.restaurant || {
    restaurant_id: id || '75',
    restaurant_name: 'Delicious Pizza & More',
    address_complete: 'Model Town, New Delhi',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
  };

  const [quantity, setQuantity] = useState(3);
  const [selectedPortion, setSelectedPortion] = useState('jumbo');
  const [addedToast, setAddedToast] = useState(false);

  const basePrice = 14.0;
  const currentPortion = PORTION_OPTIONS.find((p) => p.id === selectedPortion);
  const totalPrice = ((basePrice + (currentPortion?.priceDiff || 0)) * quantity).toFixed(2);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="detail-screen-wrapper">
      <StatusBar />

      {/* Hero Image Section */}
      <div className="detail-hero-section">
        <img
          src={
            restaurant.logo && !restaurant.logo.includes('null')
              ? restaurant.logo
              : 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
          }
          alt={restaurant.restaurant_name}
          className="detail-hero-img"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80';
          }}
        />
        <button
          type="button"
          className="detail-back-pill"
          onClick={handleBack}
          aria-label="Back to restaurant list"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="detail-body">
        {/* Top Divider Line from Figma */}
        <svg
          className="detail-price-qty-divider"
          width="100%"
          height="1"
          viewBox="0 0 323 1"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 0.5H323" stroke="#FFD8C7" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Price & Quantity Row */}
        <div className="detail-price-qty-row">
          <span className="detail-price-tag">₹{totalPrice}</span>
          <div className="detail-qty-stepper-wrap">
            <svg
              width="89"
              height="31"
              viewBox="0 0 89 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stepper-svg"
            >
              <g clipPath="url(#clip0_1_1530)">
                {/* Decrement Button (Minus) */}
                <g
                  className="stepper-btn-minus"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  role="button"
                  tabIndex={0}
                  aria-label="Decrease quantity"
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M3.37766 10.8192C5.93047 3.97537 13.195 4.52072 13.195 4.52072C13.195 4.52072 20.4626 3.97537 23.0124 10.8192C24.0108 13.5205 24.0108 16.4995 23.0124 19.2009C20.4626 26.0416 13.195 25.4994 13.195 25.4994C13.195 25.4994 5.93046 26.0416 3.37766 19.2009C2.3823 16.499 2.3823 13.521 3.37766 10.8192Z"
                    fill="#E95322"
                    strokeWidth="1.87927"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#E95322"
                  />
                  <path
                    d="M17.7031 15.3304H9.2085"
                    strokeWidth="1.87927"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#F8F8F8"
                  />
                </g>

                {/* Quantity Number */}
                {quantity === 3 ? (
                  <path
                    d="M40.7784 9.07887C40.8272 8.89156 40.9575 8.63912 41.1693 8.32152C41.381 8.00392 41.6823 7.68632 42.0732 7.36873C42.4722 7.04299 42.9649 6.77018 43.5513 6.5503C44.1457 6.33043 44.8501 6.22049 45.6645 6.22049C46.6906 6.22049 47.566 6.41186 48.2908 6.79461C49.0237 7.16921 49.5815 7.68225 49.9643 8.33373C50.3552 8.98521 50.5506 9.71813 50.5506 10.5325C50.5506 11.1595 50.4284 11.7255 50.1841 12.2304C49.9398 12.7353 49.6222 13.1506 49.2314 13.4764C48.8486 13.794 48.4414 13.9894 48.0098 14.0627C48.4659 14.1034 48.93 14.2826 49.4024 14.6002C49.8747 14.9178 50.2697 15.3534 50.5872 15.9072C50.9048 16.461 51.0636 17.1247 51.0636 17.8983C51.0636 18.8511 50.8316 19.7102 50.3674 20.4757C49.9113 21.2331 49.2721 21.8316 48.4496 22.2714C47.6352 22.7111 46.6906 22.931 45.6156 22.931C44.557 22.931 43.653 22.7518 42.9038 22.3935C42.1628 22.0271 41.5683 21.5832 41.1204 21.062C40.6725 20.5409 40.3671 20.036 40.2043 19.5474L42.1221 18.5579C42.2442 18.9162 42.4519 19.2908 42.745 19.6817C43.0464 20.0645 43.4332 20.3902 43.9055 20.6589C44.386 20.9277 44.9479 21.062 45.5912 21.062C46.3078 21.062 46.9145 20.9195 47.4113 20.6345C47.9162 20.3413 48.2989 19.9545 48.5595 19.4741C48.8201 18.9855 48.9504 18.4439 48.9504 17.8494C48.9504 17.1898 48.7916 16.6483 48.474 16.2248C48.1646 15.8013 47.7533 15.4919 47.2403 15.2964C46.7272 15.0929 46.1775 14.9911 45.5912 14.9911H45.2736V13.3786H45.6889C46.2101 13.3786 46.6906 13.2728 47.1303 13.061C47.5782 12.8493 47.9365 12.5399 48.2053 12.1327C48.4821 11.7255 48.6206 11.241 48.6206 10.6791C48.6206 9.92986 48.3722 9.29467 47.8755 8.77348C47.3787 8.2523 46.6295 7.99171 45.6278 7.99171C45.0741 7.99171 44.6018 8.07314 44.2109 8.23601C43.8281 8.39888 43.5187 8.5984 43.2825 8.83456C43.0464 9.06258 42.8672 9.27838 42.745 9.48197C42.631 9.68556 42.5659 9.83214 42.5496 9.92172L40.7784 9.07887Z"
                    fill="#391713"
                  />
                ) : (
                  <text
                    x="45"
                    y="21"
                    fontSize="16"
                    fontWeight="800"
                    textAnchor="middle"
                    fill="#391713"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    {quantity}
                  </text>
                )}

                {/* Increment Button (Plus) */}
                <g
                  className="stepper-btn-plus"
                  onClick={() => setQuantity((q) => q + 1)}
                  role="button"
                  tabIndex={0}
                  aria-label="Increase quantity"
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M65.3936 10.8192C67.9464 3.97537 75.2109 4.52072 75.2109 4.52072C75.2109 4.52072 82.4785 3.97537 85.0283 10.8192C86.0267 13.5205 86.0267 16.4995 85.0283 19.2009C82.4785 26.0416 75.2109 25.4994 75.2109 25.4994C75.2109 25.4994 67.9464 26.0416 65.3936 19.2009C64.3982 16.499 64.3982 13.521 65.3936 10.8192Z"
                    fill="#E95322"
                    strokeWidth="1.87927"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#E95322"
                  />
                  <path
                    d="M75.4744 11.0874V15.3306M75.4744 15.3306V19.675M75.4744 15.3306H79.7191M75.4744 15.3306H71.2245"
                    strokeWidth="1.87927"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#F8F8F8"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_1_1530">
                  <rect width="88.3258" height="30.0684" rx="15.0342" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom Divider Line from Figma */}
        <svg
          className="detail-price-qty-divider"
          width="100%"
          height="1"
          viewBox="0 0 323 1"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 0.5H323" stroke="#FFD8C7" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Title & Description */}
        <h2 className="detail-title">{restaurant.restaurant_name}</h2>
        <p className="detail-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>

        {/* Portion Selector List with Dotted Leaders */}
        <div className="portion-section">
          <h3 className="portion-section-heading">Personal portion</h3>
          <div className="portion-list">
            {PORTION_OPTIONS.map((opt) => {
              const isSelected = selectedPortion === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`portion-row ${isSelected ? 'selected' : ''}`}
                >
                  <span className="portion-name">{opt.name}</span>
                  <div className="portion-dotted-line-wrap">
                    <svg
                      className="portion-dotted-svg"
                      width="100%"
                      height="1"
                      viewBox="0 0 175 1"
                      fill="none"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 0.5H0.991477M174.5 0.5H173.509M2.97443 0.5H4.95739M6.94034 0.5H8.9233M10.9063 0.5H12.8892M14.8722 0.5H16.8551M18.8381 0.5H20.821M22.804 0.5H24.7869M26.7699 0.5H28.7528M30.7358 0.5H32.7188M34.7017 0.5H36.6847M38.6676 0.5H40.6506M42.6335 0.5H44.6165M46.5994 0.5H48.5824M50.5654 0.5H52.5483M54.5313 0.5H56.5142M58.4972 0.5H60.4801M62.4631 0.5H64.446M66.429 0.5H68.412M70.3949 0.5H72.3779M74.3608 0.5H76.3438M78.3267 0.5H80.3097M82.2926 0.5H84.2756M86.2586 0.5H88.2415M90.2245 0.5H92.2074M94.1904 0.5H96.1733M98.1563 0.5H100.139M102.122 0.5H104.105M106.088 0.5H108.071M110.054 0.5H112.037M114.02 0.5H116.003M117.986 0.5H119.969M121.952 0.5H123.935M125.918 0.5H127.901M129.884 0.5H131.867M133.85 0.5H135.832M137.815 0.5H139.798M141.781 0.5H143.764M145.747 0.5H147.73M149.713 0.5H151.696M153.679 0.5H155.662M157.645 0.5H159.628M161.611 0.5H163.594M165.577 0.5H167.56M169.543 0.5H171.526"
                        stroke="#FFD8C7"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <span className="portion-price-tag">{opt.priceLabel}</span>
                  <span className="portion-radio-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5 7.5C14.5 11.366 11.366 14.5 7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5Z"
                        stroke="#E95322"
                      />
                      <path
                        d="M11.5 7.5C11.5 9.70914 9.70914 11.5 7.5 11.5C5.29086 11.5 3.5 9.70914 3.5 7.5C3.5 5.29086 5.29086 3.5 7.5 3.5C9.70914 3.5 11.5 5.29086 11.5 7.5Z"
                        fill={isSelected ? '#E95322' : 'none'}
                        stroke="#E95322"
                      />
                    </svg>
                  </span>
                  <input
                    type="radio"
                    name="portion"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedPortion(opt.id)}
                    className="portion-hidden-radio"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Order History Cards from Figma Frame 1:1343 */}
        <div className="detail-order-history-section">
          <svg
            className="detail-price-qty-divider"
            width="100%"
            height="1"
            viewBox="0 0 323 1"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M0 0.5H323" stroke="#FFD8C7" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Order 1: Sushi Wave */}
          <div className="order-history-card">
            <img
              src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80"
              alt="Sushi Wave"
              className="order-card-img"
            />
            <div className="order-card-content">
              <div className="order-card-header">
                <span className="order-card-title">Sushi Wave</span>
                <span className="order-card-price">₹20.00</span>
              </div>
              <div className="order-card-meta">
                <span className="order-card-date">22 Apr, 01:20 pm</span>
                <span className="order-card-count">2 items</span>
              </div>
              <div className="order-card-actions">
                <button
                  type="button"
                  className="btn-pill-cancel"
                  onClick={() => alert('Order cancelled')}
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  className="btn-pill-track"
                  onClick={() => alert('Tracking driver...')}
                >
                  Track Driver
                </button>
              </div>
            </div>
          </div>

          <svg
            className="detail-price-qty-divider"
            width="100%"
            height="1"
            viewBox="0 0 323 1"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M0 0.5H323" stroke="#FFD8C7" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Order 2: Strawberry Shake */}
          <div className="order-history-card">
            <img
              src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80"
              alt="Strawberry Shake"
              className="order-card-img"
            />
            <div className="order-card-content">
              <div className="order-card-header">
                <span className="order-card-title">Strawberry Shake</span>
                <span className="order-card-price">₹20.00</span>
              </div>
              <div className="order-card-meta">
                <span className="order-card-date">29 Nov, 01:20 pm</span>
                <span className="order-card-count">1 items</span>
              </div>
              <div className="order-card-actions">
                <button
                  type="button"
                  className="btn-pill-cancel"
                  onClick={() => alert('Order cancelled')}
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  className="btn-pill-track"
                  onClick={() => alert('Tracking driver...')}
                >
                  Track Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Add to Cart CTA */}
      <div className="detail-bottom-bar">
        <button
          type="button"
          className="btn-primary detail-add-cart-btn"
          onClick={handleAddToCart}
          disabled={addedToast}
        >
          {addedToast ? (
            <>
              <Check size={20} />
              <span>Added to Cart!</span>
            </>
          ) : (
            'Add to cart'
          )}
        </button>
      </div>
    </div>
  );
}

export default RestaurantDetail;
