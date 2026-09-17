import React, { useState } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { Sidebar } from './components/Sidebar';
import { MasterHero } from './components/MasterHero';
import { ArchitectureInspector } from './components/ArchitectureInspector';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('m0-overview');

  const handleSelectModule = (modNum: string) => {
    setActiveModule(modNum);
  };

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredModules = MODULES_DATA.filter((m) => {
    if (activeModule !== 'all' && m.num !== activeModule) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      m.sections.some(
        (s) => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar
        modules={MODULES_DATA}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      <main className="main-wrap">
        <MasterHero modules={MODULES_DATA} onSelectModule={handleSelectModule} />

        <ArchitectureInspector />

        <div className="modules-container">
          {filteredModules.map((m) => (
            <div key={m.id} className="doc-module" id={m.id}>
              <div style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-warm)',
                borderRadius: '16px',
                padding: '28px 32px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    background: 'var(--isro-orange)',
                    color: '#FFFFFF',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    MODULE {m.num}
                  </span>
                  <span style={{
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {m.badge}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '8px'
                }}>
                  {m.icon} {m.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {m.desc}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  {m.sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      style={{
                        background: '#FAF7F2',
                        border: '1px solid #E7E0D6',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onClick={() => setActiveSection(sec.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span>{sec.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}>
                          {sec.title}
                        </h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {sec.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
