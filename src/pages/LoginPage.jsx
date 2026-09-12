import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: 440, width: '100%', padding: 36 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)', width: 48, height: 48, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 12 }}>
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 6 }}>Welcome to Ivy Homes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access verified property listings in Mumbai
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12, marginBottom: 24, border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
            Select Demo Account
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['demo1@ivy.homes', 'demo2@ivy.homes', 'demo3@ivy.homes'].map(demo => (
              <button
                key={demo}
                type="button"
                onClick={() => setDemoAccount(demo)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: email === demo ? 'var(--primary)' : 'var(--bg-dark)',
                  color: email === demo ? '#fff' : 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                {demo.split('@')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', padding: 12, borderRadius: 10, fontSize: '0.85rem', marginBottom: 18 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ShieldCheck size={14} color="var(--accent)" />
          <span>Real auth session against backend POST /auth/login</span>
        </div>

      </div>
    </div>
  );
};
