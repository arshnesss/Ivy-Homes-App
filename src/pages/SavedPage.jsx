import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { useAuth } from '../context/AuthContext';
import { ListingCard } from '../components/ListingCard';
import { ListingModal } from '../components/ListingModal';
import { Bookmark, HeartOff, UserCheck } from 'lucide-react';

export const SavedPage = () => {
  const { favourites } = useFavourites();
  const { user } = useAuth();
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Saved Properties</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Your saved favorites list (Persisted per user in localStorage)
          </p>
        </div>

        {user && (
          <div style={{ background: 'var(--bg-elevated)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Session Account: {user.email}
            </span>
          </div>
        )}
      </div>

      {favourites.length === 0 ? (
        <div className="glass-panel" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bookmark size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: 6 }}>No saved properties yet</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Click the bookmark icon on any sale listing or rental to save properties to your list.
          </p>
        </div>
      ) : (
        <div className="grid-listings">
          {favourites.map(item => (
            <ListingCard
              key={item.listing_id}
              item={item}
              onSelect={setSelectedListing}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <ListingModal
          item={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

    </div>
  );
};
