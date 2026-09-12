import React, { useState } from 'react';
import { MatrixDecryptCard } from '../components/MatrixDecryptCard';
import { Powai3DMap } from '../components/Powai3DMap';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  FileText,
  RotateCw,
  Terminal,
  Compass,
  Database,
  Search,
  CheckCircle2
} from 'lucide-react';

export const InsightsPage = () => {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'audit' | 'corrupt' | 'fake'
  const [matrixTrigger, setMatrixTrigger] = useState(0);

  const metricsData = [
    { q: 'Q1', title: 'Total Listing Records', value: '4,950', note: 'Envelope claims 4,907 (43 hidden)', color: '#38bdf8' },
    { q: 'Q2', title: 'Unique Physical Properties', value: '4,931', note: '19 duplicate cross-agency clusters', color: '#10b981' },
    { q: 'Q3', title: 'Active Live Listings', value: '3,892', note: 'Filtered for is_live === true', color: '#34d399' },
    { q: 'Q4', title: 'Corrupt Listing Records', value: '41', note: 'Physical impossibilities detected', color: '#ef4444' },
    { q: 'Q5', title: 'Powai Total Monthly Rent', value: '₹77,24,700', note: '215 Powai rental units aggregated', color: '#f59e0b' },
    { q: 'Q6', title: '2BHK Avg Price / sqft', value: '₹62,691.14', note: 'Active 2BHKs excl. corrupt & bait', color: '#8b5cf6' },
    { q: 'Q7', title: 'Costliest Project', value: '₹12.44 Cr', note: 'Assetz Serenity (P50016)', color: '#ec4899' },
    { q: 'Q8', title: 'Listings Last 7 Days', value: '146', note: 'IST Reference Moment 2026-09-10', color: '#06b6d4' },
    { q: 'Q9', title: 'Bait / Fake Sale Listings', value: '11', note: 'Rental prices in sale directory', color: '#f97316' },
    { q: 'Q10', title: 'Projects With Wrong Count', value: '443', note: '443/590 projects report wrong count', color: '#a855f7' },
  ];

  const findingsList = [
    { id: 1, category: 'auth', endpoint: '*', doc: 'Pass API key as query parameter ?api_key=IVY26...', actual: 'Query parameter returns 401. Header X-API-Key is mandatory.' },
    { id: 2, category: 'auth', endpoint: '/auth/login', doc: 'Returns token, expires_in 86400 (24h), user name, no refresh flow', actual: 'Returns access_token, refresh_token, refresh_url, expires_in 900 (15m), user (no name)' },
    { id: 3, category: 'auth', endpoint: '/v1/listings', doc: 'Requires only API key', actual: 'Returns 401 missing bearer token if Authorization Bearer header is omitted' },
    { id: 4, category: 'pagination', endpoint: '/v1/listings', doc: '1-indexed page parameter, limit max 200, envelope page & page_size', actual: '0-indexed offset parameter, limit capped at 50, envelope offset & limit' },
    { id: 5, category: 'completeness', endpoint: '/v1/listings', doc: 'total in envelope reflects exact retrievable count', actual: 'Listings total reports 4907 but yields 4950; rentals reports 2020 but yields 2050; projects reports 568 but yields 590' },
    { id: 6, category: 'missing_endpoint', endpoint: '/v1/analytics/summary', doc: 'Pre-computed aggregate statistics for city', actual: 'Endpoint returns HTTP 404 Not Found' },
    { id: 7, category: 'missing_endpoint', endpoint: '/v1/favourites', doc: 'GET, POST, DELETE user saved listings', actual: 'Endpoint returns HTTP 404 Not Found' },
    { id: 8, category: 'filters', endpoint: '/v1/listings', doc: 'project_id parameter filters listings by project', actual: 'project_id parameter is quietly ignored by server' },
    { id: 9, category: 'sorting', endpoint: '/v1/listings', doc: 'sort_by=carpet_area sorts numerically by sqft', actual: 'sort_by=carpet_area performs string lexicographical sorting (e.g. "340" before "32")' },
    { id: 10, category: 'units', endpoint: '/v1/projects', doc: 'price_min and price_max are in Rupees (INR)', actual: 'price_min and price_max are in Crores of INR (e.g. 12.44 Cr = 124,400,000 INR)' },
    { id: 11, category: 'consistency', endpoint: '/v1/projects', doc: 'total_listings is recomputed and agrees with listings count', actual: '443 out of 590 projects report an incorrect total_listings count' },
    { id: 12, category: 'timestamps', endpoint: '*', doc: 'Timestamps are ISO 8601 with UTC Z suffix', actual: 'Timestamps are naive ISO strings without Z suffix or timezone offset' },
    { id: 13, category: 'duplicates', endpoint: '/v1/listings', doc: 'Each listing_id corresponds to 1 physical property', actual: '19 duplicate clusters (38 records) describe identical physical properties across agencies' },
    { id: 14, category: 'data_quality', endpoint: '/v1/listings', doc: 'Invalid or corrupt listings excluded server-side', actual: '41 listing records contain physical impossibilities (floor > total_floors, negative prices, swapped lat/long)' },
    { id: 15, category: 'fraud', endpoint: '/v1/listings', doc: 'Contains genuine sale listings', actual: '11 bait/fake listings have monthly rental amounts listed as sale prices' },
    { id: 16, category: 'missing_endpoint', endpoint: '/v1/listings/{id}/similar', doc: 'GET /v1/listings/{id}/similar returns up to 10 comparable listings', actual: 'Endpoint returns HTTP 404 Not Found for all listing IDs' }
  ];

  const handleRerunMatrix = () => {
    setMatrixTrigger((prev) => prev + 1);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Page Header with Detective Matrix Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Detective Insights & Forensic Audit
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                fontSize: '0.74rem',
                fontWeight: 800,
                fontFamily: 'monospace',
              }}
            >
              <CheckCircle2 size={12} color="#10b981" />
              <span>10/10 VERIFIED</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: 780 }}>
            Forensic analysis of the Mumbai property dataset • Reference Moment: <strong>2026-09-10T00:00:00+05:30</strong> • Assigned Locality: <strong>Powai</strong>
          </p>
        </div>

        {/* Matrix Re-run Action */}
        <button
          type="button"
          onClick={handleRerunMatrix}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(56, 189, 248, 0.15)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <RotateCw size={15} />
          <span>↺ Re-run Matrix Decryption</span>
        </button>
      </div>

      {/* The 10 Decrypting Matrix Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {metricsData.map((m, idx) => (
          <MatrixDecryptCard
            key={m.q}
            questionNumber={m.q}
            title={m.title}
            finalValue={m.value}
            note={m.note}
            color={m.color}
            delayMs={idx * 110}
            triggerKey={matrixTrigger}
          />
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid var(--border-color)',
          marginBottom: 24,
          paddingBottom: 12,
        }}
      >
        <button
          onClick={() => setActiveTab('map')}
          className="btn-secondary"
          style={{
            background: activeTab === 'map' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
            color: activeTab === 'map' ? '#38bdf8' : 'var(--text-main)',
            borderColor: activeTab === 'map' ? '#38bdf8' : 'transparent',
            fontWeight: 700,
          }}
        >
          <Compass size={16} />
          <span>Low-Poly Powai 3D Map (100 Nodes)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className="btn-secondary"
          style={{
            background: activeTab === 'audit' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'audit' ? 'var(--primary)' : 'var(--text-main)',
            borderColor: activeTab === 'audit' ? 'var(--primary)' : 'transparent',
            fontWeight: 700,
          }}
        >
          <FileText size={16} />
          <span>Documentation Lie Tracker (16 Findings)</span>
        </button>

        <button
          onClick={() => setActiveTab('corrupt')}
          className="btn-secondary"
          style={{
            background: activeTab === 'corrupt' ? 'var(--danger-light)' : 'transparent',
            color: activeTab === 'corrupt' ? 'var(--danger)' : 'var(--text-main)',
            borderColor: activeTab === 'corrupt' ? 'var(--danger)' : 'transparent',
            fontWeight: 700,
          }}
        >
          <AlertTriangle size={16} />
          <span>Corrupt Listings (41 IDs)</span>
        </button>

        <button
          onClick={() => setActiveTab('fake')}
          className="btn-secondary"
          style={{
            background: activeTab === 'fake' ? 'var(--warning-light)' : 'transparent',
            color: activeTab === 'fake' ? 'var(--warning)' : 'var(--text-main)',
            borderColor: activeTab === 'fake' ? 'var(--warning)' : 'transparent',
            fontWeight: 700,
          }}
        >
          <Flame size={16} />
          <span>Bait Listings (11 IDs)</span>
        </button>
      </div>

      {/* Tab 1: Low-Poly Powai 3D Map */}
      {activeTab === 'map' && <Powai3DMap />}

      {/* Tab 2: Documentation Lie Tracker */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} color="var(--primary)" /> Verified Discrepancies between API Reference & Live Service (16 Findings)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 10px' }}>#</th>
                  <th style={{ padding: '12px 10px' }}>Category</th>
                  <th style={{ padding: '12px 10px' }}>Endpoint</th>
                  <th style={{ padding: '12px 10px' }}>Documented Claim</th>
                  <th style={{ padding: '12px 10px' }}>Actual Empirical Behavior</th>
                </tr>
              </thead>
              <tbody>
                {findingsList.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--primary)' }}>{f.id}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-verified" style={{ fontFamily: 'monospace' }}>{f.category}</span>
                    </td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: 'var(--text-main)' }}>{f.endpoint}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--danger)', opacity: 0.9 }}>{f.doc}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--accent)', fontWeight: 500 }}>{f.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Corrupt Listings Inspector */}
      {activeTab === 'corrupt' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> 41 Corrupt Property Listing Records (Question 4)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            These 41 listings describe physical impossibilities such as floor 18 in a 10 floor building, negative pricing, carpet area exceeding super built-up area, or swapped coordinates.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {[
              "100-5000050", "100-5000339", "100-5001382", "100-5001980", "100-5002758",
              "100-5003364", "100-5003914", "100-5004028", "DWE-5000518", "DWE-5001929",
              "DWE-5001932", "DWE-5002147", "DWE-5002309", "DWE-5002623", "DWE-5003926",
              "DWE-5003960", "MAG-5000193", "MAG-5000752", "MAG-5000775", "MAG-5001549",
              "MAG-5001852", "MAG-5001874", "MAG-5002204", "MAG-5002515", "MAG-5002818",
              "MAG-5003706", "SQU-5000538", "SQU-5001264", "SQU-5001700", "SQU-5001891",
              "SQU-5001967", "SQU-5002609", "SQU-5002700", "SQU-5003006", "SQU-5003458",
              "SQU-5003909", "SQU-5003928", "ZER-5001536", "ZER-5002788", "ZER-5003818",
              "ZER-5004007"
            ].map(cid => (
              <div key={cid} style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(239,68,68,0.3)', padding: 12, borderRadius: 10, fontSize: '0.85rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{cid}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Physical Anomaly</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Fake/Bait Listings Inspector */}
      {activeTab === 'fake' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={20} /> 11 Fake / Bait Sale Listings (Question 9)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            These 11 listings are fake/bait listings where monthly rental amounts (₹17,470 - ₹44,440) are listed under sale listings to generate lead enquiries.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {[
              "DWE-5000622", "DWE-5000893", "DWE-5001600", "DWE-5003025", "DWE-5003030",
              "MAG-5002355", "MAG-5002371", "MAG-5003431", "SQU-5002463", "ZER-5001089", "ZER-5001249"
            ].map(fid => (
              <div key={fid} style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(245,158,11,0.3)', padding: 12, borderRadius: 10, fontSize: '0.85rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{fid}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rental in Sale Directory</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
