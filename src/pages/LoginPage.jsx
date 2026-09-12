import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { City3DBackground } from '../components/City3DBackground';
import { KeyRound, Mail, Sparkles, ArrowRight, ShieldCheck, Building2, TrendingUp, Award } from 'lucide-react';

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
        background: 'radial-gradient(ellipse at center, #0e1726 0%, #070b14 100%)',
        padding: 20,
      }}
    >
      {/* 3D Animated Architectural City Skyline */}
      <City3DBackground />

      {/* Floating Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main Glassmorphism Login Container */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 460,
          width: '100%',
          padding: '40px 36px',
          borderRadius: 24,
          background: 'rgba(11, 17, 32, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #38bdf8 0%, #10b981 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
              marginBottom: 14,
            }}
          >
            <Sparkles size={28} />
          </div>

          <h1
            style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 6,
            }}
          >
            Ivy Homes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Mumbai Real Estate • Verified Live Portal
          </p>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: 22,
            textAlign: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Listings
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#38bdf8' }}>4,950</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Projects
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#10b981' }}>590</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Locality
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#f59e0b' }}>Powai</strong>
          </div>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '12px 14px',
            borderRadius: 12,
            marginBottom: 22,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Select Demo Account</span>
            <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>● One-Click Fill</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {['demo1@ivy.homes', 'demo2@ivy.homes', 'demo3@ivy.homes'].map((demo) => (
              <button
                key={demo}
                type="button"
                onClick={() => setDemoAccount(demo)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: email === demo ? 'linear-gradient(135deg, #38bdf8, #2563eb)' : 'rgba(15, 23, 42, 0.6)',
                  color: email === demo ? '#ffffff' : 'var(--text-main)',
                  border: email === demo ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: email === demo ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {demo.split('@')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: 12,
                borderRadius: 10,
                fontSize: '0.85rem',
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
                color: 'var(--text-muted)',
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
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 42px',
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
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
                color: 'var(--text-muted)',
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
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 42px',
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(56, 189, 248, 0.4)',
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Enter Mumbai Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Security / Verification Footnote */}
        <div
          style={{
            marginTop: 22,
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Real live authentication with auto session refresh</span>
        </div>
      </div>
    </div>
  );
};
