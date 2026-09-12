import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { 
  Bookmark, MapPin, Bed, Bath, Maximize2, AlertTriangle, 
  ShieldCheck, Flame, Building2, Home, Key, Image as ImageIcon 
} from 'lucide-react';

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

  const handleClick = (e) => {
    if (onSelect) {
      onSelect(item);
    } else {
      const prefix = isRental ? '#/rentals/' : '#/listings/';
      window.location.hash = `${prefix}${item.listing_id}`;
    }
  };

  // Eye-soothing architectural pastel palettes for realistic property visualization
  const soothingGradients = [
    'linear-gradient(140deg, #F0F7FF 0%, #E0EEFD 50%, #CEE5FD 100%)', // Coastal Sky
    'linear-gradient(140deg, #FDFBF7 0%, #F5EDE4 50%, #EAE0D5 100%)', // Warm Architectural Stone
    'linear-gradient(140deg, #F2FAF5 0%, #E2F5E9 50%, #CEEED9 100%)', // Gentle Greenery
    'linear-gradient(140deg, #F7F5FC 0%, #ECE6F8 50%, #DFD6F3 100%)', // Soft Lavender
    'linear-gradient(140deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)', // Modern Slate
    'linear-gradient(140deg, #FFFDF5 0%, #FEF7DC 50%, #FDEEBE 100%)', // Sunlit Ivory
  ];
  const cardSeed = parseInt(item.listing_id?.replace(/\D/g, '') || '1', 10);
  const bgGradient = soothingGradients[cardSeed % soothingGradients.length];

  return (
    <div 
      className="property-card animate-fade-in" 
      onClick={handleClick} 
      style={{ 
        cursor: 'pointer', 
        padding: 0, 
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        borderRadius: 18,
        background: 'var(--bg-card)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
      }}
    >
      {/* Eye-Soothing Photo Space */}
      <div
        style={{
          height: 195,
          width: '100%',
          position: 'relative',
          background: bgGradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border-color)',
          userSelect: 'none',
        }}
      >
        {/* Subtle decorative architectural blueprint lines */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.08) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }} 
        />

        {/* Center Architectural Icon Medallion */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4ED8',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          {isRental ? <Key size={26} strokeWidth={1.75} /> : (item.property_type === 'villa' ? <Home size={26} strokeWidth={1.75} /> : <Building2 size={26} strokeWidth={1.75} />)}
        </div>

        <div style={{ marginTop: 8, textAlign: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 700, letterSpacing: '-0.01em', display: 'block' }}>
            {item.apartment_name ? `${item.bedroom ? `${item.bedroom} BHK ` : ''}${item.property_type === 'villa' ? 'Villa' : 'Apartment'}` : 'Verified Residence'}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>
            Curated Photo Gallery
          </span>
        </div>

        {/* Top Badges Floating over Photo */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap', zIndex: 2 }}>
          {item.is_live && (
            <span className="badge badge-live" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' }}>
              Live
            </span>
          )}
          {item.is_verified && (
            <span className="badge badge-verified" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' }}>
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {item.is_corrupt && (
            <span className="badge badge-corrupt" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' }}>
              <AlertTriangle size={12} /> Corrupt
            </span>
          )}
          {item.is_fake && (
            <span className="badge badge-fake" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' }}>
              <Flame size={12} /> Bait
            </span>
          )}
        </div>

        {/* Floating Save Button on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(item);
          }}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: 8,
            borderRadius: '50%',
            background: '#ffffff',
            color: saved ? '#2563eb' : '#64748b',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease',
            zIndex: 2,
          }}
          title={saved ? 'Remove from saved' : 'Save property'}
        >
          <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Bottom Locality & Photo indicator over Photo */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: '3px 9px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.92)',
              color: '#1E293B',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <MapPin size={11} color="#2563EB" />
            <span style={{ textTransform: 'capitalize' }}>{item.locality || 'Mumbai'}</span>
          </div>

          <div
            style={{
              padding: '3px 8px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.92)',
              color: '#475569',
              fontSize: '0.68rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <ImageIcon size={10} color="#64748B" />
            <span>Photos Available</span>
          </div>
        </div>
      </div>

      {/* Property Details Body */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="property-price" style={{ marginBottom: 4 }}>
          {priceFormatted}
        </div>

        <h3 
          className="property-title" 
          style={{ 
            fontSize: '1.08rem', 
            fontWeight: 700, 
            marginBottom: 14, 
            lineHeight: 1.3,
            color: 'var(--text-main)' 
          }}
        >
          {item.apartment_name || item.title || 'Property Listing'}
        </h3>

        {/* Specs Grid */}
        <div className="property-specs" style={{ marginBottom: 16 }}>
          <div className="spec-item">
            <span className="spec-label">Bedrooms</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bed size={13} color="var(--primary)" /> {item.bedroom ?? '-'} BHK
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Bathrooms</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bath size={13} color="var(--primary)" /> {item.bathroom ?? '-'}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Carpet Area</span>
            <span className="spec-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Maximize2 size={13} color="var(--primary)" /> {item.carpet_area ? `${item.carpet_area} sqft` : '-'}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            paddingTop: 12,
          }}
        >
          {ppsf ? (
            <span style={{ fontWeight: 600 }}>₹{ppsf.toLocaleString('en-IN')} / sqft</span>
          ) : (
            <span>Floor: {item.floor ?? '-'}/{item.total_floors ?? '-'}</span>
          )}
          <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
            {item.furnishing || 'Unfurnished'}
          </span>
        </div>
      </div>
    </div>
  );
};
