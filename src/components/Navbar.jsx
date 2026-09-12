import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { Home, Building2, Key, Bookmark, BarChart3, LogOut, Sun, Moon, Sparkles, User } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, theme, toggleTheme, onOpenSimulation }) => {
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();

  const navItems = [
    { id: 'listings', label: 'Sale Listings', icon: Home },
    { id: 'rentals', label: 'Rentals', icon: Key },
    { id: 'projects', label: 'Projects', icon: Building2 },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: favourites.length },
    { id: 'insights', label: 'Insights & Detective Audit', icon: BarChart3 },
  ];

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'var(--bg-card)', 
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        
        {/* Authentic Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveTab('listings')}>
          <div style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '7px 9px', borderRadius: 10, color: '#fff', display: 'flex', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              ivy <span style={{ color: 'var(--primary)', fontWeight: 600 }}>homes</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Mumbai Micro-Markets
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session, 3D Simulation & Theme Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Easy Access 3D Simulation Button */}
          <button
            onClick={onOpenSimulation}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(5, 150, 105, 0.12))',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Open 3D Spatial Simulation"
          >
            <Sparkles size={15} />
            <span>3D Simulation</span>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              padding: 8,
              borderRadius: 10,
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <>
              {/* Profile Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                }}
                title={`Active Session: ${user.email}`}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563EB', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={13} />
                </div>
                <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </span>
              </div>

              {/* Sign Out Button with Clear Text Label */}
              <button
                onClick={() => {
                  logout();
                  window.location.hash = '#/login';
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Sign out of Ivy Homes"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
