import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="license-footer">
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <span>Ivy Homes Internship Assignment App — Mumbai Region</span>
          <span>•</span>
          <span>Assigned Locality: <strong>Powai</strong></span>
        </div>
        
        <div className="license-cert-badge" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={14} />
          <span>Data certified by 100acres — 100A-D15820</span>
        </div>

        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>
          Reference Moment: 2026-09-10T00:00:00+05:30 (IST) | Built by Arsh Sharma
        </div>
      </div>
    </footer>
  );
};
