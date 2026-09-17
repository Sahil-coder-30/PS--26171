import React from 'react';
import { PrivacyShieldSimulator } from '../components/PrivacyShieldSimulator';
import { PERCEPTION_HTML } from '../data/rawHtml/perceptionHtml';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module03PrivacyShield: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 03: Dual-Channel Perception Shield &amp; WebGPU Vault</span>
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
            MODULE 03
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
            WEBGPU NEURAL PRIVACY
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
          🛡️ Dual-Channel Perception Shield &amp; WebGPU Privacy Vault
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          Deep perception problem analysis: the 7 fatal blindspots of DOM-only agents, capability comparison matrix, cascaded 8&times;8 dirty-tile hash filter, 4 local vision models, Indian sovereign PII rule engine, and full TypeScript perceive loop.
        </p>
      </header>

      {/* SECTION 1: THE 7 FATAL BLINDSPOTS */}
      <section id="blindspots" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML.blindspots }} />
      </section>

      {/* SECTION 2: CAPABILITY MATRIX */}
      <section id="dual-channel" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML['dual-channel'] }} />
      </section>

      {/* Interactive WebGPU Privacy Simulator Sandbox */}
      <section style={{ marginBottom: '56px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
          border: '1px solid var(--border-warm)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px'
        }}>
          <span style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '5px'
          }}>
            LIVE INTERACTIVE SIMULATOR
          </span>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', margin: '10px 0 6px', color: 'var(--text-main)' }}>
            Test On-Device WebGPU Zero-Egress Sanitization in Real Time
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
            Input citizen credentials below to watch the Verhoeff algorithm, AES-256 token vault, and safety halo redactor execute in local RAM:
          </p>
          <PrivacyShieldSimulator />
        </div>
      </section>

      {/* SECTION 3: DIRT TILES DIFF FILTER */}
      <section id="dirty-tiles" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML['dirty-tiles'] }} />
      </section>

      {/* SECTION 4: FOUR LOCAL VISION MODELS */}
      <section id="models" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML.models }} />
      </section>

      {/* SECTION 5: INDIAN SOVEREIGN PII RULE ENGINE */}
      <section id="rule-engine" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML['rule-engine'] }} />
      </section>

      {/* SECTION 6: COMPLETE PERCEIVE STEP */}
      <section id="complete-perceive" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: PERCEPTION_HTML['complete-perceive'] }} />
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
          onClick={() => onNavigate('/02-browser-agent')}
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
          &larr; Previous: Module 02 (Browser Agent)
        </button>

        <button
          onClick={() => onNavigate('/04-hld')}
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
          Next: Module 04 (High-Level Architecture) &rarr;
        </button>
      </footer>
    </article>
  );
};
