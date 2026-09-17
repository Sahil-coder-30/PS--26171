import React, { useState, useEffect } from 'react';
import { MODULES_DATA } from './data/modulesData';
import { Sidebar } from './components/Sidebar';
import { Module00Vision } from './pages/Module00Vision';
import { Module01Strategy } from './pages/Module01Strategy';
import { Module02AgentEngine } from './pages/Module02AgentEngine';
import { Module03PrivacyShield } from './pages/Module03PrivacyShield';
import { Module04ArchitectureHLD } from './pages/Module04ArchitectureHLD';
import { Module05ExtensionMV3 } from './pages/Module05ExtensionMV3';
import { Module06HackathonJury } from './pages/Module06HackathonJury';

export const App: React.FC = () => {
  // Parse initial route from URL hash
  const getInitialRoute = (): { route: string; sectionId?: string } => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return { route: '/00-vision' };
    const parts = hash.split('#');
    const routePart = parts[0].startsWith('/') ? parts[0] : `/${parts[0]}`;
    const valid = MODULES_DATA.some((m) => m.route === routePart);
    return {
      route: valid ? routePart : '/00-vision',
      sectionId: parts[1] || undefined
    };
  };

  const initial = getInitialRoute();
  const [currentRoute, setCurrentRoute] = useState<string>(initial.route);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Sync route on hash change (back/forward browser buttons, direct links)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = getInitialRoute();
      setCurrentRoute(parsed.route);
      if (parsed.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(parsed.sectionId!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  // Handle programmatic navigation
  const handleNavigate = (route: string, sectionId?: string) => {
    setCurrentRoute(route);
    if (sectionId) {
      window.location.hash = `#${route}#${sectionId}`;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.location.hash = `#${route}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render the appropriate active module component
  const renderActiveModulePage = () => {
    switch (currentRoute) {
      case '/00-vision':
        return <Module00Vision onNavigate={handleNavigate} />;
      case '/01-strategy':
        return <Module01Strategy onNavigate={handleNavigate} />;
      case '/02-browser-agent':
        return <Module02AgentEngine onNavigate={handleNavigate} />;
      case '/03-privacy-shield':
        return <Module03PrivacyShield onNavigate={handleNavigate} />;
      case '/04-hld':
        return <Module04ArchitectureHLD onNavigate={handleNavigate} />;
      case '/05-extension':
        return <Module05ExtensionMV3 onNavigate={handleNavigate} />;
      case '/06-roadmap':
        return <Module06HackathonJury onNavigate={handleNavigate} />;
      default:
        return <Module00Vision onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative', background: 'var(--bg-warm)' }}>
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

      {/* Mobile Header Bar */}
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
          borderBottom: '1px solid #332E2A',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🚀</span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '15px' }}>
            PRATYAKSHA
          </span>
          <span style={{ fontSize: '11px', color: '#EA580C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            {currentRoute.replace('/', '').toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Menu ☰
        </button>
      </header>

      {/* Obsidian Sidebar with Module Routing */}
      <Sidebar
        modules={MODULES_DATA}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Warm Cream Canvas (Renders ONLY Active Module) */}
      <main
        className="main-wrap"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '40px 48px',
          background: 'var(--bg-warm)'
        }}
      >
        {renderActiveModulePage()}
      </main>
    </div>
  );
};

export default App;
