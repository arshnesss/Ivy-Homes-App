import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { Key, MapPin, RefreshCw, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

export const RentalsPage = ({ onSelectRental }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSelectRental = (item) => {
    if (onSelectRental) {
      onSelectRental(item);
    } else {
      window.location.hash = `#/rentals/${item.listing_id}`;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocality('');
    setBhk('');
    setFurnishing('');
    setOffset(0);
  };

  const hasActiveFilters = Boolean(searchTerm || locality || bhk || furnishing);

  const filteredRentals = rentals.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.apartment_name && item.apartment_name.toLowerCase().includes(term)) ||
      (item.locality && item.locality.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1360, margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Mumbai Rental Residences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
            Verified residential rental apartments, flats, and duplexes across Mumbai micro-markets
          </p>
        </div>

        <button 
          onClick={fetchRentals} 
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12 }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Rentals</span>
        </button>
      </div>

      {/* Spacious, Clear Search & Filter Console */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: 32,
          borderRadius: 18,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search rentals by building name, locality, or keyword (e.g. Hiranandani, Powai)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 42px 12px 46px',
              borderRadius: 12,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.96rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 14,
                top: 14,
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Locality
            </label>
            <select
              value={locality}
              onChange={e => handleFilterChange(setLocality, e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">All Mumbai Localities</option>
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
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Bedrooms (BHK)
            </label>
            <select
              value={bhk}
              onChange={e => handleFilterChange(setBhk, e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">Any BHK Configuration</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={e => handleFilterChange(setFurnishing, e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">Any Furnishing Status</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="fully-furnished">Fully-Furnished</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '0.82rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'var(--primary-light)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Rental Listings */}
      {loading ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Loading verified rental listings...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 18 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No Rentals Match Your Search</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 20 }}>
            Try selecting a different locality or resetting your search term.
          </p>
          <button onClick={clearAllFilters} className="btn-primary">
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid-listings" style={{ marginBottom: 40 }}>
            {filteredRentals.map(item => (
              <ListingCard
                key={item.listing_id}
                item={item}
                isRental={true}
                onSelect={() => handleSelectRental(item)}
              />
            ))}
          </div>

          {/* Spacious Pagination Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24 }}>
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="btn-secondary"
              style={{ opacity: offset === 0 ? 0.4 : 1, padding: '10px 20px', borderRadius: 12 }}
            >
              <ChevronLeft size={18} />
              <span>Previous Page</span>
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Page {Math.floor(offset / limit) + 1}
            </span>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore}
              className="btn-secondary"
              style={{ opacity: !hasMore ? 0.4 : 1, padding: '10px 20px', borderRadius: 12 }}
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
