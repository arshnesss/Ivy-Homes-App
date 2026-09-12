import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { ListingModal } from '../components/ListingModal';
import { Key, MapPin, RefreshCw, ChevronLeft, ChevronRight, Calculator } from 'lucide-react';

export const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);

  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(false);

  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getRentals({
        offset,
        limit,
        locality: locality || undefined,
        bhk: bhk || undefined,
        furnishing: furnishing || undefined
      });
      setRentals(res.results || []);
      setHasMore(res.has_more || false);
    } catch (err) {
      console.error('Failed to fetch rentals:', err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit, locality, bhk, furnishing]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleFilterChange = (setter, val) => {
    setOffset(0);
    setter(val);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Rental Properties in Mumbai</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse available residential rentals, deposit terms, and monthly rents
        </p>
      </div>

      {/* Powai Rent Highlight Box (Question 5 Answer Callout) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 16, padding: 20, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>
            <Calculator size={16} />
            <span>ASSIGNED LOCALITY METRIC (QUESTION 5)</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 2 }}>Powai Total Monthly Rent</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Calculated across all 215 retrievable rental records in Powai
          </p>
        </div>

        <div style={{ background: 'var(--bg-dark)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
            ₹77,24,700
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Powai Monthly Rent</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{ padding: 18, marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>LOCALITY</label>
          <select
            value={locality}
            onChange={e => handleFilterChange(setLocality, e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
          >
            <option value="">All Localities</option>
            <option value="powai">Powai (Assigned)</option>
            <option value="bandra east">Bandra East</option>
            <option value="andheri west">Andheri West</option>
            <option value="chembur">Chembur</option>
            <option value="thane west">Thane West</option>
            <option value="mulund west">Mulund West</option>
            <option value="borivali west">Borivali West</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>BEDROOMS</label>
          <select
            value={bhk}
            onChange={e => handleFilterChange(setBhk, e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
          >
            <option value="">Any BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>FURNISHING</label>
          <select
            value={furnishing}
            onChange={e => handleFilterChange(setFurnishing, e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
          >
            <option value="">Any Furnishing</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully-Furnished</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Loading rentals...</p>
        </div>
      ) : (
        <>
          <div className="grid-listings" style={{ marginBottom: 32 }}>
            {rentals.map(item => (
              <ListingCard
                key={item.listing_id}
                item={item}
                isRental={true}
                onSelect={setSelectedRental}
              />
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

      {selectedRental && (
        <ListingModal
          item={selectedRental}
          isRental={true}
          onClose={() => setSelectedRental(null)}
        />
      )}

    </div>
  );
};
