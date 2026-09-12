import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { Bookmark, MapPin, Bed, Bath, Maximize2, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export const formatPrice = (price, isRental = false) => {
  if (!price && price !== 0) return '₹0';
  if (price < 0) return `₹${price.toLocaleString('en-IN')} (Negative Price)`;
  if (isRental) return `₹${price.toLocaleString('en-IN')} / mo`;
  
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export const ListingCard = ({ item, onSelect, isRental = false }) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(item.listing_id);

  const priceFormatted = formatPrice(item.price, isRental);
  const ppsf = item.carpet_area > 0 && item.price > 0 
    ? Math.round(item.price / item.carpet_area) 
    : null;

  return (
    <div className="property-card animate-fade-in">
      {/* Top badges & Save button */}
      <div className="property-header">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.is_live ? (
            <span className="badge badge-live">Live</span>
          ) : (
            <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Inactive</span>
          )}

          {item.is_verified && (
            <span className="badge badge-verified"><ShieldCheck size={12} /> Verified</span>
          )}

          {item.is_corrupt && (
            <span className="badge badge-corrupt" title="Corrupt record with physical impossibilities">
              <AlertTriangle size={12} /> Corrupt
            </span>
          )}

          {item.is_fake && (
            <span className="badge badge-fake" title="Bait listing with rental price in sale directory">
              <Flame size={12} /> Bait Listing
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(item);
          }}
          style={{
            padding: 6,
            borderRadius: '50%',
            background: saved ? 'var(--primary-light)' : 'var(--bg-elevated)',
            color: saved ? 'var(--primary)' : 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={saved ? 'Remove from saved' : 'Save property'}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main content click target */}
      <div onClick={() => onSelect && onSelect(item)} style={{ cursor: 'pointer', flex: 1 }}>
        <div className="property-price">{priceFormatted}</div>

        <h3 className="property-title" style={{ marginBottom: 4 }}>
          {item.apartment_name || item.title || 'Property Listing'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
          <MapPin size={14} color="var(--primary)" />
          <span style={{ textTransform: 'capitalize' }}>{item.locality || 'Mumbai'}</span>
          {item.property_type && (
            <>
              <span>•</span>
              <span style={{ textTransform: 'capitalize' }}>{item.property_type}</span>
            </>
          )}
        </div>

        {/* Specs Grid */}
        <div className="property-specs">
          <div className="spec-item">
            <span className="spec-label">Bedrooms</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bed size={13} /> {item.bedroom ?? '-'}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Bathrooms</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bath size={13} /> {item.bathroom ?? '-'}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Carpet Area</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Maximize2 size={13} /> {item.carpet_area ? `${item.carpet_area} sqft` : '-'}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {ppsf ? (
            <span>₹{ppsf.toLocaleString('en-IN')}/sqft</span>
          ) : (
            <span>Floor: {item.floor ?? '-'}/{item.total_floors ?? '-'}</span>
          )}
          <span style={{ textTransform: 'capitalize' }}>{item.furnishing || 'Unfurnished'}</span>
        </div>
      </div>
    </div>
  );
};
