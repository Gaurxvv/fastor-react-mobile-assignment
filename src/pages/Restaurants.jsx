import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LogOut,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { StatusBar } from '../components/HeaderBar';
import RestaurantCard from '../components/RestaurantCard';
import { SkeletonCard, SkeletonBestSeller } from '../components/SkeletonCard';
import RestaurantDetail from './RestaurantDetail';
import { getRestaurants } from '../api/restaurants';
import { useAuth } from '../context/AuthContext';
import './Restaurants.css';

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Sushi Roll',
    price: '₹103.0',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80'
  },
  {
    id: 2,
    name: 'Noodle Bowl',
    price: '₹50.0',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80'
  },
  {
    id: 3,
    name: 'Italian Pasta',
    price: '₹12.99',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&q=80'
  },
  {
    id: 4,
    name: 'Berry Dessert',
    price: '₹8.20',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&q=80'
  },
  {
    id: 5,
    name: 'Crispy Burger',
    price: '₹16.50',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80'
  }
];

export function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const { logout, phone } = useAuth();
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRestaurants(118);
      setRestaurants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Filter restaurants by search query
  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = r.restaurant_name?.toLowerCase().includes(query);
    const addrMatch = r.address_complete?.toLowerCase().includes(query);
    return nameMatch || addrMatch;
  });

  // If a restaurant is selected, show Screen 4 Detail View!
  if (selectedRestaurant) {
    return (
      <RestaurantDetail
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
    );
  }

  return (
    <div className="restaurants-screen-wrapper">
      <StatusBar />

      {/* Top Location Bar */}
      <header className="location-header">
        <div className="location-info">
          <span className="location-caption">Current Locations</span>
          <div className="location-title-row">
            <MapPin size={15} className="location-pin" />
            <h1 className="location-title">Model Town, New Delhi</h1>
          </div>
        </div>

        <div className="user-profile-actions">
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title={`Logged in as ${phone}. Click to Logout`}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Search & Shortcut Buttons Row */}
      <div className="search-row-container">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            id="restaurant-search"
            type="text"
            className="search-input"
            placeholder="Karan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search restaurants"
          />
        </div>

        <button
          type="button"
          className="quick-icon-btn offer-btn"
          aria-label="Special Offers"
          title="Offers"
        >
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.88047 9.93126C7.51829 9.2482 6.45003 8.17948 7.32687 7.47037L7.66351 7.231C8.67944 6.50222 8.93431 5.09899 8.23944 4.05952L6.24986 1.05267C5.82479 0.400037 5.0989 0.00617862 4.32006 0.00548086C3.54951 -0.0786217 2.31309 0.828365 1.64223 1.13496C0.290817 1.85434 -0.332184 3.45322 0.176199 4.89729C1.22734 7.86702 2.74207 10.6516 4.6641 13.1476C4.6641 13.1476 7.34608 10.4676 7.88047 9.93126Z" fill="white"/>
            <path d="M20.8954 16.349C20.7651 15.7402 20.3924 15.2108 19.8632 14.8829L17.1405 13.1625C16.0052 12.474 14.5268 12.8362 13.8383 13.9715C13.837 13.9736 13.8357 13.9758 13.8344 13.9779C13.5968 14.2771 13.1827 14.3705 12.8396 14.2022C11.7564 13.6691 10.75 12.9923 9.84766 12.1901L14.2982 7.73961C14.5848 7.44377 14.5773 6.97162 14.2815 6.68498C13.9923 6.40472 13.5328 6.40477 13.2435 6.68503C11.7603 8.16213 2.93925 16.99 2.16586 17.7627C1.86843 18.0498 1.86005 18.5236 2.1472 18.8211C2.4343 19.1185 2.90817 19.1269 3.20565 18.8398L6.65381 15.3916C9.3022 18.0751 12.6335 19.9838 16.2879 20.9117C17.5718 21.2251 18.9129 20.6868 19.6239 19.5728C20.1528 18.6799 21.2623 17.4853 20.8954 16.349Z" fill="white"/>
          </svg>
        </button>

        <button
          type="button"
          className="quick-icon-btn wallet-btn"
          aria-label="My Orders and Wallet"
          title="Wallet"
        >
          <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.3112 0H20.0178H19.6189H19.22H16.1753H4.98772H3.52074H2.28539H2.05634H1.28939C0.882759 0 0.519876 0.187876 0.283101 0.483845C0.175008 0.620248 0.0926511 0.77724 0.0463256 0.949674C0.0180155 1.05777 0 1.17101 0 1.28682V1.44124V2.90822V15.6246C0 16.3349 0.576496 16.9114 1.28682 16.9114H20.3086C21.019 16.9114 21.5954 16.3349 21.5954 15.6246V12.0344H13.9594C12.7524 12.0344 11.7718 11.0538 11.7718 9.84676V8.66803V8.26911V7.8702V6.98487C11.7718 6.39293 12.0086 5.85506 12.3921 5.46129C12.7318 5.11125 13.1873 4.87448 13.6969 4.81528C13.7819 4.80502 13.8694 4.79984 13.9569 4.79984H20.5248H20.9237H21.3226H21.5954V1.28682C21.598 0.576496 21.0215 0 20.3112 0Z" fill="white"/>
          </svg>
        </button>
      </div>

      <div className="scrollable-feed-body">
        {/* Best Seller Horizontal Strip */}
        <section className="best-seller-section" aria-label="Best Sellers">
          <h2 className="section-heading">Best Seller</h2>
          <div className="best-seller-scroll-track">
            {BEST_SELLERS.map((item) => (
              <div
                key={item.id}
                className="best-seller-card"
                onClick={() =>
                  setSelectedRestaurant({
                    restaurant_id: String(item.id),
                    restaurant_name: item.name,
                    address_complete: 'Model Town, New Delhi',
                    logo: item.image
                  })
                }
              >
                <img src={item.image} alt={item.name} className="best-seller-img" loading="lazy" />
                <div className="best-seller-overlay">
                  <span className="best-seller-price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promotional Pizza 30% OFF Banner */}
        <section className="promo-banner-section" aria-label="Special Promotion">
          <div
            className="promo-banner-card"
            onClick={() =>
              setSelectedRestaurant({
                restaurant_id: 'promo-1',
                restaurant_name: 'Delicious Wood-Fired Pizza',
                address_complete: 'Special Chef Selection',
                logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
              })
            }
          >
            {/* Corner Decorative SVGs from Figma */}
            <svg
              className="promo-corner-decor-bottom"
              width="32"
              height="23"
              viewBox="0 0 32 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M28 23C28 33.4934 19.4934 42 9 42C-1.49341 42 -10 33.4934 -10 23C-10 12.5066 -1.49341 4 9 4C19.4934 4 28 12.5066 28 23Z"
                strokeWidth="8"
                stroke="#F5CB58"
              />
            </svg>
            <svg
              className="promo-corner-decor-top"
              width="55"
              height="18"
              viewBox="0 0 55 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M51 -9.5C51 3.47869 40.4787 14 27.5 14C14.5213 14 4 3.47869 4 -9.5C4 -22.4787 14.5213 -33 27.5 -33C40.4787 -33 51 -22.4787 51 -9.5Z"
                strokeWidth="8"
                stroke="#F5CB58"
              />
            </svg>

            <div className="promo-banner-text">
              <p className="promo-banner-subtitle">
                Experience our
                <br />
                delicious new dish
              </p>
              <h3 className="promo-banner-title">30% OFF</h3>
            </div>
            <div className="promo-banner-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80"
                alt="Delicious new dish 30% OFF"
                className="promo-banner-img"
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="banner-dots" aria-hidden="true">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                className={`banner-dot ${activeBannerSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveBannerSlide(idx)}
              />
            ))}
          </div>
        </section>

        {/* Popular Items / Fastor Restaurants Feed */}
        <section className="popular-items-section" aria-label="Popular Restaurants and Dishes">
          <div className="popular-header-row">
            <h2 className="section-heading">Popular Items</h2>
            {!loading && restaurants.length > 0 && (
              <span className="items-badge">{filteredRestaurants.length} found</span>
            )}
          </div>

          {/* Loading Skeleton State */}
          {loading && (
            <div className="loading-skeletons">
              {[1, 2, 3, 4, 5].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* Error State with Retry Button */}
          {!loading && error && (
            <div className="feed-error-container" role="alert">
              <AlertCircle size={32} className="error-icon" />
              <p className="error-text">{error}</p>
              <button type="button" className="retry-btn" onClick={fetchList}>
                <RefreshCw size={15} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredRestaurants.length === 0 && (
            <div className="feed-empty-container">
              <p className="empty-title">No restaurants found</p>
              <p className="empty-sub">
                No results matched "{searchQuery}". Try a different search term.
              </p>
            </div>
          )}

          {/* Real API Data Cards */}
          {!loading && !error && filteredRestaurants.length > 0 && (
            <div className="restaurant-cards-list">
              {filteredRestaurants.map((res, index) => (
                <RestaurantCard
                  key={res.restaurant_id || index}
                  restaurant={res}
                  index={index}
                  onClick={(item) => setSelectedRestaurant(item)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Restaurants;
