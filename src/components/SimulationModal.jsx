import React from 'react';
import { Powai3DMap } from './Powai3DMap';
import { X, Compass, Sparkles, MapPin } from 'lucide-react';

export const SimulationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          maxHeight: '92vh',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB, #059669)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Compass size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-main)' }}>
                  Powai 3D Locality Simulation
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  Assigned Micro-Market
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Real-Time Three.js Spatial Map • 100 Verified Listings • Corrupt & Bait Anomaly Detection
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.84rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              title="Close Simulation"
            >
              <X size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport Body - Exclusively Powai 3D Map */}
        <div style={{ flex: 1, position: 'relative', minHeight: 560, overflow: 'hidden', background: '#0B0F19' }}>
          <Powai3DMap />
        </div>
      </div>
    </div>
  );
};
