import React from 'react';
import './SkeletonCard.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumb shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line title shimmer" />
        <div className="skeleton-line subtitle shimmer" />
        <div className="skeleton-line meta shimmer" />
        <div className="skeleton-buttons">
          <div className="skeleton-btn shimmer" />
          <div className="skeleton-btn shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBestSeller() {
  return (
    <div className="skeleton-best-seller shimmer" />
  );
}

export default SkeletonCard;
