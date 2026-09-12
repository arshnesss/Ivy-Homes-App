import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { RentalsPage } from './pages/RentalsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SavedPage } from './pages/SavedPage';
import { InsightsPage } from './pages/InsightsPage';

const AppContent = () => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash.replace('#/', '') || 'listings';
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ivy_theme');
    // If previous session had dark cached, reset to light per user request
    if (saved === 'dark') {
      localStorage.setItem('ivy_theme', 'light');
      return 'light';
    }
    return saved || 'light';
  });

  // Handle URL hash changes for dedicated page routes (e.g., #/listings/100-1000042)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      setCurrentRoute(hash || 'listings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ivy_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navigateTo = (route) => {
    window.location.hash = `#/${route}`;
  };

  if (!user) {
    return <LoginPage />;
  }

  // Parse route parameters for dedicated property detail view (e.g. listings/100-5000042)
  const routeParts = currentRoute.split('/');
  const mainTab = routeParts[0] || 'listings';
  const detailId = routeParts[1];

  return (
    <div className="app-container">
      <Navbar
        activeTab={mainTab}
        setActiveTab={(tab) => navigateTo(tab)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {/* Dedicated Property Detail Route View */}
        {detailId ? (
          <ListingDetailPage
            listingId={detailId}
            isRental={mainTab === 'rentals'}
            onBack={() => navigateTo(mainTab)}
          />
        ) : (
          <>
            {mainTab === 'listings' && (
              <ListingsPage
                onSelectListing={(item) => navigateTo(`listings/${item.listing_id}`)}
              />
            )}
            {mainTab === 'rentals' && (
              <RentalsPage
                onSelectRental={(item) => navigateTo(`rentals/${item.listing_id}`)}
              />
            )}
            {mainTab === 'projects' && <ProjectsPage />}
            {mainTab === 'saved' && <SavedPage />}
            {mainTab === 'insights' && <InsightsPage />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <FavouritesProvider>
        <AppContent />
      </FavouritesProvider>
    </AuthProvider>
  );
}

export default App;
