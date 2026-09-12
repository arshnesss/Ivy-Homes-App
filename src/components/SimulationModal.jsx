import React, { useState } from 'react';
import { Powai3DMap } from './Powai3DMap';
import { City3DBackground } from './City3DBackground';
import { X, Compass, Building, Sparkles, Maximize2 } from 'lucide-react';

export const SimulationModal = ({ isOpen, onClose }) => {
  const [simulationMode, setSimulationMode] = useState('powai'); // 'powai' | 'skyline'

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
          maxWidth: 1200,
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
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-main)' }}>
                3D Interactive Simulation
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Real-Time Three.js WebGL Spatial Visualization
              </span>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setSimulationMode('powai')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: simulationMode === 'powai' ? '1px solid #2563EB' : '1px solid var(--border-color)',
                background: simulationMode === 'powai' ? '#2563EB' : 'var(--bg-card)',
                color: simulationMode === 'powai' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={15} />
              <span>Powai 3D Locality Map</span>
            </button>

            <button
              onClick={() => setSimulationMode('skyline')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: simulationMode === 'skyline' ? '1px solid #2563EB' : '1px solid var(--border-color)',
                background: simulationMode === 'skyline' ? '#2563EB' : 'var(--bg-card)',
                color: simulationMode === 'skyline' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.2s ease',
              }}
            >
              <Building size={15} />
              <span>Mumbai 3D Skyline</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}
              title="Close Simulation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3D Viewport Body */}
        <div style={{ flex: 1, position: 'relative', minHeight: 520, overflow: 'hidden', background: '#0B0F19' }}>
          {simulationMode === 'powai' ? (
            <div style={{ height: '100%', minHeight: 520 }}>
              <Powai3DMap />
            </div>
          ) : (
            <div style={{ height: '100%', minHeight: 520, position: 'relative' }}>
              <City3DBackground />
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F8FAFC',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: 2 }}>Mumbai Micro-Market Skyline Model</div>
                <div style={{ color: '#94A3B8', fontSize: '0.74rem' }}>Interactive procedural architectural geometry with ambient evening lighting</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
