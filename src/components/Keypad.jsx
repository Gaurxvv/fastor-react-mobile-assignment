import React from 'react';
import { Delete } from 'lucide-react';
import './Keypad.css';

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '', letters: '', blank: true },
  { digit: '0', letters: '' },
  { digit: 'backspace', letters: '', isBackspace: true }
];

export function Keypad({ onKeyPress, onBackspace }) {
  return (
    <div className="mobile-keypad" role="region" aria-label="Numeric Keypad">
      <div className="keypad-grid">
        {KEYS.map((k, idx) => {
          if (k.blank) {
            return <div key={idx} className="keypad-key blank" />;
          }

          if (k.isBackspace) {
            return (
              <button
                key={idx}
                type="button"
                className="keypad-key backspace-key"
                onClick={onBackspace}
                aria-label="Backspace"
              >
                <Delete size={22} className="backspace-icon" />
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              className="keypad-key digit-key"
              onClick={() => onKeyPress(k.digit)}
              aria-label={`Digit ${k.digit}`}
            >
              <span className="key-digit">{k.digit}</span>
              {k.letters && <span className="key-letters">{k.letters}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Keypad;
