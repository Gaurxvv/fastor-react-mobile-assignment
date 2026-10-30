import React from 'react';
import { ArrowLeft, Wifi, Battery, Signal } from 'lucide-react';
import './HeaderBar.css';

export function StatusBar() {
  return (
    <div className="ios-status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-icons">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <Battery size={16} strokeWidth={2.5} />
      </div>
    </div>
  );
}

export function BackButton({ onClick, ariaLabel = "Go back" }) {
  return (
    <button
      type="button"
      className="figma-back-btn"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <ArrowLeft size={22} strokeWidth={2.4} />
    </button>
  );
}
