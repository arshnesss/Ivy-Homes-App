import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, X, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export const ListingsPage = ({ onSelectListing }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(false);

  // Filter & Sort State
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [budgetTier, setBudgetTier] = useState('');

  // Data Quality Toggle - default to hiding anomalies for a pristine browse experience
  const [hideQualityIssues, setHideQualityIssues] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let minPrice, maxPrice;
      if (budgetTier === 'under1cr') {
        maxPrice = 10000000;
      } else if (budgetTier === '1to2cr') {
        minPrice = 10000000;
        maxPrice = 20000000;
      } else if (budgetTier === '2to5cr') {
        minPrice = 20000000;
        maxPrice = 50000000;
      } else if (budgetTier === 'above5cr') {
        minPrice = 50000000;
      }

      const res = await api.getListings({
        offset,
        limit,
        locality: locality || undefined,
        bhk: bhk || undefined,
        property_type: propertyType || undefined,
        furnishing: furnishing || undefined,
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sortBy,
        order
      });

      setListings(res.results || []);
      setHasMore(res.has_more || false);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError(err.message || 'Failed to load property listings');
    } finally {
      setLoading(false);
    }
  }, [offset, limit, locality, bhk, propertyType, furnishing, budgetTier, sortBy, order]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (setter, value) => {
    setOffset(0);
    setter(value);
  };

  const clearAllFilters = () => {
    setLocality('');
    setBhk('');
    setPropertyType('');
    setFurnishing('');
    setBudgetTier('');
    setSearchTerm('');
    setSortBy('price');
    setOrder('asc');
    setOffset(0);
  };

  const hasActiveFilters = Boolean(locality || bhk || propertyType || furnishing || budgetTier || searchTerm);

  const filteredListings = listings.filter(item => {
    if (hideQualityIssues && (item.is_corrupt || item.is_fake)) {
      return false;
    }
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
            Properties for Sale in Mumbai
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
            Verified residential homes, verified micro-market pricing, and direct seller listings
          </p>
        </div>

        <button 
          onClick={fetchListings} 
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12 }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Spacious, Intuitive Search & Filter Console */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          borderRadius: 18, 
          marginBottom: 32,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search 
            size={20} 
            style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-muted)' }} 
          />
          <input
            type="text"
            placeholder="Search by apartment name, locality, landmark, or keyword (e.g. Hiranandani, Powai)..."
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16, 
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          {/* Locality Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Locality
            </label>
            <select
              value={locality}
              onChange={e => handleFilterChange(setLocality, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">All Mumbai Localities</option>
              <option value="powai">Powai (Assigned)</option>
              <option value="bandra east">Bandra East</option>
              <option value="andheri west">Andheri West</option>
              <option value="chembur">Chembur</option>
              <option value="thane west">Thane West</option>
              <option value="mulund west">Mulund West</option>
              <option value="borivali west">Borivali West</option>
              <option value="kandivali east">Kandivali East</option>
              <option value="goregaon east">Goregaon East</option>
            </select>
          </div>

          {/* Bedrooms BHK Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Bedrooms (BHK)
            </label>
            <select
              value={bhk}
              onChange={e => handleFilterChange(setBhk, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">Any BHK Configuration</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          {/* Budget Range Tier */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Budget Range
            </label>
            <select
              value={budgetTier}
              onChange={e => handleFilterChange(setBudgetTier, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="">Any Budget</option>
              <option value="under1cr">Under ₹1.00 Cr</option>
              <option value="1to2cr">₹1.00 Cr – ₹2.00 Cr</option>
              <option value="2to5cr">₹2.00 Cr – ₹5.00 Cr</option>
              <option value="above5cr">Above ₹5.00 Cr</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              Sort Order
            </label>
            <select
              value={`${sortBy}_${order}`}
              onChange={e => {
                const val = e.target.value;
                if (val === 'price_asc') { setSortBy('price'); setOrder('asc'); }
                else if (val === 'price_desc') { setSortBy('price'); setOrder('desc'); }
                else if (val === 'carpet_asc') { setSortBy('carpet_area'); setOrder('asc'); }
                else if (val === 'carpet_desc') { setSortBy('carpet_area'); setOrder('desc'); }
                setOffset(0);
              }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="carpet_asc">Carpet Area: Small to Large</option>
              <option value="carpet_desc">Carpet Area: Large to Small</option>
            </select>
          </div>
        </div>

        {/* Quality Toggle & Clear Filters Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid var(--border-color)'
          }}
        >
          {/* Quality issues toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={hideQualityIssues}
              onChange={e => setHideQualityIssues(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
            />
            <span>Exclude Corrupt Data & Bait Listings from View</span>
          </label>

          {/* Reset Filters button */}
          {hasActiveFilters && (
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
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: 18, borderRadius: 14, marginBottom: 24, border: '1px solid var(--border-color)' }}>
          {error}
        </div>
      )}

      {/* Grid of Listings */}
      {loading ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Loading verified properties...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 18 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No Properties Match Your Search</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 20 }}>
            Try broadening your budget, selecting another locality, or resetting your search term.
          </p>
          <button onClick={clearAllFilters} className="btn-primary">
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid-listings" style={{ marginBottom: 40 }}>
            {filteredListings.map(item => (
              <ListingCard
                key={item.listing_id}
                item={item}
                onSelect={() => onSelectListing ? onSelectListing(item) : (window.location.hash = `#/listings/${item.listing_id}`)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
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
