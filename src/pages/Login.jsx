import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar, BackButton } from '../components/HeaderBar';
import Keypad from '../components/Keypad';
import { registerUser } from '../api/auth';
import { AlertCircle, Loader2 } from 'lucide-react';
import './Login.css';

export function Login() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleDigitPress = (digit) => {
    if (phone.length < 10) {
      setPhone((prev) => prev + digit);
      if (errorMessage) setErrorMessage('');
    }
  };

  const handleBackspace = () => {
    setPhone((prev) => prev.slice(0, -1));
    if (errorMessage) setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(rawVal);
    if (errorMessage) setErrorMessage('');
  };

  const isValidPhone = phone.length === 10;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValidPhone || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await registerUser(phone, '+91');
      // Navigate to OTP screen passing phone in router state
      navigate('/otp', { state: { phone, dial_code: '+91' } });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <StatusBar />

      <div className="login-top-nav">
        <BackButton onClick={() => {}} />
      </div>

      <div className="login-content">
        <h1 className="login-title">Sign Up to Fastor</h1>
        <p className="login-subtitle">
          Let us know your mobile number and we will send you an OTP for verification.
        </p>

        {errorMessage && (
          <div className="login-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`phone-input-container ${phone ? 'has-value' : ''}`}>
            <span className="phone-prefix">+91</span>
            <span className="phone-divider">|</span>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              className="phone-input-field"
              placeholder="00000-00000"
              value={phone}
              onChange={handleInputChange}
              maxLength={10}
              aria-label="Enter your 10-digit mobile number"
              disabled={isLoading}
            />
          </div>

          <button
            id="get-otp-btn"
            type="submit"
            className="btn-primary login-cta"
            disabled={!isValidPhone || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner-icon" />
                <span>Sending OTP...</span>
              </>
            ) : (
              'Get OTP'
            )}
          </button>
        </form>

        <p className="terms-disclaimer">
          By clicking, I accept the{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()} className="terms-link">
            Terms &amp; Conditions
          </a>{' '}
          and{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="terms-link">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Screen bottom: Figma Keypad */}
      <Keypad onKeyPress={handleDigitPress} onBackspace={handleBackspace} />
    </div>
  );
}

export default Login;
