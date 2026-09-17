import React, { useState, useEffect } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { Sidebar } from './components/Sidebar';
import { MasterHero } from './components/MasterHero';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { PrivacyShieldSimulator } from './components/PrivacyShieldSimulator';
import { RubricCalculator } from './components/RubricCalculator';
import { SprintTimeline } from './components/SprintTimeline';
import { JudgeDefenseMatrix } from './components/JudgeDefenseMatrix';
import { ModuleDetails } from './components/ModuleDetails';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('m0-overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectModule = (modNum: string) => {
    setActiveModule(modNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* Top Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3.5px',
          background: 'linear-gradient(90deg, #EA580C 0%, #D97706 50%, #2563EB 100%)',
          zIndex: 9999,
          transition: 'width 0.1s ease'
        }}
      />

      {/* Mobile Top Header */}
      <header
        className="mobile-header"
        style={{
          display: 'none',
          position: 'sticky',
          top: 0,
          background: '#1C1917',
          color: '#FFFFFF',
          padding: '12px 18px',
          zIndex: 90,
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #332E2A'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🚀</span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '16px' }}>
            PRATYAKSHA
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Menu ☰
        </button>
      </header>

      {/* Obsidian Sidebar */}
      <Sidebar
        modules={MODULES_DATA}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Warm Cream Canvas */}
      <main className="main-wrap" style={{ flex: 1, minWidth: 0 }}>
        <MasterHero modules={MODULES_DATA} onSelectModule={handleSelectModule} />

        {/* Live Interactive Tools */}
        <PrivacyShieldSimulator />
        <ArchitectureInspector />

        {/* Module Content Views */}
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

                {/* Subsystem specific interactive modules */}
                <ModuleDetails moduleId={m.id} />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '12px',
                  marginTop: '18px'
                }}>
                  {m.sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      style={{
                        background: activeSection === sec.id ? '#FFF7ED' : '#FAF7F2',
                        border: '1px solid ' + (activeSection === sec.id ? '#FDBA74' : '#E7E0D6'),
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

        {/* Global Strategy, Rubric & Defense Modules */}
        <RubricCalculator />
        <SprintTimeline />
        <JudgeDefenseMatrix />
      </main>
    </div>
  );
};

export default App;
