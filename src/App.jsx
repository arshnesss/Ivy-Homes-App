import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { ListingsPage } from './pages/ListingsPage';
import { RentalsPage } from './pages/RentalsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SavedPage } from './pages/SavedPage';
import { InsightsPage } from './pages/InsightsPage';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [theme, setTheme] = useState(() => localStorage.getItem('ivy_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ivy_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {activeTab === 'listings' && <ListingsPage />}
        {activeTab === 'rentals' && <RentalsPage />}
        {activeTab === 'projects' && <ProjectsPage />}
        {activeTab === 'saved' && <SavedPage />}
        {activeTab === 'insights' && <InsightsPage />}
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
