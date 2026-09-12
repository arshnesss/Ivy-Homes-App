import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatPrice, ListingCard } from '../components/ListingCard';
import { useFavourites } from '../context/FavouritesContext';
import { 
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Phone, User, Calendar, 
  AlertTriangle, Bookmark, ShieldCheck, Flame, Compass, Car, Building,
  Building2, Key, Home, Sparkles, CheckCircle2
} from 'lucide-react';

export const ListingDetailPage = ({ listingId, onBack, isRental = false }) => {
  const [item, setItem] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavourite, toggleFavourite } = useFavourites();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchDetail = async () => {
      try {
        const detailFn = isRental ? api.getRentalDetail : api.getListingDetail;
        const data = await detailFn(listingId);
        if (!isMounted) return;
        setItem(data);

        // Fetch similar listings in same locality with matching bedrooms
        if (!isRental && data) {
          try {
            const locRes = await api.getListings({ 
              locality: data.locality, 
              bhk: data.bedroom,
              limit: 6 
            });
            const simData = (locRes.results || []).filter(x => x.listing_id !== listingId);
            if (isMounted) {
              setSimilar(simData.slice(0, 4));
            }
          } catch (e) {
            console.warn('Similar listings fallback note:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load listing detail:', err);
        if (isMounted) setError(err.message || 'Unable to load property details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => { isMounted = false; };
  }, [listingId, isRental]);

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="animate-spin" style={{ width: 36, height: 36, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }} />
        <h2>Loading Property Details...</h2>
        <p style={{ fontSize: '0.9rem', marginTop: 4 }}>Fetching listing specifications from solve.ivy.homes</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: 32, borderRadius: 16, maxWidth: 500, margin: '0 auto' }}>
          <AlertTriangle size={36} style={{ margin: '0 auto 12px' }} />
          <h3>Property Not Found</h3>
          <p style={{ fontSize: '0.9rem', margin: '8px 0 20px' }}>{error || 'Unable to retrieve listing details.'}</p>
          <button onClick={onBack} className="btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </button>
        </div>
      </div>
    );
  }

  const saved = isFavourite(item.listing_id);
  const priceFormatted = formatPrice(item.price, isRental);
  const ppsf = item.carpet_area > 0 && item.price > 0 
    ? Math.round(item.price / item.carpet_area) 
    : null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* Top Bar Navigation */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={18} />
          <span>{isRental ? 'Back to Rentals' : 'Back to All Listings'}</span>
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Listing ID: {item.listing_id}
        </span>
      </div>

      {/* Eye-Soothing Photo Hero Banner */}
      <div
        className="glass-panel"
        style={{
          height: 320,
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 24,
          background: 'linear-gradient(135deg, #F0F7FF 0%, #E2EEFE 50%, #D0E4FD 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Subtle decorative architectural blueprint lines */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37, 99, 235, 0.08) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }} 
        />

        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4ED8',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            marginBottom: 12,
            zIndex: 1,
          }}
        >
          {isRental ? <Key size={34} strokeWidth={1.8} /> : (item.property_type === 'villa' ? <Home size={34} strokeWidth={1.8} /> : <Building2 size={34} strokeWidth={1.8} />)}
        </div>
        <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1E293B', zIndex: 1, letterSpacing: '-0.01em' }}>
          {item.apartment_name || 'Verified Residence'} • Floorplan & Photography
        </span>
        <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 3, zIndex: 1, fontWeight: 500 }}>
          {item.locality || 'Mumbai'}, Maharashtra • Verified Micro-market Listing
        </span>

        {/* Floating Badges on Photo */}
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, flexWrap: 'wrap', zIndex: 2 }}>
          {item.is_live && <span className="badge badge-live" style={{ backdropFilter: 'blur(6px)' }}>Live Active</span>}
          {item.is_verified && <span className="badge badge-verified" style={{ backdropFilter: 'blur(6px)' }}><ShieldCheck size={13} /> Verified Listing</span>}
          {item.is_corrupt && <span className="badge badge-corrupt" style={{ backdropFilter: 'blur(6px)' }}><AlertTriangle size={13} /> Corrupt Data Anomaly</span>}
          {item.is_fake && <span className="badge badge-fake" style={{ backdropFilter: 'blur(6px)' }}><Flame size={13} /> Bait Rental Price</span>}
        </div>

        {/* Photo Gallery Counter Pill on bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            padding: '6px 14px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.92)',
            color: '#1E293B',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            zIndex: 2,
          }}
        >
          <Sparkles size={13} color="#2563EB" />
          <span>High-Resolution Photo Suite</span>
        </div>
      </div>

      {/* Main Page Layout Header */}
      <div className="glass-panel" style={{ padding: 28, marginBottom: 28, borderRadius: 20 }}>
        {/* Title and Location */}
        <h1 style={{ fontSize: '2.2rem', lineHeight: 1.2, marginBottom: 10 }}>
          {item.apartment_name || item.title || 'Property Listing'}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '1rem', flexWrap: 'wrap' }}>
          <MapPin size={18} color="var(--primary)" />
          <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--text-main)' }}>{item.locality}, Mumbai</span>
          {item.property_type && <span style={{ textTransform: 'capitalize' }}>• {item.property_type}</span>}
          {item.website && <span>• Source: {item.website}</span>}
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 28, alignItems: 'start' }}>
        
        {/* Left Main Content Column (8 Cols) */}
        <div style={{ gridColumn: 'span 8' }}>
          
          {/* Corrupt Data Callout Banner if applicable */}
          {item.is_corrupt && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: 20, borderRadius: 16, marginBottom: 24 }}>
              <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertTriangle size={20} /> Data Quality Anomaly Detected
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#991B1B', lineHeight: 1.5, fontWeight: 500 }}>
                This record describes physical impossibilities (such as floor level exceeding total building floors or negative pricing). It has been identified as part of our automated API data quality audit.
              </p>
            </div>
          )}

          {/* Specifications Grid */}
          <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 18 }}>Property Specifications</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              
              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>BEDROOMS</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bed size={18} color="var(--primary)" /> {item.bedroom ?? '-'} BHK
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>BATHROOMS</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bath size={18} color="var(--primary)" /> {item.bathroom ?? '-'} Baths
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>CARPET AREA</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Maximize2 size={18} color="var(--primary)" /> {item.carpet_area ? `${item.carpet_area} sqft` : '-'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>FLOOR LEVEL</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building size={18} color="var(--primary)" /> Floor {item.floor ?? '-'} / {item.total_floors ?? '-'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>FACING DIRECTION</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Compass size={18} color="var(--primary)" /> {item.facing_direction || '-'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>PARKING</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Car size={18} color="var(--primary)" /> {item.covered_parking ? `${item.covered_parking} Covered` : 'None'}
                </div>
              </div>

            </div>
          </div>

          {/* Description Section */}
          <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Seller Description</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, background: 'var(--bg-elevated)', padding: 18, borderRadius: 12, whiteSpace: 'pre-line' }}>
              {item.description || 'No description text provided by the seller.'}
            </p>
          </div>

          {/* Similar Listings Strip */}
          {!isRental && similar.length > 0 && (
            <div className="glass-panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Similar Properties in {item.locality}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {similar.map(sim => (
                  <div 
                    key={sim.listing_id} 
                    onClick={() => {
                      window.location.hash = `#/listings/${sim.listing_id}`;
                    }}
                    style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
                      {formatPrice(sim.price)}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{sim.apartment_name || sim.locality}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sim.bedroom} BHK • {sim.carpet_area} sqft
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar Column (4 Cols) */}
        <div style={{ gridColumn: 'span 4', position: 'sticky', top: 90 }}>
          
          {/* Price & Action Card */}
          <div className="glass-panel" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
              {isRental ? 'Monthly Rent' : 'Listed Price'}
            </div>
            
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
              {priceFormatted}
            </div>

            {ppsf && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                ₹{ppsf.toLocaleString('en-IN')} / sqft carpet area
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => toggleFavourite(item)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', borderColor: saved ? 'var(--primary)' : 'var(--border-color)', color: saved ? 'var(--primary)' : 'var(--text-main)' }}
              >
                <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                <span>{saved ? 'Saved in Favourites' : 'Save Property'}</span>
              </button>

              {item.posted_by_contact ? (
                <a
                  href={`tel:${item.posted_by_contact}`}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px 20px' }}
                >
                  <Phone size={18} />
                  <span>Call {item.posted_by_name || item.posted_by_contact}</span>
                </a>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                  Contact not disclosed by seller
                </div>
              )}
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h4 style={{ fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} color="var(--primary)" /> Posted By
            </h4>
            
            {item.posted_by_name && (
              <div style={{ fontSize: '0.92rem', marginBottom: 6 }}>
                <strong>Name:</strong> {item.posted_by_name}
              </div>
            )}

            {item.posted_by && (
              <div style={{ fontSize: '0.92rem', marginBottom: 6 }}>
                <strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{item.posted_by}</span>
              </div>
            )}

            {item.posted_by_contact && (
              <div style={{ fontSize: '0.92rem', marginBottom: 12 }}>
                <strong>Phone:</strong> {item.posted_by_contact}
              </div>
            )}

            {item.posted_at && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> Posted on {new Date(item.posted_at).toLocaleDateString()}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
