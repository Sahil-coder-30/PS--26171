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
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  activeModule,
  onSelectModule,
  searchQuery,
  onSearchChange,
  activeSection,
  onSelectSection
}) => {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">ISRO SAC PS-26171</div>
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
                  onClick={() => onSelectModule(m.num)}
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
  );
};
