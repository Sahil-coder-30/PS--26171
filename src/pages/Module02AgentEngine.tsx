import React from 'react';
import { BROWSER_AGENT_HTML } from '../data/rawHtml/browserAgentHtml';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module02AgentEngine: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 02: Browser Agent Autonomous Execution Engine</span>
      </nav>

      {/* Hero Banner */}
      <header style={{
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 60%, #EFF6FF 100%)',
        border: '1px solid var(--border-warm)',
        borderRadius: '20px',
        padding: '36px 40px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11.5px',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            MODULE 02
          </span>
          <span style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-warm)',
            color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            padding: '3px 10px',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            AGENT ENGINE &amp; PERCEPTION
          </span>
          <span style={{
            background: '#D1FAE5',
            color: '#047857',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            padding: '3px 10px',
            borderRadius: '6px',
            fontWeight: 700
          }}>
            ✓ 100% COMPLETE SPECIFICATION
          </span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          🤖 Autonomous Browser Agent Execution Engine
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          Exhaustive technical specification of the autonomous browser agent: dual-stream perception, action execution engine, reversible vault rehydration, security hardening, wire protocol, and ISRO demo scenario.
        </p>
      </header>

      {/* SECTION 1: WHAT IS A BROWSER AGENT */}
      <section id="what-is-agent" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['what-is-agent'] }} />
      </section>

      {/* SECTION 2: MV3 ARCHITECTURE */}
      <section id="mv3-arch" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['mv3-arch'] }} />
      </section>

      {/* SECTION 3: PERCEPTION LOOP */}
      <section id="perception-loop" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['perception-loop'] }} />
      </section>

      {/* SECTION 4: ACTION ENGINE */}
      <section id="action-engine" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['action-engine'] }} />
      </section>

      {/* SECTION 5: REHYDRATION VAULT */}
      <section id="rehydration" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['rehydration'] }} />
      </section>

      {/* SECTION 6: SECURITY & HARDENING */}
      <section id="security" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['security'] }} />
      </section>

      {/* SECTION 7: WIRE PROTOCOL */}
      <section id="wire-protocol" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['wire-protocol'] }} />
      </section>

      {/* SECTION 8: DEMO FLOW */}
      <section id="demo-flow" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: BROWSER_AGENT_HTML['demo-flow'] }} />
      </section>

      {/* Pagination Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
        borderTop: '1px solid var(--border-warm)',
        marginTop: '60px'
      }}>
        <button
          onClick={() => onNavigate('/01-strategy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid var(--border-warm)',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          &larr; Previous: Module 01 (Strategy)
        </button>

        <button
          onClick={() => onNavigate('/03-privacy-shield')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--isro-orange)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          Next: Module 03 (Privacy Shield) &rarr;
        </button>
      </footer>
    </article>
  );
};
