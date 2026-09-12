import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { City3DBackground } from '../components/City3DBackground';
import { KeyRound, Mail, ArrowRight, ShieldCheck, Zap, Terminal, Activity, Database, Radar } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('c7c1305e70');

  const demoPersonas = [
    {
      email: 'demo1@ivy.homes',
      code: 'demo1',
      role: 'Portfolio Lead',
      theme: '#38bdf8', // Neon Sky Cyan
      glow: 'rgba(56, 189, 248, 0.45)',
      desc: 'Acquisitions & Market Feeds',
    },
    {
      email: 'demo2@ivy.homes',
      code: 'demo2',
      role: 'Asset Analyst',
      theme: '#ec4899', // Hot Rose Pink
      glow: 'rgba(236, 72, 153, 0.45)',
      desc: 'Valuation & Pricing Yields',
    },
    {
      email: 'demo3@ivy.homes',
      code: 'demo3',
      role: 'Data Auditor',
      theme: '#10b981', // Emerald Mint
      glow: 'rgba(16, 185, 129, 0.45)',
      desc: 'Matrix & Fraud Forensics',
    },
  ];

  const activePersona = demoPersonas.find((p) => p.email === email) || demoPersonas[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login submit error:', err);
    }
  };

  const setDemoAccount = (persona) => {
    setEmail(persona.email);
    setPassword('c7c1305e70');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #0d1226 0%, #050711 75%, #020307 100%)',
        padding: '24px 16px',
        color: '#f8fafc',
      }}
    >
      {/* 3D Animated Vibrant City Skyline + Holographic Beacons */}
      <City3DBackground activeTheme={activePersona.theme} />

      {/* Cyberpunk HUD Corner Anchors - Uniting the Viewport */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 28,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(10, 15, 30, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: 'monospace',
          fontSize: '0.74rem',
          color: '#94a3b8',
          letterSpacing: '0.06em',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: activePersona.theme,
            boxShadow: `0 0 10px ${activePersona.theme}`,
            animation: 'pulse 2s infinite',
          }}
        />
        <span>SYS_NODE: MUMBAI_PRIMARY // 19.1176° N, 72.9060° E</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 28,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(10, 15, 30, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: 'monospace',
          fontSize: '0.74rem',
          color: '#94a3b8',
        }}
      >
        <Radar size={14} color={activePersona.theme} />
        <span>RADAR: POWAI LOCALITY ACTIVE</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 28,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: '#64748b',
        }}
      >
        <Terminal size={13} color="#64748b" />
        <span>IVY HOMES DETECTIVE TERMINAL • API KEY: IVY26-AC068556E03E</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 28,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: '#64748b',
        }}
      >
        <Activity size={13} color={activePersona.theme} />
        <span>RECORDS: 4,950 SALE | 2,050 RENT | 590 PROJ</span>
      </div>

      {/* Atmospheric Dynamic Glow Mesh */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${activePersona.glow} 0%, transparent 65%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.5s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '25%',
          width: 450,
          height: 450,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main Iridescent Glassmorphic Command Deck */}
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: 520,
          width: '100%',
          padding: '38px 36px',
          borderRadius: 24,
          background: 'rgba(8, 12, 24, 0.65)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 50px ${activePersona.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Glowing Top Pill with Hex Icon */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 24,
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${activePersona.theme}`,
              color: activePersona.theme,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: `0 0 16px ${activePersona.glow}`,
              marginBottom: 16,
              transition: 'all 0.3s ease',
            }}
          >
            <Zap size={13} color={activePersona.theme} />
            <span>Ivy Intelligence Deck • Mumbai</span>
          </div>

          <h1
            className="gradient-title"
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Ivy Homes
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
            Real-Time Verified Property Portal & Detective Insights
          </p>
        </div>

        {/* Live Locality Micro-Stats Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            background: 'rgba(12, 18, 36, 0.6)',
            padding: '12px 14px',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 22,
            textAlign: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Properties
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>4,950</strong>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Assigned Locality
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#10b981', fontFamily: 'var(--font-heading)' }}>Powai</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Powai Rent/Mo
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#ec4899', fontFamily: 'var(--font-heading)' }}>₹77.2L</strong>
          </div>
        </div>

        {/* Interactive Demo Persona Cards */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#cbd5e1',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span>Select Demo Persona</span>
            <span style={{ color: activePersona.theme, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: activePersona.theme }} />
              Instant 3D Sync
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {demoPersonas.map((persona) => {
              const isSelected = email === persona.email;
              return (
                <button
                  key={persona.code}
                  type="button"
                  onClick={() => setDemoAccount(persona)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 12,
                    textAlign: 'left',
                    background: isSelected
                      ? `linear-gradient(145deg, rgba(20, 30, 60, 0.9), rgba(10, 16, 36, 0.95))`
                      : 'rgba(15, 23, 42, 0.55)',
                    border: isSelected ? `2px solid ${persona.theme}` : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? `0 6px 20px ${persona.glow}` : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: isSelected ? persona.theme : '#e2e8f0' }}>
                      {persona.code}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: persona.theme,
                          boxShadow: `0 0 6px ${persona.theme}`,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.2 }}>
                    {persona.role}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: '0.85rem',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: 6,
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Portal Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 13,
                  color: '#94a3b8',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: 12,
                  background: 'rgba(10, 15, 30, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = activePersona.theme;
                  e.target.style.boxShadow = `0 0 16px ${activePersona.glow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: 6,
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Access Secret
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 13,
                  color: '#94a3b8',
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: 12,
                  background: 'rgba(10, 15, 30, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = activePersona.theme;
                  e.target.style.boxShadow = `0 0 16px ${activePersona.glow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Unified Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '13px 20px',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              background: `linear-gradient(135deg, ${activePersona.theme} 0%, #8b5cf6 60%, #ec4899 100%)`,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${activePersona.glow}`,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${activePersona.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${activePersona.glow}`;
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Enter Mumbai Command Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Security & Certificate Note */}
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: '0.74rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>OAuth2 Bearer token encryption • Live auto-refresh cycle</span>
        </div>
      </div>
    </div>
  );
};
