import React, { useState } from 'react';
import { Powai3DMap } from '../components/Powai3DMap';
import {
  FileText,
  AlertTriangle,
  Flame,
  Compass,
  CheckCircle2,
  HelpCircle,
  Clock,
  Building,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Search
} from 'lucide-react';

export const InsightsPage = () => {
  const [activeTab, setActiveTab] = useState('answers'); // 'answers' | 'map' | 'audit' | 'corrupt' | 'fake'

  const questionsReport = [
    {
      num: 'Question 1',
      title: 'Total Listing Records Retrievable',
      answer: '4,950 Records',
      summary: 'API envelope header claims total: 4,907, but full pagination retrievable count is 4,950.',
      methodology: 'By exhaustively paginating through offset parameter (0 to 4900, limit 50), the API delivers records past 4,907 up to offset 4900 (limit 50), yielding exactly 4,950 valid JSON listing items. The envelope total is inaccurate by 43 records.'
    },
    {
      num: 'Question 2',
      title: 'Unique Physical Properties (Deduplicated)',
      answer: '4,931 Properties',
      summary: '19 cross-broker duplicate clusters (38 records) describe identical physical units.',
      methodology: 'Grouped by normalized tuple (apartment_name, locality, carpet_area, floor). Across major portals (99acres, housing, magicbricks, nobroker, squareyards), 38 records represent identical physical apartments listed by competing brokers. Subtracting the 19 redundant duplicates yields 4,931 unique physical residences.'
    },
    {
      num: 'Question 3',
      title: 'Active Live Listings',
      answer: '3,892 Listings',
      summary: 'Calculated by strictly filtering for is_live === true across all records.',
      methodology: 'Out of 4,950 retrievable records, 3,892 have is_live = true, while 1,058 listings are inactive, de-listed, or archived.'
    },
    {
      num: 'Question 4',
      title: 'Corrupt Listing Records',
      answer: '41 Listing IDs',
      summary: 'Identified records containing physical impossibilities and data corruption.',
      methodology: 'Identified 41 records with severe data defects: (1) Floor number greater than total building floors (e.g. Floor 18 of 10), (2) Negative sale prices (e.g. -₹6.46 Cr), (3) Carpet area exceeding super built-up area, and (4) Swapped latitude and longitude (lat > 70°, lng < 25°). All 41 sorted IDs are documented in submission.json.'
    },
    {
      num: 'Question 5',
      title: 'Total Monthly Rent in Assigned Locality (Powai)',
      answer: '₹77,24,700 / month',
      summary: 'Aggregated monthly rental yield across all 215 verified rental properties in Powai.',
      methodology: 'Paginating the entire rental collection (2,050 records) and filtering strictly for assigned locality "powai" (case-insensitive) yields exactly 215 rental units. Summing their monthly rental amounts yields exactly ₹77,24,700.'
    },
    {
      num: 'Question 6',
      title: 'Average Price per Sq Ft for 2BHKs',
      answer: '₹62,691.14 / sqft',
      summary: 'Calculated across active 2BHK sale listings excluding corrupt and bait records.',
      methodology: 'Filtered for bedroom == 2, is_live == true, carpet_area > 0, price > 0, excluding the 41 corrupt and 11 bait listings. Computed sum(price / carpet_area) / N, yielding ₹62,691.14 per sqft.'
    },
    {
      num: 'Question 7',
      title: 'Costliest Project by Maximum Price',
      answer: 'Assetz Serenity (P50016) — ₹12.44 Cr',
      summary: 'Project price_min and price_max are denominated in Crores, not Rupees.',
      methodology: 'In /v1/projects, price_max represents Crores of INR (discrepancy with API reference claiming raw Rupees). Assetz Serenity has price_max = 12.44, representing ₹12.44 Crores (124,400,000 INR), making it the costliest project.'
    },
    {
      num: 'Question 8',
      title: 'Listings Posted in the Last 7 Days',
      answer: '146 Listings',
      summary: 'Anchored strictly to reference moment 2026-09-10T00:00:00+05:30 (IST).',
      methodology: 'Normalized ISO naive timestamps to IST (+05:30). Filtered records with posted_at in the 7-day interval [2026-09-03T00:00:00+05:30, 2026-09-10T00:00:00+05:30). Exactly 146 listings fall within this window.'
    },
    {
      num: 'Question 9',
      title: 'Bait / Fake Sale Listings',
      answer: '11 Listing IDs',
      summary: 'Monthly rental rates (₹17k - ₹44k) fraudulently listed as property sale prices.',
      methodology: 'Isolated 11 sale records with prices between ₹17,470 and ₹44,440. These are monthly rental figures entered under sale listings to fabricate low-price search rankings. All 11 IDs are documented in submission.json.'
    },
    {
      num: 'Question 10',
      title: 'Projects with Discrepant Listing Counts',
      answer: '443 Projects',
      summary: '443 out of 590 projects report a total_listings figure that mismatches actual listings.',
      methodology: 'Compared reported total_listings in /v1/projects against the actual count of listings bearing each project_id in /v1/listings. 443 projects show discrepancies between reported and actual counts.'
    }
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

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1360, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Data Insights & Forensic Audit
          </h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 14,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              fontSize: '0.74rem',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={13} />
            <span>10/10 Verified</span>
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
          Calculated answers for all 10 assignment questions, Powai assigned locality analysis, and documentation discrepancies
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid var(--border-color)',
          marginBottom: 28,
          paddingBottom: 12,
        }}
      >
        <button
          onClick={() => setActiveTab('answers')}
          className="btn-secondary"
          style={{
            background: activeTab === 'answers' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'answers' ? 'var(--primary)' : 'var(--text-main)',
            borderColor: activeTab === 'answers' ? 'var(--primary)' : 'transparent',
            fontWeight: 600,
          }}
        >
          <FileText size={16} />
          <span>The 10 Questions & Answers</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className="btn-secondary"
          style={{
            background: activeTab === 'map' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: activeTab === 'map' ? '#38bdf8' : 'var(--text-main)',
            borderColor: activeTab === 'map' ? '#38bdf8' : 'transparent',
            fontWeight: 600,
          }}
        >
          <Compass size={16} />
          <span>Powai 3D Locality Map</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className="btn-secondary"
          style={{
            background: activeTab === 'audit' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'audit' ? 'var(--primary)' : 'var(--text-main)',
            borderColor: activeTab === 'audit' ? 'var(--primary)' : 'transparent',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={16} />
          <span>API Documentation Discrepancies (16)</span>
        </button>

        <button
          onClick={() => setActiveTab('corrupt')}
          className="btn-secondary"
          style={{
            background: activeTab === 'corrupt' ? 'var(--danger-light)' : 'transparent',
            color: activeTab === 'corrupt' ? 'var(--danger)' : 'var(--text-main)',
            borderColor: activeTab === 'corrupt' ? 'var(--danger)' : 'transparent',
            fontWeight: 600,
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
            fontWeight: 600,
          }}
        >
          <Flame size={16} />
          <span>Bait Listings (11 IDs)</span>
        </button>
      </div>

      {/* Tab 1: Comprehensive 10 Questions & Answers Report */}
      {activeTab === 'answers' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
            {questionsReport.map((q) => (
              <div
                key={q.num}
                className="glass-panel"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}
                    >
                      {q.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {q.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '1.55rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-heading)',
                      marginBottom: 10,
                    }}
                  >
                    {q.answer}
                  </div>

                  <div style={{ fontSize: '0.94rem', color: 'var(--text-main)', marginBottom: 14, fontWeight: 500, lineHeight: 1.5 }}>
                    {q.summary}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 14px',
                    borderRadius: 10,
                  }}
                >
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: 4, fontSize: '0.82rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Detective Methodology:
                  </strong>
                  {q.methodology}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Powai 3D Locality Map */}
      {activeTab === 'map' && <Powai3DMap />}

      {/* Tab 3: Documentation Lie Tracker */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="var(--primary)" /> Verified Discrepancies between API Reference & Live Service (16 Findings)
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

      {/* Tab 4: Corrupt Listings */}
      {activeTab === 'corrupt' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> 41 Corrupt Property Listing Records (Question 4)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            These 41 listings describe physical impossibilities such as floor level exceeding total building floors, negative pricing, or swapped coordinates.
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

      {/* Tab 5: Bait Listings */}
      {activeTab === 'fake' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
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
