import React, { useState } from 'react';
import type { DocModule } from '../types';

interface SidebarProps {
  modules: DocModule[];
  currentRoute: string;
  onNavigate: (route: string, sectionId?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  currentRoute,
  onNavigate,
  searchQuery,
  onSearchChange,
  isOpenMobile,
  onCloseMobile
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Find currently active module based on currentRoute
  const activeMod = modules.find((m) => m.route === currentRoute) || modules[0];

  // Search results across ALL modules and sections
  const searchResults = searchQuery.trim()
    ? modules.flatMap((m) =>
        m.sections
          .filter(
            (sec) =>
              sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((sec) => ({
            module: m,
            section: sec
          }))
      )
    : [];

  const handleSelectSearchResult = (route: string, secId: string) => {
    onNavigate(route, secId);
    setShowSearchDropdown(false);
    onSearchChange('');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 99,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      <aside
        className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
        id="sidebar"
        style={{
          width: '320px',
          minWidth: '320px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#1C1917',
          color: '#FAF8F5',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #2E2926',
          zIndex: 100,
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #2E2926' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(234, 88, 12, 0.2)',
                color: '#EA580C',
                border: '1px solid rgba(234, 88, 12, 0.4)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              ISRO SAC PS-26171
            </span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                className="mobile-close-btn"
              >
                ✕
              </button>
            )}
          </div>

          <h1 style={{ margin: '4px 0 2px', fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            PRATYAKSHA
          </h1>
          <p style={{ margin: 0, fontSize: '11.5px', color: '#A8A29E', lineHeight: 1.4 }}>
            Autonomous Browser Agent with WebGPU On-Device Privacy Shield
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#10B981', fontWeight: 700 }}>
              ROUTING ACTIVE · 7 MODULES
            </span>
          </div>
        </div>

        {/* Global Search Input */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #2E2926', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#24201D',
              border: '1px solid #3E3834',
              borderRadius: '8px',
              padding: '6px 10px',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '13px', color: '#A8A29E' }}>🔍</span>
            <input
              type="text"
              placeholder="Search all 7 modules &amp; sections..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '12px',
                width: '100%',
                fontFamily: 'Inter, sans-serif'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '2px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results Popover */}
          {showSearchDropdown && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '56px',
                left: '16px',
                right: '16px',
                background: '#1C1917',
                border: '1px solid #EA580C',
                borderRadius: '10px',
                maxHeight: '340px',
                overflowY: 'auto',
                zIndex: 110,
                boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
                padding: '6px'
              }}
            >
              {searchResults.length === 0 ? (
                <div style={{ padding: '12px', fontSize: '12px', color: '#A8A29E', textAlign: 'center' }}>
                  No sections matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                searchResults.map(({ module: m, section: sec }) => (
                  <button
                    key={`${m.id}-${sec.id}`}
                    onClick={() => handleSelectSearchResult(m.route, sec.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                      borderBottom: '1px solid #2E2926'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#2E2926')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span
                        style={{
                          background: 'var(--isro-orange)',
                          color: '#FFFFFF',
                          fontSize: '9.5px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}
                      >
                        MOD {m.num}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{sec.title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#A8A29E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sec.summary}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
          {/* Module Switcher Title */}
          <div style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#78716C', padding: '4px 8px 8px', letterSpacing: '0.5px' }}>
            DOCUMENTATION MODULES (ROUTING)
          </div>

          {/* Module Selector List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '18px' }}>
            {modules.map((m) => {
              const isActive = m.route === currentRoute;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    onNavigate(m.route);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    textAlign: 'left',
                    background: isActive ? 'linear-gradient(90deg, rgba(234, 88, 12, 0.25) 0%, rgba(234, 88, 12, 0.08) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(234, 88, 12, 0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: isActive ? '#FFFFFF' : '#D6D3D1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#282320';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isActive ? '#EA580C' : '#78716C',
                      background: isActive ? '#FFFFFF' : '#282320',
                      borderRadius: '5px',
                      padding: '2px 6px',
                      minWidth: '24px',
                      textAlign: 'center'
                    }}
                  >
                    {m.num}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: isActive ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.icon} {m.title.split('&')[0].trim()}
                    </div>
                  </div>
                  {isActive && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EA580C' }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Module Table of Contents */}
          <div style={{ borderTop: '1px solid #2E2926', paddingTop: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 10px' }}>
              <span style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C', letterSpacing: '0.5px' }}>
                ACTIVE MODULE TOC (MOD {activeMod.num})
              </span>
              <span style={{ fontSize: '10px', color: '#78716C', fontFamily: "'JetBrains Mono', monospace" }}>
                {activeMod.sections.length} SECTIONS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activeMod.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onNavigate(activeMod.route, sec.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11.5px',
                    color: '#A8A29E',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EA580C';
                    e.currentTarget.style.background = '#282320';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A8A29E';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ color: '#EA580C', marginRight: '6px', fontWeight: 600 }}>&bull;</span>
                  {sec.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tools Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #2E2926', background: '#161412' }}>
          <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#78716C', marginBottom: '8px' }}>
            KEY SUB-SYSTEM SHORTCUTS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => onNavigate('/04-hld', 'm4-s1')}
              style={{
                background: currentRoute === '/04-hld' ? '#EA580C' : '#24201D',
                color: currentRoute === '/04-hld' ? '#FFFFFF' : '#D6D3D1',
                border: '1px solid #3E3834',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              📐 Mermaid HLD
            </button>
            <button
              onClick={() => onNavigate('/03-privacy-shield', 'm3-s2')}
              style={{
                background: currentRoute === '/03-privacy-shield' ? '#EA580C' : '#24201D',
                color: currentRoute === '/03-privacy-shield' ? '#FFFFFF' : '#D6D3D1',
                border: '1px solid #3E3834',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              🛡️ Privacy Sim
            </button>
            <button
              onClick={() => onNavigate('/01-strategy', 'm1-s2')}
              style={{
                background: currentRoute === '/01-strategy' ? '#EA580C' : '#24201D',
                color: currentRoute === '/01-strategy' ? '#FFFFFF' : '#D6D3D1',
                border: '1px solid #3E3834',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              📊 100-Pt Rubric
            </button>
            <button
              onClick={() => onNavigate('/06-roadmap', 'm6-roadmap')}
              style={{
                background: currentRoute === '/06-roadmap' ? '#EA580C' : '#24201D',
                color: currentRoute === '/06-roadmap' ? '#FFFFFF' : '#D6D3D1',
                border: '1px solid #3E3834',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              ⏱️ 36h Sprint
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
