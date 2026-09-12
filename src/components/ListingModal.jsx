import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatPrice } from './ListingCard';
import { X, MapPin, Bed, Bath, Maximize2, Phone, User, Calendar, AlertTriangle, Bookmark, ShieldCheck } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export const ListingModal = ({ item, onClose, isRental = false }) => {
  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(item.listing_id);

  useEffect(() => {
    if (item && item.listing_id && !isRental) {
      setLoadingSimilar(true);
      api.getSimilarListings(item.listing_id)
        .then(res => setSimilar(res.slice(0, 4)))
        .catch(err => console.warn('Could not fetch similar listings:', err))
        .finally(() => setLoadingSimilar(false));
    }
  }, [item, isRental]);

  if (!item) return null;

  const priceFormatted = formatPrice(item.price, isRental);
  const ppsf = item.carpet_area > 0 && item.price > 0 
    ? Math.round(item.price / item.carpet_area) 
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: 8,
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)'
          }}
        >
          <X size={20} />
        </button>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {item.is_live && <span className="badge badge-live">Active</span>}
          {item.is_verified && <span className="badge badge-verified"><ShieldCheck size={12} /> Verified</span>}
          {item.is_corrupt && <span className="badge badge-corrupt"><AlertTriangle size={12} /> Corrupt Data Record</span>}
          {item.is_fake && <span className="badge badge-fake"><AlertTriangle size={12} /> Bait Listing</span>}
        </div>

        {/* Title & Price */}
        <h2 style={{ fontSize: '1.6rem', marginBottom: 6, paddingRight: 40 }}>
          {item.apartment_name || item.title || 'Property Detail'}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 20 }}>
          <MapPin size={16} color="var(--primary)" />
          <span style={{ textTransform: 'capitalize' }}>{item.locality}, Mumbai</span>
          {item.property_type && <span style={{ textTransform: 'capitalize' }}>• {item.property_type}</span>}
        </div>

        <div style={{ background: 'var(--bg-elevated)', padding: 18, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {isRental ? 'Monthly Rent' : 'Listed Price'}
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {priceFormatted}
            </div>
            {ppsf && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹{ppsf.toLocaleString('en-IN')}/sqft</div>}
          </div>

          <button
            onClick={() => toggleFavourite(item)}
            className="btn-secondary"
            style={{ borderColor: saved ? 'var(--primary)' : 'var(--border-color)', color: saved ? 'var(--primary)' : 'var(--text-main)' }}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
            <span>{saved ? 'Saved' : 'Save Property'}</span>
          </button>
        </div>

        {/* Corrupt Data Warning Callout */}
        {item.is_corrupt && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: 14, marginBottom: 20, color: '#FCA5A5' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#EF4444', marginBottom: 4 }}>
              <AlertTriangle size={18} /> Data Quality Anomaly Discovered
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              This record contains physical impossibilities (e.g. floor level exceeding building height or negative pricing) as part of our live API audit.
            </p>
          </div>
        )}

        {/* Specs Grid */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Property Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BEDROOMS</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.bedroom ?? '-'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BATHROOMS</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.bathroom ?? '-'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CARPET AREA</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.carpet_area ? `${item.carpet_area} sqft` : '-'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FLOOR LEVEL</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.floor ?? '-'} / {item.total_floors ?? '-'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FURNISHING</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'capitalize' }}>{item.furnishing || 'Unfurnished'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FACING</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'capitalize' }}>{item.facing_direction || '-'}</div>
          </div>
        </div>

        {/* Description */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Seller Description</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24, whiteSpace: 'pre-line', background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
          {item.description || 'No description provided by seller.'}
        </p>

        {/* Contact Agent Section */}
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 14, padding: 18, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.95rem' }}>
              <User size={16} color="var(--primary)" />
              <span>{item.posted_by_name || 'Verified Seller'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>({item.posted_by || 'agent'})</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              ID: {item.listing_id} • Posted on {item.posted_at ? new Date(item.posted_at).toLocaleDateString() : '-'}
            </div>
          </div>

          <button
            onClick={() => alert(`Inspection inquiry confirmed for ${item.apartment_name || item.listing_id}. The Ivy Homes concierge will follow up.`)}
            className="btn-primary"
            style={{ cursor: 'pointer' }}
          >
            <Calendar size={16} />
            <span>Schedule Inspection</span>
          </button>
        </div>

        {/* Similar Listings Strip */}
        {!isRental && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Similar Properties Nearby</h3>
            {loadingSimilar ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Loading recommendations...</div>
            ) : similar.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {similar.map(sim => (
                  <div key={sim.listing_id} style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(sim.price)}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sim.apartment_name || sim.locality}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sim.bedroom} BHK • {sim.carpet_area} sqft</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No similar listings available.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
