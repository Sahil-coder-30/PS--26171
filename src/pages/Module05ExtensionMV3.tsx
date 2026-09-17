import React from 'react';
import { EXTENSION_HTML } from '../data/rawHtml/extensionHtml';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module05ExtensionMV3: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 05: Chrome Manifest V3 Extension Codebase</span>
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
            MODULE 05
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
            CHROME MV3 CODEBASE
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
          🧩 Manifest V3 Browser Extension &amp; Privacy Shield Implementation
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          Complete 12-section technical implementation guide for the Chrome Manifest V3 extension: service worker, WebGPU offscreen worker, message passing, screen capture, DOM extraction, local vault layer, CSP, and side panel UI.
        </p>
      </header>

      {/* SECTION 1: STRATEGIC RATIONALE */}
      <section id="s1" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s1 }} />
      </section>

      {/* SECTION 2: MV3 ARCHITECTURE */}
      <section id="s2" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s2 }} />
      </section>

      {/* SECTION 3: FILE STRUCTURE */}
      <section id="s3" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s3 }} />
      </section>

      {/* SECTION 4: EXTENSION COMPONENTS */}
      <section id="s4" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s4 }} />
      </section>

      {/* SECTION 5: MESSAGE PASSING */}
      <section id="s5" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s5 }} />
      </section>

      {/* SECTION 6: SCREEN CAPTURE PIPELINE */}
      <section id="s6" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s6 }} />
      </section>

      {/* SECTION 7: DOM EXTRACTION STRATEGY */}
      <section id="s7" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s7 }} />
      </section>

      {/* SECTION 8: WEBGPU IN EXTENSION */}
      <section id="s8" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s8 }} />
      </section>

      {/* SECTION 9: VAULT & PRIVACY LAYER */}
      <section id="s9" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s9 }} />
      </section>

      {/* SECTION 10: PERMISSIONS & CSP */}
      <section id="s10" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s10 }} />
      </section>

      {/* SECTION 11: SIDE PANEL UI */}
      <section id="s11" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s11 }} />
      </section>

      {/* SECTION 12: BUILD & DISTRIBUTION */}
      <section id="s12" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: EXTENSION_HTML.s12 }} />
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
          onClick={() => onNavigate('/04-hld')}
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
          &larr; Previous: Module 04 (Architecture HLD)
        </button>

        <button
          onClick={() => onNavigate('/06-roadmap')}
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
          Next: Module 06 (Hackathon Jury) &rarr;
        </button>
      </footer>
    </article>
  );
};
