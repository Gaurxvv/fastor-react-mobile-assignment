import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StatusBar, BackButton } from '../components/HeaderBar';
import Keypad from '../components/Keypad';
import { loginWithOtp, registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import './Otp.css';

export function Otp() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const phone = location.state?.phone || '9818979450';
  const dialCode = location.state?.dial_code || '+91';

  // Format phone display like +91 12345 67890
  const formattedPhone = `${dialCode} ${phone.slice(0, 5)} ${phone.slice(5)}`;

  // Countdown timer for resend
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  // Focus active input
  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  const handleBoxChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    if (clean.length > 1) {
      // User pasted or typed multiple digits
      const newDigits = [...digits];
      for (let i = 0; i < clean.length && index + i < 6; i++) {
        newDigits[index + i] = clean[i];
      }
      setDigits(newDigits);
      setErrorMessage('');
      const nextIdx = Math.min(index + clean.length, 5);
      setActiveIndex(nextIdx);
      return;
    }

    const char = clean.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage('');

    if (char && index < 5) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        setActiveIndex(index - 1);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      setActiveIndex(index + 1);
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);
    const nextIdx = Math.min(pasteData.length, 5);
    setActiveIndex(nextIdx);
  };

  // Mobile Keypad Handlers
  const handleKeypadPress = (digit) => {
    // Find first empty index or use current activeIndex
    let targetIndex = digits.findIndex((d) => d === '');
    if (targetIndex === -1) targetIndex = 5;

    const newDigits = [...digits];
    newDigits[targetIndex] = digit;
    setDigits(newDigits);
    setErrorMessage('');

    if (targetIndex < 5) {
      setActiveIndex(targetIndex + 1);
    } else {
      setActiveIndex(5);
    }
  };

  const handleKeypadBackspace = () => {
    // Find last filled index
    let lastFilledIndex = -1;
    for (let i = digits.length - 1; i >= 0; i--) {
      if (digits[i]) {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex !== -1) {
      const newDigits = [...digits];
      newDigits[lastFilledIndex] = '';
      setDigits(newDigits);
      setActiveIndex(lastFilledIndex);
    } else if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    setErrorMessage('');
  };

  const otpString = digits.join('');
  const isComplete = otpString.length === 6;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isComplete || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await loginWithOtp(phone, otpString, dialCode);
      const token = result.token || result;

      if (!token) {
        throw new Error('No authorization token received in response.');
      }

      login(token, phone);
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid OTP code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timerSeconds > 0 || isLoading) return;
    try {
      setIsLoading(true);
      setErrorMessage('');
      await registerUser(phone, dialCode);
      setTimerSeconds(30);
      setResendSuccess('New OTP sent successfully!');
      setTimeout(() => setResendSuccess(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const timerFormatted = `(${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(
    timerSeconds % 60
  ).padStart(2, '0')})`;

  return (
    <div className="otp-screen-wrapper">
      <StatusBar />

      <div className="otp-top-nav">
        <BackButton onClick={() => navigate('/login')} />
      </div>

      <div className="otp-content">
        <h1 className="otp-title">6-digit code</h1>
        <p className="otp-subtitle">
          Please enter the code we've sent to
          <br />
          <strong className="otp-phone-highlight">{formattedPhone}</strong>
        </p>

        {errorMessage && (
          <div className="otp-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="otp-success-banner" role="status">
            <span>{resendSuccess}</span>
          </div>
        )}

        {/* 6 OTP boxes matching Figma with dash separator after 3rd digit */}
        <div className="otp-boxes-container" onPaste={handlePaste}>
          <div className="otp-box-group">
            {[0, 1, 2].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`otp-digit-box ${activeIndex === idx ? 'focused' : ''} ${
                  digits[idx] ? 'filled' : ''
                }`}
                value={digits[idx]}
                onChange={(e) => handleBoxChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={() => setActiveIndex(idx)}
                aria-label={`Digit ${idx + 1}`}
                disabled={isLoading}
              />
            ))}
          </div>

          <span className="otp-dash">-</span>

          <div className="otp-box-group">
            {[3, 4, 5].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`otp-digit-box ${activeIndex === idx ? 'focused' : ''} ${
                  digits[idx] ? 'filled' : ''
                }`}
                value={digits[idx]}
                onChange={(e) => handleBoxChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={() => setActiveIndex(idx)}
                aria-label={`Digit ${idx + 1}`}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Resend / countdown timer */}
        <div className="otp-resend-row">
          <span>I didn't receive a code </span>
          {timerSeconds > 0 ? (
            <span className="otp-timer-highlight">{timerFormatted}</span>
          ) : (
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
              disabled={isLoading}
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Quick Staging OTP Helper Pill */}
        <div
          className="staging-otp-hint"
          onClick={() => {
            setDigits(['1', '2', '3', '4', '5', '6']);
            setActiveIndex(5);
            setErrorMessage('');
          }}
        >
          <span>Test OTP: <strong>123456</strong> (Tap to fill)</span>
        </div>

        <button
          id="continue-otp-btn"
          type="button"
          className="btn-primary otp-cta"
          disabled={!isComplete || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner-icon" />
              <span>Verifying...</span>
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>

      {/* Screen bottom: Figma Keypad */}
      <Keypad onKeyPress={handleKeypadPress} onBackspace={handleKeypadBackspace} />
    </div>
  );
}

export default Otp;
