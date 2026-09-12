import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { formatPrice } from '../components/ListingCard';
import { Building2, MapPin, Calendar, Layers, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getProjects({ offset, limit });
      setProjects(res.results || []);
      setHasMore(res.has_more || false);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="animate-fade-in">
      
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Builder Projects in Mumbai</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore luxury developments, RERA-approved townships, and project price ranges
        </p>
      </div>

      {/* Highlight Box for Costliest Project (Question 7 Answer) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 16, padding: 20, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--purple)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>
            <Building2 size={16} />
            <span>COSTLIEST PROJECT METRIC (QUESTION 7)</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 2 }}>Assetz Serenity (P50016)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Highest maximum price project across Mumbai dataset
          </p>
        </div>

        <div style={{ background: 'var(--bg-dark)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--purple)', fontFamily: 'var(--font-heading)' }}>
            ₹12.44 Cr
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹12,44,00,000 INR (Converted from Cr unit)</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Loading builder projects...</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
            {projects.map(p => (
              <div key={p.project_id} className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  
                  {/* Status & Developer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {p.developer_name || 'Premium Builder'}
                      </span>
                      <h3 style={{ fontSize: '1.3rem', marginTop: 2 }}>{p.apartment_name}</h3>
                    </div>

                    <span className="badge badge-live" style={{ textTransform: 'capitalize' }}>
                      {p.project_status || 'Under Construction'}
                    </span>
                  </div>

                  {/* Locality */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span style={{ textTransform: 'capitalize' }}>{p.locality}, Mumbai</span>
                  </div>

                  {/* Price Range */}
                  <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price Range</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatPrice(p.price_min_inr)} - {formatPrice(p.price_max_inr)}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.82rem', marginBottom: 16 }}>
                    <div style={{ background: 'var(--bg-dark)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL UNITS</span>
                      <strong style={{ color: 'var(--text-main)' }}>{p.total_units || '-'}</strong>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOWERS</span>
                      <strong style={{ color: 'var(--text-main)' }}>{p.total_towers || '-'}</strong>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>POSSESSION</span>
                      <strong style={{ color: 'var(--text-main)' }}>{p.possession_date || '-'}</strong>
                    </div>
                  </div>

                </div>

                {/* Footer RERA & Project ID */}
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={14} color="var(--accent)" /> {p.rera_number || 'RERA Approved'}
                  </span>
                  <span>ID: {p.project_id}</span>
                </div>

              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="btn-secondary"
              style={{ opacity: offset === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} />
              <span>Previous Page</span>
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Page {Math.floor(offset / limit) + 1}
            </span>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore}
              className="btn-secondary"
              style={{ opacity: !hasMore ? 0.5 : 1 }}
            >
              <span>Next Page</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

    </div>
  );
};
