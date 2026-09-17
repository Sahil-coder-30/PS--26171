import React from 'react';
import type { DocModule } from '../types';

interface SidebarProps {
  modules: DocModule[];
  activeModule: string;
  onSelectModule: (modNum: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeSection: string;
  onSelectSection: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  activeModule,
  onSelectModule,
  searchQuery,
  onSearchChange,
  activeSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile
}) => {
  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      <aside
        className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
        id="sidebar"
        style={{
          transform: isOpenMobile !== undefined ? (isOpenMobile ? 'translateX(0)' : undefined) : undefined
        }}
      >
        <div className="sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="brand-badge">ISRO SAC PS-26171</div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'none'
                }}
                className="mobile-close-btn"
              >
                ✕
              </button>
            )}
          </div>
          <h1 className="sidebar-title">PRATYAKSHA</h1>
          <p className="sidebar-subtitle">Autonomous Browser Agent with WebGPU On-Device Privacy Shield</p>
          <div className="sidebar-status-tag">
            <span className="pulse-dot"></span> REACT APP LIVE
          </div>
        </div>

        <div className="sidebar-search-box">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search 55 sections..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="module-filter-bar">
          <button
            className={`mod-filter-btn ${activeModule === 'all' ? 'active' : ''}`}
            onClick={() => onSelectModule('all')}
          >
            ALL
          </button>
          {modules.map((m) => (
            <button
              key={m.num}
              className={`mod-filter-btn ${activeModule === m.num ? 'active' : ''}`}
              onClick={() => onSelectModule(m.num)}
            >
              {m.num}
            </button>
          ))}
        </div>

        <nav className="sidebar-toc" id="sidebarToc">
          {modules
            .filter((m) => activeModule === 'all' || activeModule === m.num)
            .map((m) => (
              <div key={m.id} className="toc-group" data-group-module={m.num}>
                <div className="toc-group-header">
                  <span className="toc-group-num">{m.num}</span>
                  <a
                    href={`#${m.id}`}
                    className="toc-group-title"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectModule(m.num);
                      if (onCloseMobile) onCloseMobile();
                    }}
                  >
                    {m.title}
                  </a>
                </div>
                <div className="toc-sublinks">
                  {m.sections
                    .filter((sec) =>
                      !searchQuery ||
                      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      sec.summary.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className={`sidebar-toc-link ${activeSection === sec.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectSection(sec.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                      >
                        <span className="toc-sec-icon">{sec.icon}</span>
                        <span className="toc-sec-text">{sec.title}</span>
                      </a>
                    ))}
                </div>
              </div>
            ))}
        </nav>

        <div className="sidebar-footer">
          <span>7 Modules · 55 Sections</span>
          <span className="footer-pill">REACT MASTER PLAN</span>
        </div>
      </aside>
    </>
  );
};
