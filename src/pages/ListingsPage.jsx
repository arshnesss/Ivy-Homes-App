import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { ListingModal } from '../components/ListingModal';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

export const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  // Pagination state
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filter & Sort State
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Data Quality Toggle
  const [hideQualityIssues, setHideQualityIssues] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getListings({
        offset,
        limit,
        locality: locality || undefined,
        bhk: bhk || undefined,
        property_type: propertyType || undefined,
        furnishing: furnishing || undefined,
        sort_by: sortBy,
        order
      });

      setListings(res.results || []);
      setTotal(res.total || 0);
      setHasMore(res.has_more || false);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError(err.message || 'Failed to load property listings');
    } finally {
      setLoading(false);
    }
  }, [offset, limit, locality, bhk, propertyType, furnishing, sortBy, order]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset to first page when filters change
  const handleFilterChange = (setter, value) => {
    setOffset(0);
    setter(value);
  };

  // Client-side search filtering
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
    <div className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Sale Properties in Mumbai</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Showing retrievable properties with working live filters and numerical sorting
          </p>
        </div>

        <button onClick={fetchListings} className="btn-secondary">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24 }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by apartment name, keyword, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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

        {/* Filter Controls Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'center' }}>
          
          {/* Locality */}
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
              <option value="kandivali east">Kandivali East</option>
              <option value="goregaon east">Goregaon East</option>
            </select>
          </div>

          {/* Bedrooms BHK */}
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
              <option value="4">4 BHK</option>
              <option value="5">5 BHK</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>TYPE</label>
            <select
              value={propertyType}
              onChange={e => handleFilterChange(setPropertyType, e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="independent house">Independent House</option>
              <option value="builder floor">Builder Floor</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* Furnishing */}
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

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>SORT BY</label>
            <select
              value={sortBy}
              onChange={e => handleFilterChange(setSortBy, e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
            >
              <option value="price">Price</option>
              <option value="carpet_area">Carpet Area (Numeric Fixed)</option>
              <option value="posted_at">Posted Date</option>
              <option value="bedroom">Bedrooms</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>ORDER</label>
            <button
              onClick={() => handleFilterChange(setOrder, order === 'asc' ? 'desc' : 'asc')}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <ArrowUpDown size={14} />
              <span>{order === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>

        </div>

        {/* Quality Filter Toggle */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={hideQualityIssues}
              onChange={e => setHideQualityIssues(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
            />
            <span>Hide corrupt & bait listings (Data Quality Protection)</span>
          </label>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing {filteredListings.length} of {listings.length} items (Page offset {offset})
          </span>
        </div>

      </div>

      {/* Main Content State */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Loading property listings from backend...</p>
        </div>
      ) : error ? (
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: 24, borderRadius: 14, textAlign: 'center' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 8px' }} />
          <p>{error}</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 16 }}>
          <p>No listings match your selected filters.</p>
        </div>
      ) : (
        <>
          <div className="grid-listings" style={{ marginBottom: 32 }}>
            {filteredListings.map(item => (
              <ListingCard
                key={item.listing_id}
                item={item}
                onSelect={setSelectedListing}
              />
            ))}
          </div>

          {/* Pagination Controls */}
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

      {/* Property Detail Modal */}
      {selectedListing && (
        <ListingModal
          item={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

    </div>
  );
};
