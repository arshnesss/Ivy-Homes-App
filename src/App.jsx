import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { RentalsPage } from './pages/RentalsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SavedPage } from './pages/SavedPage';
import { InsightsPage } from './pages/InsightsPage';

import { SimulationModal } from './components/SimulationModal';
import { Sparkles } from 'lucide-react';

const AppContent = () => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(() => {
    const raw = window.location.hash.replace('#/', '');
    return raw || 'home';
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ivy_theme');
    if (saved === 'dark') {
      localStorage.setItem('ivy_theme', 'light');
      return 'light';
    }
    return saved || 'light';
  });
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  // Handle URL hash changes for dedicated page routes (e.g., #/listings/100-1000042)
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash || '';
      // Ignore in-page section jump anchors (e.g. #how-it-works, #login-portal, #faq)
      if (fullHash.startsWith('#') && !fullHash.startsWith('#/')) {
        return;
      }
      const hash = fullHash.replace('#/', '');
      setCurrentRoute(hash || 'home');
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

  // When unauthenticated, show either the authentic landing page or the 3D animated sign-in page
  if (!user) {
    if (currentRoute === 'signin' || currentRoute === 'login') {
      return <SignInPage onBack={() => navigateTo('home')} />;
    }
    return <LandingPage onGoToSignIn={() => navigateTo('signin')} />;
  }

  // Parse route parameters for dedicated property detail view (e.g. listings/100-5000042)
  const routeParts = currentRoute.split('/');
  const rawTab = routeParts[0] || 'listings';
  const detailId = routeParts[1];

  // Prevent blank screens if URL hash is 'login' or unknown by defaulting to 'listings'
  const validTabs = ['listings', 'rentals', 'projects', 'saved', 'insights'];
  const mainTab = validTabs.includes(rawTab) ? rawTab : 'listings';

  return (
    <div className="app-container">
      <Navbar
        activeTab={mainTab}
        setActiveTab={(tab) => navigateTo(tab)}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSimulation={() => setIsSimulationOpen(true)}
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

      {/* Floating 3D Simulation Button - Accessible across all post-login screens */}
      <button
        onClick={() => setIsSimulationOpen(true)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 999,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          padding: '12px 20px',
          borderRadius: 30,
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.92rem',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
        title="Launch 3D Spatial Simulation"
      >
        <Sparkles size={18} />
        <span>3D Simulation</span>
      </button>

      {/* Interactive 3D Spatial Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
      />

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
