import React, { useState } from 'react';
import { MICROSERVICES } from '../data/modulesData';

export const ArchitectureInspector: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('shield');
  const activeService = MICROSERVICES.find((s) => s.id === activeId) || MICROSERVICES[0];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-warm)',
      borderRadius: '16px',
      padding: '24px 28px',
      marginBottom: '36px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(234, 88, 12, 0.15)',
            color: '#EA580C',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px'
          }}>REACT MICROSERVICE INSPECTOR</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontFamily: "'Outfit', sans-serif" }}>
            Real-Time Subsystem Telemetry &amp; Specs
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {MICROSERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                background: activeId === s.id ? '#EA580C' : '#FAF7F2',
                color: activeId === s.id ? '#FFFFFF' : '#736B63',
                border: '1px solid ' + (activeId === s.id ? '#EA580C' : '#E7E0D6'),
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: '#FAF7F2',
        border: '1px solid #E7E0D6',
        borderRadius: '12px',
        padding: '18px 22px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{
              fontSize: '10px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#EA580C',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>{activeService.badge}</span>
            <h4 style={{ margin: '2px 0 0', fontSize: '16px', color: '#1C1917', fontFamily: "'Outfit', sans-serif" }}>
              {activeService.name}
            </h4>
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            background: '#FFFFFF',
            border: '1px solid #E7E0D6',
            padding: '3px 8px',
            borderRadius: '6px',
            color: '#2563EB'
          }}>
            {activeService.runtime}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#332F2B', lineHeight: 1.6, margin: '10px 0' }}>
          {activeService.desc}
        </p>
        <div style={{
          display: 'inline-block',
          background: '#FFFFFF',
          border: '1px solid #E7E0D6',
          padding: '4px 10px',
          borderRadius: '6px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#059669',
          fontWeight: 600
        }}>
          ✓ {activeService.spec}
        </div>
      </div>
    </div>
  );
};
