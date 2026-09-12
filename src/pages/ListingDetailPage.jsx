import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatPrice, ListingCard } from '../components/ListingCard';
import { useFavourites } from '../context/FavouritesContext';
import { 
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Phone, User, Calendar, 
  AlertTriangle, Bookmark, ShieldCheck, Flame, Compass, Car, Building
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
        if (isMounted) {
          setItem(data);
        }

        if (!isRental) {
          const simData = await api.getSimilarListings(listingId);
          if (isMounted) {
            setSimilar(simData.slice(0, 4));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load property details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (listingId) {
      fetchDetail();
    }
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
          <span>Back to All Listings</span>
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Listing ID: {item.listing_id}
        </span>
      </div>

      {/* Main Page Layout Header */}
      <div className="glass-panel" style={{ padding: 28, marginBottom: 28 }}>
        
        {/* Badges Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {item.is_live && <span className="badge badge-live">Live Active</span>}
          {item.is_verified && <span className="badge badge-verified"><ShieldCheck size={13} /> Verified Listing</span>}
          {item.is_corrupt && <span className="badge badge-corrupt"><AlertTriangle size={13} /> Corrupt Data Anomaly</span>}
          {item.is_fake && <span className="badge badge-fake"><Flame size={13} /> Bait Rental Price Listing</span>}
        </div>

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
              <p style={{ fontSize: '0.9rem', color: '#FCA5A5', lineHeight: 1.5 }}>
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

              <a
                href={`tel:${item.posted_by_contact || ''}`}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px 20px' }}
              >
                <Phone size={18} />
                <span>Call {item.posted_by_name || 'Seller'}</span>
              </a>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <h4 style={{ fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} color="var(--primary)" /> Seller Contact Details
            </h4>
            
            <div style={{ fontSize: '0.92rem', marginBottom: 6 }}>
              <strong>Name:</strong> {item.posted_by_name || 'Verified Partner'}
            </div>

            <div style={{ fontSize: '0.92rem', marginBottom: 6 }}>
              <strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{item.posted_by || 'agent'}</span>
            </div>

            <div style={{ fontSize: '0.92rem', marginBottom: 12 }}>
              <strong>Phone:</strong> {item.posted_by_contact || 'Available on request'}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} /> Posted on {item.posted_at ? new Date(item.posted_at).toLocaleDateString() : 'Recent'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
