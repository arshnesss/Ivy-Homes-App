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
    { email: 'demo1@ivy.homes', label: 'demo1', role: 'Portfolio Lead' },
    { email: 'demo2@ivy.homes', label: 'demo2', role: 'Asset Analyst' },
    { email: 'demo3@ivy.homes', label: 'demo3', role: 'Data Auditor' },
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
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden', background: '#0e1320' }}>
      
      {/* 1. Aesthetic Architectural 3D City Skyline in Background */}
      <City3DBackground />

      {/* 2. Top Header Navigation */}
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
            padding: '10px 20px',
            borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            color: '#0F172A',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = '#ffffff';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
          }}
        >
          <ArrowLeft size={16} color="#2563EB" />
          <span>Back to Ivy Homes</span>
        </button>

        {/* Brand Pill */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            color: '#1E293B',
            fontSize: '0.84rem',
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
          }}
        >
          <Sparkles size={15} color="#2563EB" />
          <span>Mumbai Micro-Market Intelligence Engine</span>
        </div>
      </div>

      {/* 3. Centered Light Mode Aesthetic Login Card */}
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
            maxWidth: 460,
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: 24,
            border: '1px solid rgba(255, 255, 255, 0.7)',
            padding: '38px 36px',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.6)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
              }}
            >
              <Building2 size={24} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 4 }}>
              ivy <span style={{ color: '#2563EB' }}>homes</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
              Sign in to explore verified properties & analytics
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                One-Click Demo Roles:
              </span>
              <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={13} /> Auto-Fills
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
                      padding: '12px 6px',
                      borderRadius: 12,
                      textAlign: 'center',
                      background: isSelected ? '#EFF6FF' : '#F8FAFC',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 10px rgba(37, 99, 235, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#2563EB' : '#0F172A' }}>
                      {acc.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#1D4ED8' : '#64748B', fontWeight: 600, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>
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
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>
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
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; }}
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
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.5)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Enter Mumbai Property Portal'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 22, textAlign: 'center', fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600 }}>
            <ShieldCheck size={15} color="#16A34A" />
            <span>Connected to solve.ivy.homes • Key: IVY26-AC068556E03E</span>
          </div>
        </div>
      </div>

    </div>
  );
};
export default SignInPage;
