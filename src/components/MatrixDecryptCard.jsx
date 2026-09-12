import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

const CIPHER_CHARS = '0123456789ABCDEF$#@%&*!~?><{}[]';

export const MatrixDecryptCard = ({
  questionNumber,
  title,
  finalValue,
  note,
  color = '#38bdf8',
  delayMs = 0,
  triggerKey = 0,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timerId;
    let iteration = 0;
    const targetLength = finalValue.length;
    const totalIterations = 28 + Math.floor(Math.random() * 12); // ~1.2s scramble

    setIsDecrypted(false);
    setProgress(0);

    const startTimeout = setTimeout(() => {
      timerId = setInterval(() => {
        iteration++;
        const resolvedCharsCount = Math.floor((iteration / totalIterations) * targetLength);
        setProgress(Math.min(100, Math.round((iteration / totalIterations) * 100)));

        if (iteration >= totalIterations) {
          setDisplayText(finalValue);
          setIsDecrypted(true);
          clearInterval(timerId);
        } else {
          // Build scrambled string: resolved part + random scrambled chars
          let currentStr = '';
          for (let i = 0; i < targetLength; i++) {
            if (i < resolvedCharsCount) {
              currentStr += finalValue[i];
            } else if (finalValue[i] === ' ' || finalValue[i] === ',' || finalValue[i] === '.' || finalValue[i] === '₹') {
              currentStr += finalValue[i];
            } else {
              currentStr += CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
            }
          }
          setDisplayText(currentStr);
        }
      }, 42);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timerId);
    };
  }, [finalValue, delayMs, triggerKey]);

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        padding: '20px 18px',
        borderTop: `4px solid ${color}`,
        background: isDecrypted ? 'rgba(15, 23, 42, 0.75)' : 'rgba(8, 14, 28, 0.85)',
        boxShadow: isDecrypted
          ? `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${color}22`
          : '0 8px 20px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Top Header: Question badge & Decryption status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            padding: '2px 8px',
            borderRadius: 6,
            background: `${color}20`,
            color: color,
            border: `1px solid ${color}40`,
          }}
        >
          {questionNumber}
        </span>

        <span
          style={{
            fontSize: '0.68rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: isDecrypted ? '#10b981' : '#38bdf8',
          }}
        >
          {isDecrypted ? (
            <>
              <Unlock size={11} color="#10b981" />
              <span>LOCKED // 100%</span>
            </>
          ) : (
            <>
              <Lock size={11} color="#38bdf8" />
              <span>DECRYPTING {progress}%</span>
            </>
          )}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          marginBottom: 6,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>

      {/* Scrambled / Decrypted Value Display */}
      <div
        style={{
          fontSize: '1.65rem',
          fontWeight: 900,
          color: isDecrypted ? color : '#38bdf8',
          fontFamily: isDecrypted ? 'var(--font-heading)' : 'monospace',
          letterSpacing: isDecrypted ? '-0.02em' : '0.08em',
          marginBottom: 6,
          minHeight: '2.2rem',
          display: 'flex',
          alignItems: 'center',
          textShadow: isDecrypted ? `0 0 16px ${color}66` : '0 0 12px #38bdf8aa',
          transition: 'color 0.2s ease, text-shadow 0.2s ease',
        }}
      >
        {displayText || finalValue}
      </div>

      {/* Note / Context */}
      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
        {note}
      </div>

      {/* Scanning laser beam effect during decryption */}
      {!isDecrypted && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 2,
            width: `${progress}%`,
            background: `linear-gradient(90deg, transparent, ${color}, #ffffff)`,
            boxShadow: `0 0 8px ${color}`,
            transition: 'width 0.05s linear',
          }}
        />
      )}
    </div>
  );
};
