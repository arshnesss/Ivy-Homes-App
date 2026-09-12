import React, { useState } from 'react';
import { 
  Building2, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, 
  FileCheck, Percent, Calendar, HelpCircle, 
  ChevronDown, ChevronUp, Star, Sparkles
} from 'lucide-react';

export const LandingPage = ({ onGoToSignIn }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const scrollToSection = (id) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      q: 'How does Ivy homes work?',
      a: 'At Ivy Homes, we simplify home selling by becoming your direct buyer. There is no need to list your property, wait for the right buyer, or manage an uncertain sales process. Once you share your apartment details, our team schedules a consultation, reviews the condition, and presents a guaranteed cash offer based on live micro-market transaction data.'
    },
    {
      q: 'What types of properties do you buy?',
      a: 'We actively purchase residential apartments, flats, and gated community residences across major metro corridors including Mumbai and Bangalore, from 1 BHK starter homes to luxury 4+ BHK penthouses.'
    },
    {
      q: 'How do you determine my home’s value?',
      a: 'Our valuation engine uses live registration data from the sub-registrar office, current active portal listings, and verified historical transaction prices in your specific building and locality.'
    },
    {
      q: 'Will there be any deductions from the amount you offer?',
      a: 'Zero brokerage, zero hidden legal fees. The price we agree on in the Sale Agreement is the exact payout amount transferred directly to your bank account.'
    },
    {
      q: 'I have it listed with a broker. Can I still approach Ivy homes?',
      a: 'Yes! Even if your home is currently listed with an agent or broker, you can request an instant evaluation from Ivy Homes with zero exclusivity obligations.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#FFFFFF', color: '#0F172A', overflowX: 'hidden' }}>
      
      {/* 1. TOP NAVBAR (matching official ivy.homes header) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 32px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              ivy <span style={{ color: '#2563EB' }}>homes</span>
            </span>
          </div>

          {/* Nav items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a 
              href="#how-it-works" 
              onClick={scrollToSection('how-it-works')}
              style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              How it works
            </a>
            <a 
              href="#cost-of-waiting" 
              onClick={scrollToSection('cost-of-waiting')}
              style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              Cost of Waiting
            </a>
            <a 
              href="#faq" 
              onClick={scrollToSection('faq')}
              style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              FAQ
            </a>
            
            {/* Dedicated Top Right Sign In Button -> Navigates to 3D Sign In */}
            <button
              onClick={onGoToSignIn}
              style={{
                padding: '10px 22px',
                borderRadius: 20,
                background: '#2563EB',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION with Authentic Photo Banner */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 60px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            minHeight: 460,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
          }}
          onClick={onGoToSignIn}
          title="Click to Access Mumbai Property Portal"
        >
          {/* Real Photo Banner */}
          <img
            src="/ivy-hero.jpg"
            alt="Happy Homeowners with Ivy Homes"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
            }}
          />

          {/* Gradient Overlay for Crisp Text Readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.2) 100%)',
            }}
          />

          {/* Hero Content */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 640, padding: '48px 48px' }}>
            <h1
              style={{
                fontSize: '3.4rem',
                fontWeight: 900,
                lineHeight: 1.12,
                color: '#ffffff',
                letterSpacing: '-0.04em',
                marginBottom: 16,
              }}
            >
              Sell your home instantly with{' '}
              <span style={{ color: '#FDE047', fontStyle: 'italic' }}>
                expert support
              </span>
            </h1>

            <p style={{ fontSize: '1.18rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: 28 }}>
              Ivy homes buys your home directly and handles everything end to end. No broker fees, no open houses, guaranteed payout.
            </p>

            {/* Instant Action CTA */}
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onGoToSignIn(); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  borderRadius: 14,
                  background: '#2563EB',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <span>Access Mumbai Portal</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); scrollToSection('how-it-works')(e); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                }}
              >
                <span>Learn How It Works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Stats Strip (matching official site) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            padding: '36px 20px 24px',
            borderBottom: '1px solid #E2E8F0',
            textAlign: 'center',
          }}
        >
          <div>
            <strong style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', display: 'block', lineHeight: 1 }}>
              60 <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748B' }}>days</span>
            </strong>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Median Sell Time
            </span>
          </div>

          <div>
            <strong style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', display: 'block', lineHeight: 1 }}>
              850+ <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748B' }}>homes</span>
            </strong>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sold in Bangalore & Mumbai
            </span>
          </div>

          <div>
            <strong style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', display: 'block', lineHeight: 1 }}>
              ₹1000 <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748B' }}>Cr+</span>
            </strong>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              In Transactions
            </span>
          </div>
        </div>

        {/* Featured in News Logos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '24px 0', opacity: 0.8 }}>
          <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            In The News:
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>Inc42</span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>The Economic Times</span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>YourStory</span>
        </div>
      </section>

      {/* 3. SECTION: "Every month unsold is a cost you are absorbing" (Official Periwinkle Box) */}
      <section id="cost-of-waiting" style={{ background: '#F8FAFC', padding: '72px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              The Real Numbers
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginTop: 4 }}>
              Every month unsold is <span style={{ color: '#2563EB' }}>a cost you are absorbing.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', marginTop: 8 }}>
              Most sellers think time is free. Here is what waiting actually costs you for a typical ₹1.5 Cr home in Mumbai.
            </p>
          </div>

          {/* Soft Periwinkle Glass Box (from real Ivy Homes site) */}
          <div
            style={{
              background: '#EEF2FF',
              borderRadius: 24,
              border: '1px solid #C7D2FE',
              padding: '36px 40px',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ background: '#2563EB', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                ILLUSTRATION
              </span>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                Typical 2 BHK • 1,100 sqft in Mumbai Micro-Market
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 8px', borderBottom: '1px solid #E0E7FF' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>Maintenance charges</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>₹6,000 / mo × 12 months</span>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#1E1B4B' }}>₹72,000</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 8px', borderBottom: '1px solid #E0E7FF' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>Lost rental income</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>Unrealized rental potential while vacant</span>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#1E1B4B' }}>₹4,80,000</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 8px', borderBottom: '1px solid #E0E7FF' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>Brokerage on eventual sale</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>Typical 2% broker commission</span>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#1E1B4B' }}>₹2,25,000</strong>
            </div>

            {/* Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px 18px' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#1E1B4B' }}>Total estimated cost of waiting 1 year</strong>
                <span style={{ display: 'block', fontSize: '0.82rem', color: '#6366F1' }}>Maintenance + lost rent + brokerage, before price risk</span>
              </div>
              <strong style={{ fontSize: '2.4rem', color: '#2563EB', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                ₹7.8 L+
              </strong>
            </div>

            {/* Bottom 3 Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 18, borderTop: '1px solid #C7D2FE', textAlign: 'center' }}>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 12 }}>
                <strong style={{ fontSize: '1.4rem', color: '#059669', display: 'block' }}>₹0</strong>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>In Brokerage</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 12 }}>
                <strong style={{ fontSize: '1.4rem', color: '#059669', display: 'block' }}>₹0</strong>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Renovation Costs</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 12 }}>
                <strong style={{ fontSize: '1.4rem', color: '#2563EB', display: 'block' }}>60 Days</strong>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Days to Close</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: "From first call to final cheque" (The 3 Steps from original site) */}
      <section id="how-it-works" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            How It Works
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginTop: 6, marginBottom: 12 }}>
            From first call to <span style={{ color: '#2563EB' }}>final cheque.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B' }}>From your first offer to getting paid.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {/* Step 1 */}
          <div
            style={{
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              padding: '32px 28px',
              background: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Calendar size={32} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F172A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                  1
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: 8 }}>
                  In seconds
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
                Get an instant offer
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5 }}>
                Share your apartment name and flat number to see a preliminary offer backed by live market transaction data. No commitment needed.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              borderRadius: 20,
              border: '2px solid #2563EB',
              padding: '32px 28px',
              background: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0FDF4', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Building2 size={32} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                  2
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', background: '#F0FDF4', padding: '3px 8px', borderRadius: 8 }}>
                  Day 2
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
                Free home inspection
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5 }}>
                Our evaluation team visits at your convenience, reviews condition, and confirms the final fair valuation.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              padding: '32px 28px',
              background: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEF3C7', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <ShieldCheck size={32} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F172A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                  3
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', background: '#FFFBEB', padding: '3px 8px', borderRadius: 8 }}>
                  Within 14 days
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
                Close and get paid
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5 }}>
                Registration, legal coordination, and payment are all managed by Ivy. You show up, sign, and walk away with your cheque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 24,
            padding: '48px 36px',
            textAlign: 'center',
            border: '1px solid #BFDBFE',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ready to Begin?
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginTop: 6, marginBottom: 12 }}>
            Find out what your home is <span style={{ color: '#2563EB' }}>worth today.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
            Access our real-time Mumbai property intelligence database, transaction history, and 3D spatial analytics.
          </p>

          <button
            onClick={onGoToSignIn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 36px',
              borderRadius: 14,
              background: '#2563EB',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            <span>Sign In to Access Portal</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            FAQ
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginTop: 4, marginBottom: 8 }}>
            Questions we hear most often.
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B' }}>
            Selling a home raises a lot of questions. Here are honest answers to the ones we hear most.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isOpen ? '#2563EB' : '#0F172A' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={20} color="#2563EB" /> : <ChevronDown size={20} color="#64748B" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px', color: '#475569', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '40px 24px', textAlign: 'center', fontSize: '0.84rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
            Ivy Homes • Mumbai Real Estate Intelligence Portal
          </p>
          <p style={{ margin: 0 }}>
            Candidate assignment submission by Arsh Sharma (arsh@mnnit.ac.in) • All rights reserved © 2026 Ivy Homes
          </p>
        </div>
      </footer>

    </div>
  );
};
