import { useState } from "react";

// Drop the official logo at public/beatland-logo.png and it replaces the
// built-in fallback below.
export const Logo = () => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageFailed) {
    return (
      <img
        className="logo-image"
        src={`${process.env.PUBLIC_URL}/beatland-logo.png`}
        alt="Beatland"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="logo">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="logo-mark-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c4b0ff" />
            <stop offset="1" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
        <path d="M6 4 L58 32 L6 60 L22 32 Z" fill="url(#logo-mark-fill)" />
        <path d="M22 32 L6 4 L36 20 Z" fill="#ffffff" opacity="0.35" />
      </svg>
      <div className="logo-text">
        <span className="logo-title">BEATLAND</span>
        <span className="logo-subtitle">WORLD BEATBOX BATTLE</span>
      </div>
    </div>
  );
};

// Images rather than emoji, since emoji flags don't render in the
// Linux/Chromium browser the recorder runs on.
export const Flag = ({ country, className = "flag" }) =>
  /^[a-z]{2}$/i.test(country || "") ? (
    <img
      className={className}
      src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
      alt={country.toUpperCase()}
    />
  ) : null;

export const LiveBadge = () => (
  <div className="live-badge">
    <span className="live-dot" />
    LIVE
  </div>
);
