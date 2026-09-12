import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { City3DBackground } from '../components/City3DBackground';
import { 
  Building2, ArrowRight, ArrowLeft, ShieldCheck, Check, 
  KeyRound, Mail, Sparkles 
} from 'lucide-react';

export const SignInPage = ({ onBack }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('c7c1305e70');

  const demoAccounts = [
    { email: 'demo1@ivy.homes', label: 'demo1', role: 'Portfolio Lead', desc: 'Sale & Rental Acquisitions' },
    { email: 'demo2@ivy.homes', label: 'demo2', role: 'Asset Analyst', desc: 'Valuation & Pricing Yields' },
    { email: 'demo3@ivy.homes', label: 'demo3', role: 'Data Auditor', desc: 'Matrix & Fraud Forensics' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.hash = '#/listings';
    } catch (err) {
      console.error('Login submit error:', err);
    }
  };

  const handleSelectDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('c7c1305e70');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden', background: '#070B14' }}>
      
      {/* 3D Three.js Interactive Architectural City Animation in Background */}
      <City3DBackground />

      {/* Ambient Gradient Overlays for Cinematic Depth */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.45) 0%, rgba(7, 11, 20, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top Bar with Back Button */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <button
          onClick={onBack || (() => { window.location.hash = '#/home'; })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 14,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#F8FAFC',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Ivy Homes</span>
        </button>

        {/* Brand Pill */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 20,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94A3B8',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <Sparkles size={14} color="#38BDF8" />
          <span>Mumbai Micro-Market Intelligence Engine</span>
        </div>
      </div>

      {/* Centered Glassmorphic Login Console */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 520,
            background: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '40px 38px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              }}
            >
              <Building2 size={26} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: 6 }}>
              ivy <span style={{ color: '#60A5FA' }}>homes</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
              Sign in to explore verified properties & analytics
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                One-Click Demo Roles:
              </span>
              <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={12} /> Auto-Fills
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {demoAccounts.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectDemo(acc.email)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 12,
                      textAlign: 'left',
                      background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(30, 41, 59, 0.5)',
                      border: isSelected ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#60A5FA' : '#F8FAFC' }}>
                      {acc.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#93C5FD' : '#64748B', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acc.role}
                    </div>
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
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  marginBottom: 18,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 16, top: 14, color: '#64748B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: 16, top: 14, color: '#64748B' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.45)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <span>{loading ? 'Authenticating...' : 'Enter Mumbai Property Portal'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 22, textAlign: 'center', fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Connected to solve.ivy.homes • Key: IVY26-AC068556E03E</span>
          </div>
        </div>
      </div>

    </div>
  );
};
