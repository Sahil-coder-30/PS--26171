import React from 'react';
import { MermaidView } from '../components/MermaidView';
import { RubricCalculator } from '../components/RubricCalculator';
import { MASTER_PLAN_MERMAID } from '../data/mermaidDiagrams';
import { MASTER_PLAN_HTML } from '../data/rawHtml/masterPlanHtml';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module01Strategy: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 01: Master Plan &amp; 100-Point Strategy</span>
      </nav>

      {/* Hero Header */}
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
            MODULE 01
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
            EVALUATION &amp; STRATEGY
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
          🎯 Master Plan, Strategy &amp; Competitive Moats
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          The strategic master plan aligns our dual-stream architecture directly with Smart India Hackathon (SIH 2024) judging criteria, establishing defensible competitive moats against generic cloud-based browser automation frameworks.
        </p>
      </header>

      {/* SECTION 1: OVERVIEW & CENTRAL CRISIS */}
      <section id="overview" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.overview }} />
      </section>

      {/* SECTION 2: 100-POINT EVALUATION RUBRIC */}
      <section id="rubric" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.rubric }} />

        {/* Interactive Rubric Calculator */}
        <div style={{ marginTop: '28px' }}>
          <RubricCalculator />
        </div>
      </section>

      {/* SECTION 3: MARKET ANALYSIS */}
      <section id="market" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.market }} />
      </section>

      {/* SECTION 4: FULL SYSTEM ARCHITECTURE & MERMAID FLOWCHART */}
      <section id="architecture" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.architecture_part1 || MASTER_PLAN_HTML.architecture }} />

        {/* Authentic Master Plan Mermaid Flowchart */}
        <MermaidView
          id="master-plan-canvas"
          chart={MASTER_PLAN_MERMAID}
          title="PRATYAKSHA Strategic Execution Flowchart"
          subtitle="Mermaid 10 interactive diagram — pan, zoom, inspect client-to-cloud boundary"
        />

        {MASTER_PLAN_HTML.architecture_part2 && (
          <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.architecture_part2 }} />
        )}
      </section>

      {/* SECTION 5: ON-DEVICE MODEL PIPELINE */}
      <section id="models" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.models }} />
      </section>

      {/* SECTION 6: 6 CORE INNOVATIONS & COMPETITIVE MOATS */}
      <section id="innovations" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.innovations }} />
      </section>

      {/* SECTION 7: TARGET BENCHMARK METRICS */}
      <section id="metrics" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.metrics }} />
      </section>

      {/* SECTION 8: SPRINT PLAN */}
      <section id="sprint" className="doc-section" style={{ marginBottom: '56px' }}>
        <div dangerouslySetInnerHTML={{ __html: MASTER_PLAN_HTML.sprint }} />
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
          onClick={() => onNavigate('/00-vision')}
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
          &larr; Previous: Module 00 (Vision)
        </button>

        <button
          onClick={() => onNavigate('/02-browser-agent')}
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
          Next: Module 02 (Browser Agent) &rarr;
        </button>
      </footer>
    </article>
  );
};
