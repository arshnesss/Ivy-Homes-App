import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { City3DBackground } from '../components/City3DBackground';
import { KeyRound, Mail, Sparkles, ArrowRight, ShieldCheck, Building2, Flame, Compass, Zap } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('c7c1305e70');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login submit error:', err);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('c7c1305e70');
  };

  const demoAccounts = [
    { email: 'demo1@ivy.homes', label: 'demo1', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
    { email: 'demo2@ivy.homes', label: 'demo2', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
    { email: 'demo3@ivy.homes', label: 'demo3', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  ];

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
        background: 'radial-gradient(ellipse at 50% 40%, #15112e 0%, #080a14 70%, #04050a 100%)',
        padding: 20,
      }}
    >
      {/* 3D Animated Vibrant City Skyline */}
      <City3DBackground />

      {/* Atmospheric Multi-Colored Glow Blooms */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '18%',
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 65%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          right: '18%',
          width: 460,
          height: 460,
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '30%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Translucent Iridescent Glassmorphic Login Card */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 480,
          width: '100%',
          padding: '42px 38px',
          borderRadius: 28,
          background: 'linear-gradient(145deg, rgba(20, 24, 45, 0.72) 0%, rgba(30, 20, 50, 0.65) 50%, rgba(12, 18, 36, 0.78) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Top Floating Badge */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(236, 72, 153, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            <Zap size={13} color="#f59e0b" />
            <span>Interactive 3D Metropolis</span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #ffffff 10%, #38bdf8 55%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}
          >
            Ivy Homes
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.94rem', fontWeight: 500 }}>
            Mumbai Real Estate • Verified Portal & Analytics
          </p>
        </div>

        {/* Live Metrics Grid with Colorful Accents */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            background: 'rgba(10, 14, 28, 0.55)',
            padding: '12px 14px',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Properties
            </span>
            <strong style={{ fontSize: '1rem', color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>4,950</strong>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Projects
            </span>
            <strong style={{ fontSize: '1rem', color: '#ec4899', fontFamily: 'var(--font-heading)' }}>590</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Locality
            </span>
            <strong style={{ fontSize: '1rem', color: '#10b981', fontFamily: 'var(--font-heading)' }}>Powai</strong>
          </div>
        </div>

        {/* Demo Accounts Quick-Select with Glowing Colors */}
        <div
          style={{
            background: 'rgba(20, 27, 48, 0.45)',
            padding: '14px',
            borderRadius: 14,
            marginBottom: 24,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#cbd5e1',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <span>Choose Demo Account</span>
            <span style={{ color: '#10b981', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              Auto Fill
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {demoAccounts.map((acc) => {
              const active = email === acc.email;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => setDemoAccount(acc.email)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: active
                      ? `linear-gradient(135deg, ${acc.color}, #6366f1)`
                      : 'rgba(15, 23, 42, 0.65)',
                    color: '#ffffff',
                    border: active ? `1px solid ${acc.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: active ? `0 4px 16px ${acc.glow}` : 'none',
                    transform: active ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {acc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: 12,
                borderRadius: 12,
                fontSize: '0.88rem',
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.76rem',
                fontWeight: 700,
                marginBottom: 6,
                color: '#94a3b8',
                letterSpacing: '0.04em',
              }}
            >
              ACCOUNT EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
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
                  padding: '12px 14px 12px 42px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.94rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.76rem',
                fontWeight: 700,
                marginBottom: 6,
                color: '#94a3b8',
                letterSpacing: '0.04em',
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={18}
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
                  padding: '12px 14px 12px 42px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.94rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 15px rgba(236, 72, 153, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Glowing Animated Gradient Enter Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '14px 22px',
              fontSize: '1.02rem',
              fontWeight: 800,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 50%, #ec4899 100%)',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.45)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.45)';
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Enter Mumbai Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Live Authentication Footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ShieldCheck size={15} color="#10b981" />
          <span>Secured live API connection with auto token refresh</span>
        </div>
      </div>
    </div>
  );
};
