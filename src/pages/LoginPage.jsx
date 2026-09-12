import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { City3DBackground } from '../components/City3DBackground';
import { 
  KeyRound, Mail, ArrowRight, ShieldCheck, Zap, Terminal, Activity, 
  Sparkles, CheckCircle2, TrendingUp, DollarSign, Clock, FileCheck, 
  Percent, Calendar, HelpCircle, ChevronRight, Search
} from 'lucide-react';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('c7c1305e70');

  // Instant offer demo state
  const [apartmentQuery, setApartmentQuery] = useState('');
  const [instantOfferResult, setInstantOfferResult] = useState(null);

  const demoPersonas = [
    {
      email: 'demo1@ivy.homes',
      code: 'demo1',
      role: 'Portfolio Lead',
      theme: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.45)',
      desc: 'Acquisitions & Market Feeds',
    },
    {
      email: 'demo2@ivy.homes',
      code: 'demo2',
      role: 'Asset Analyst',
      theme: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.45)',
      desc: 'Valuation & Pricing Yields',
    },
    {
      email: 'demo3@ivy.homes',
      code: 'demo3',
      role: 'Data Auditor',
      theme: '#10b981',
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

  const handleInstantOffer = (e) => {
    e.preventDefault();
    const query = apartmentQuery.trim() || 'Hiranandani Gardens, Powai';
    setInstantOfferResult({
      property: query,
      estimatedOffer: '₹1.85 Cr – ₹2.10 Cr',
      daysToClose: '60 Days Guaranteed',
      brokerageSaved: '₹4,20,000 Saved (0% Brokerage)',
      status: 'Live Micro-market Valuation Ready',
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, #0d1326 0%, #060914 70%, #03050a 100%)',
        color: '#f8fafc',
      }}
    >
      {/* 3D Animated Vibrant City Skyline in Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, opacity: 0.85 }}>
        <City3DBackground activeTheme={activePersona.theme} />
      </div>

      {/* Subtle Mesh Ambient Glows */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '20%',
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${activePersona.glow} 0%, transparent 65%)`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Main Content Wrapper - Clean, Spacious, Uncluttered */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1360, margin: '0 auto', padding: '24px 24px 80px' }}>
        
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 28px',
            borderRadius: 18,
            background: 'rgba(10, 15, 30, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 48,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
              }}
            >
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Ivy Homes
              </span>
              <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em', display: 'block' }}>
                MUMBAI INTELLIGENCE & ACQUISITIONS
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>API: SOLVE.IVY.HOMES • LIVE</span>
            </div>
          </div>
        </header>

        {/* HERO SECTION: Authentic Ivy Homes Value Proposition + Command Deck Login */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 40,
            alignItems: 'center',
            marginBottom: 80,
          }}
        >
          {/* Left Column: Authentic Brand Message (7 Cols) */}
          <div style={{ gridColumn: 'span 7' }}>
            
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 24,
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              <CheckCircle2 size={14} color="#38bdf8" />
              <span>1,500+ Homeowners have trusted Ivy Homes</span>
            </div>

            {/* Headline matching actual site */}
            <h1
              style={{
                fontSize: '3.4rem',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '-0.04em',
                marginBottom: 18,
              }}
            >
              Sell your home instantly with{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                expert support
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: 620,
                marginBottom: 28,
              }}
            >
              Ivy Homes buys your home directly and handles everything end-to-end. No waiting, no unpredictable broker haggling, and guaranteed micro-market valuations.
            </p>

            {/* Instant Offer Search Bar (from real Ivy Homes hero) */}
            <form
              onSubmit={handleInstantOffer}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 16,
                padding: '8px 10px 8px 18px',
                maxWidth: 600,
                marginBottom: 20,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Search size={20} color="#94a3b8" style={{ marginRight: 12, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Apartment name & flat number (e.g. Hiranandani, Powai)..."
                value={apartmentQuery}
                onChange={(e) => setApartmentQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.98rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <span>Get instant offer</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Instant Offer Preview Popup if tested */}
            {instantOfferResult && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  maxWidth: 600,
                  padding: 16,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                    {instantOfferResult.status}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                    {instantOfferResult.estimatedOffer}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {instantOfferResult.brokerageSaved} • {instantOfferResult.daysToClose}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInstantOfferResult(null)}
                  style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '4px 8px' }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Trust Metrics Bar (matching real Ivy Homes homepage) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
                maxWidth: 600,
                padding: '18px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: 24,
              }}
            >
              <div>
                <strong style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-heading)', display: 'block', lineHeight: 1 }}>
                  60 days
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Median Sell Time
                </span>
              </div>

              <div>
                <strong style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-heading)', display: 'block', lineHeight: 1 }}>
                  850+ homes
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sold in Metros
                </span>
              </div>

              <div>
                <strong style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ec4899', fontFamily: 'var(--font-heading)', display: 'block', lineHeight: 1 }}>
                  ₹1000 Cr+
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  In Transactions
                </span>
              </div>
            </div>

            {/* In The News Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Featured In:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: 0.75, fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
                <span>Inc42</span>
                <span>The Economic Times</span>
                <span>YourStory</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Executive Intelligence Access Deck (5 Cols) */}
          <div style={{ gridColumn: 'span 5' }}>
            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: '36px 32px',
                borderRadius: 24,
                background: 'rgba(8, 14, 28, 0.75)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: `0 24px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px ${activePersona.glow}`,
                transition: 'box-shadow 0.4s ease',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: activePersona.theme,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Verified Credentials Deck
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                  Portal Sign In
                </h2>
              </div>

              {/* Demo Persona Quick Select */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Choose Demo Role
                  </span>
                  <span style={{ fontSize: '0.68rem', color: activePersona.theme, fontWeight: 700 }}>
                    Instant Fill
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
                          padding: '8px 6px',
                          borderRadius: 10,
                          textAlign: 'center',
                          background: isSelected
                            ? `linear-gradient(145deg, rgba(20, 30, 60, 0.9), rgba(10, 16, 36, 0.95))`
                            : 'rgba(15, 23, 42, 0.6)',
                          border: isSelected ? `2px solid ${persona.theme}` : '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: isSelected ? `0 4px 16px ${persona.glow}` : 'none',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? persona.theme : '#e2e8f0' }}>
                          {persona.code}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2 }}>
                          {persona.role}
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
                      color: '#fca5a5',
                      padding: '10px 14px',
                      borderRadius: 10,
                      fontSize: '0.82rem',
                      marginBottom: 14,
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Portal Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: 12, color: '#94a3b8' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        borderRadius: 10,
                        background: 'rgba(10, 15, 30, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: 14, top: 12, color: '#94a3b8' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        borderRadius: 10,
                        background: 'rgba(10, 15, 30, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
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
                    padding: '13px 20px',
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${activePersona.theme} 0%, #8b5cf6 60%, #ec4899 100%)`,
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    boxShadow: `0 8px 24px ${activePersona.glow}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{loading ? 'Authenticating...' : 'Enter Mumbai Command Portal'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              <div style={{ marginTop: 18, textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                Secured live session • OAuth2 Bearer token with auto-refresh
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE REAL NUMBERS — "Every month unsold is a cost you are absorbing" */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              The Real Numbers
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginTop: 6, marginBottom: 10 }}>
              Every month unsold is <span style={{ color: '#ec4899' }}>a cost you are absorbing.</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
              Most sellers think about price. Few count what waiting actually costs. Here is what one year on the open market looks like for a typical 2 BHK in Mumbai.
            </p>
          </div>

          {/* Detailed Financial Comparison Card (from the owner's homepage) */}
          <div
            className="glass-panel"
            style={{
              maxWidth: 900,
              margin: '0 auto',
              borderRadius: 24,
              overflow: 'hidden',
              background: 'rgba(12, 18, 36, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ padding: '28px 36px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                  ILLUSTRATION
                </span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>2 BHK • 1,461 sqft • ₹1.08 Cr market value</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0' }}>
                The hidden cost of waiting 1 year
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                These are the actual carrying costs a seller absorbs while waiting for the right buyer to show up.
              </p>
            </div>

            {/* Carrying Cost Line Items */}
            <div style={{ padding: '24px 36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#e2e8f0', display: 'block' }}>Maintenance charges</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>₹9/sqft × 1,461 sqft × 12 months</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontFamily: 'monospace' }}>₹1,57,788</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#e2e8f0', display: 'block' }}>Lost rental income</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>₹40,000/month × 12 months</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontFamily: 'monospace' }}>₹4,80,000</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#e2e8f0', display: 'block' }}>Broker fee on eventual sale</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>2% of ₹1.08 Cr</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontFamily: 'monospace' }}>₹2,16,000</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#e2e8f0', display: 'block' }}>Price risk & market softens</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Market can soften, buyers negotiate down</span>
                </div>
                <strong style={{ fontSize: '0.95rem', color: '#f59e0b' }}>Uncertain</strong>
              </div>

              {/* Total Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 10px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>Total estimated cost of waiting 1 year</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Maintenance + lost rent + brokerage, before price risk</span>
                </div>
                <strong style={{ fontSize: '2rem', color: '#ec4899', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  ₹7.8 L+
                </strong>
              </div>
            </div>

            {/* Bottom 3 Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                padding: '20px 36px',
                background: 'rgba(8, 12, 24, 0.8)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: '1.4rem', color: '#10b981', display: 'block', fontFamily: 'var(--font-heading)' }}>₹0</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>In Brokerage</span>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <strong style={{ fontSize: '1.4rem', color: '#10b981', display: 'block', fontFamily: 'var(--font-heading)' }}>₹0</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Renovation Costs</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.4rem', color: '#38bdf8', display: 'block', fontFamily: 'var(--font-heading)' }}>60 Days</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Days to Close</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: "Faster. Fairer. Fully taken care of." (The 5 Brand Pillars) */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Our Promise
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginTop: 6, marginBottom: 10 }}>
              Faster. Fairer. <span style={{ color: '#38bdf8' }}>Fully taken care of.</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
              A fair offer, honoured to the rupee, with everything in between handled for you.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              maxWidth: 1100,
              margin: '0 auto',
            }}
          >
            <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(10, 16, 32, 0.65)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <ShieldCheck size={22} color="#38bdf8" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>We commit. No backing out.</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Once we make an offer, we stand by it. No last-minute re-negotiations or reneging.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(10, 16, 32, 0.65)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <TrendingUp size={22} color="#10b981" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Fair and transparent pricing</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Backed by real transactions, live listings, and micro-market intelligence across Mumbai.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(10, 16, 32, 0.65)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <FileCheck size={22} color="#ec4899" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Just show up to sign</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Legal, paperwork & registration, all handled by our in-house property attorneys.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(10, 16, 32, 0.65)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Percent size={22} color="#f59e0b" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Zero brokerage</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                No commission, no hidden charges. The valuation you accept is the exact payout you receive.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(10, 16, 32, 0.65)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Calendar size={22} color="#8b5cf6" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Your sale, your terms</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Pick a payout structure and closing date that fits your personal moving timeline.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
