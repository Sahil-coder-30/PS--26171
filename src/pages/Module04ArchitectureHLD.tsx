import React from 'react';
import { MermaidView } from '../components/MermaidView';
import { ArchitectureInspector } from '../components/ArchitectureInspector';
import { HLD_ARCHITECTURE_MERMAID, HLD_SEQUENCE_MERMAID } from '../data/mermaidDiagrams';
import { HLD_HTML } from '../data/rawHtml/hldHtml';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module04ArchitectureHLD: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 04: High-Level System Architecture (HLD)</span>
      </nav>

      {/* Module Hero Banner */}
      <header style={{
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 60%, #EFF6FF 100%)',
        border: '1px solid var(--border-warm)',
        borderRadius: '20px',
        padding: '36px 40px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative'
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
            MODULE 04
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
            4-TIER SOVEREIGN ARCHITECTURE
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
          📐 High-Level Architecture &amp; Microservices Specification
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          PRATYAKSHA is a hybrid local-cloud autonomous browser agent engineered for ISRO SAC (PS-26171). The complete 10-section system design document is presented below with authentic Mermaid 10 diagrams on interactive PanZoom canvases.
        </p>

        {/* Stat Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '24px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>INGRESS PRIVACY FILTER</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C', fontFamily: "'Outfit', sans-serif" }}>0.00% PII Egress</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>LOCAL INFERENCE LATENCY</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', fontFamily: "'Outfit', sans-serif" }}>62ms WebGPU Latency</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>REASONING CLUSTER</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669', fontFamily: "'Outfit', sans-serif" }}>LangGraph DAG</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>PORTAL COMPATIBILITY</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED', fontFamily: "'Outfit', sans-serif" }}>GeM · SAKSHAM · ISRO</div>
          </div>
        </div>
      </header>

      {/* SECTION 1: SYSTEM OVERVIEW & ARCHITECTURE TOPOLOGY */}
      <section id="s1" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s1_part1 || HLD_HTML.s1 }} />

        {/* Authentic Mermaid Architecture Diagram on PanZoom Canvas */}
        <MermaidView
          id="hld-topology-canvas"
          chart={HLD_ARCHITECTURE_MERMAID}
          title="PRATYAKSHA 4-Tier Sovereign Architecture Topology"
          subtitle="Drag to pan, use mouse wheel or 2-finger pinch to zoom centered at cursor, click buttons for reset"
        />

        {HLD_HTML.s1_part2 && (
          <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s1_part2 }} />
        )}
      </section>

      {/* SECTION 2: MICROSERVICES INVENTORY */}
      <section id="s2" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s2 }} />

        {/* Interactive Microservices Telemetry Inspector */}
        <div style={{ marginTop: '28px' }}>
          <ArchitectureInspector />
        </div>
      </section>

      {/* SECTION 3: 7-STEP DATA-FLOW ARCHITECTURE */}
      <section id="s3" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s3_part1 || HLD_HTML.s3 }} />

        {/* Authentic Mermaid Sequence Diagram on PanZoom Canvas */}
        <MermaidView
          id="hld-sequence-canvas"
          chart={HLD_SEQUENCE_MERMAID}
          title="PRATYAKSHA 7-Step / 15-Call Operational Sequence Flow"
          subtitle="End-to-end cryptographic call stack between user, client extension, vault, gateway, LangGraph, and VLM"
        />

        {HLD_HTML.s3_part2 && (
          <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s3_part2 }} />
        )}
      </section>

      {/* SECTION 4: API CONTRACT SPECIFICATION */}
      <section id="s4" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s4 }} />
      </section>

      {/* SECTION 5: SECURITY ARCHITECTURE */}
      <section id="s5" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s5 }} />
      </section>

      {/* SECTION 6: DATA STORAGE DESIGN */}
      <section id="s6" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s6 }} />
      </section>

      {/* SECTION 7: DEPLOYMENT TOPOLOGY */}
      <section id="s7" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s7 }} />
      </section>

      {/* SECTION 8: SCALABILITY & RESILIENCE */}
      <section id="s8" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s8 }} />
      </section>

      {/* SECTION 9: ARCHITECTURE DECISION RECORDS (ADRs) */}
      <section id="s9" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s9 }} />
      </section>

      {/* SECTION 10: BUILD ROADMAP — SPRINT PLAN */}
      <section id="s10" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: HLD_HTML.s10 }} />
      </section>

      {/* Module Pagination Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
        borderTop: '1px solid var(--border-warm)',
        marginTop: '60px'
      }}>
        <button
          onClick={() => onNavigate('/03-privacy-shield')}
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
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          &larr; Previous: Module 03 (Privacy Shield)
        </button>

        <button
          onClick={() => onNavigate('/05-extension')}
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
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          Next: Module 05 (Extension MV3) &rarr;
        </button>
      </footer>
    </article>
  );
};
