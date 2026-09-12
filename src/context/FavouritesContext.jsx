import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `ivy_favourites_${user.email}` : 'ivy_favourites_guest';

  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setFavourites(saved ? JSON.parse(saved) : []);
    } catch {
      setFavourites([]);
    }
  }, [storageKey]);

  const saveFavourites = (newFavs) => {
    setFavourites(newFavs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favourites to localStorage:', e);
    }
  };

  const addFavourite = (item) => {
    const exists = favourites.some(fav => fav.listing_id === item.listing_id);
    if (!exists) {
      saveFavourites([...favourites, item]);
    }
  };

  const removeFavourite = (listingId) => {
    saveFavourites(favourites.filter(fav => fav.listing_id !== listingId));
  };

  const isFavourite = (listingId) => {
    return favourites.some(fav => fav.listing_id === listingId);
  };

  const toggleFavourite = (item) => {
    if (isFavourite(item.listing_id)) {
      removeFavourite(item.listing_id);
    } else {
      addFavourite(item);
    }
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
