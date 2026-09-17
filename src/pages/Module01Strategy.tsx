import React from 'react';
import { MermaidView } from '../components/MermaidView';
import { RubricCalculator } from '../components/RubricCalculator';
import { MASTER_PLAN_MERMAID } from '../data/mermaidDiagrams';

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
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          🎯 Master Plan, Strategy &amp; Competitive Moats
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          The strategic master plan aligns our dual-stream architecture directly with Smart India Hackathon (SIH 2024) judging criteria, establishing defensible competitive moats against generic cloud-based browser automation frameworks.
        </p>
      </header>

      {/* SECTION 1: EXECUTIVE CONTEXT */}
      <section id="m1-s1" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 01</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Executive Overview &amp; National Space Context
        </h2>
        <div className="callout info" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '18px 22px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
            <div>
              <strong style={{ color: '#1E40AF', fontSize: '14px' }}>ISRO SAC Mandate (Problem Statement 26171):</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#1E3A8A', lineHeight: 1.6 }}>
                National aerospace procurement systems (GeM, ISRO SAC e-procurement portals) process classified payloads, tender specifications, and vendor bank credentials. Deploying cloud-dependent browser agents introduces severe data sovereignty vulnerabilities. PRATYAKSHA ensures 100% on-premise, zero-trust sovereign automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 100-POINT RUBRIC CALCULATOR */}
      <section id="m1-s2" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 02</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          100-Point Evaluation Rubric Breakdown
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
          Use the interactive scoring tool below to verify our 100-point alignment across Technical Innovation, Privacy Compliance, Portal Robustness, Self-Healing, and Production Readiness:
        </p>

        <RubricCalculator />
      </section>

      {/* SECTION 3: MASTER PLAN MERMAID FLOWCHART */}
      <section id="m1-s3" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 03</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Master Plan Architecture Flowchart (Mermaid)
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
          This flowchart models the end-to-end execution path from operator intent submission in the Chrome Side Panel, down through local WebGPU redactors, into the air-gapped sovereign cluster, and back for verified local rehydration:
        </p>

        <MermaidView
          id="master-plan-chart"
          chart={MASTER_PLAN_MERMAID}
          title="PRATYAKSHA Strategic Execution Flowchart"
          subtitle="Mermaid 10 interactive diagram — pan, zoom, inspect client-to-cloud boundary"
        />
      </section>

      {/* SECTION 4: COMPETITIVE MOATS */}
      <section id="m1-s4" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 04</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Competitive Moats vs Generic Cloud Agents
        </h2>

        <div className="table-container" style={{ overflowX: 'auto', border: '1px solid var(--border-warm)', borderRadius: '12px', background: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--border-warm)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Evaluation Criterion</th>
                <th style={{ padding: '12px 16px' }}>Browser-Use / Adept</th>
                <th style={{ padding: '12px 16px' }}>OpenAI Operator</th>
                <th style={{ padding: '12px 16px', background: '#FFF7ED', color: '#EA580C' }}>PRATYAKSHA (Our Solution)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>PII Data Privacy</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ Raw viewports streamed to US cloud</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ Cloud telemetry logging</td>
                <td style={{ padding: '12px 16px', background: '#FFF7ED', color: '#059669', fontWeight: 700 }}>✅ 0.00% PII Egress (On-Device WebGPU)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>Canvas &amp; Complex Portal OCR</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ DOM-only blind spots</td>
                <td style={{ padding: '12px 16px', color: '#D97706' }}>⚠️ Latent cloud VLM inference</td>
                <td style={{ padding: '12px 16px', background: '#FFF7ED', color: '#059669', fontWeight: 700 }}>✅ Dual-Stream Fusion + Indic CRNN</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>State Resilience</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ Unchecked ReAct loops</td>
                <td style={{ padding: '12px 16px', color: '#D97706' }}>⚠️ Proprietary black box</td>
                <td style={{ padding: '12px 16px', background: '#FFF7ED', color: '#059669', fontWeight: 700 }}>✅ LangGraph DAG + 12-Turn Rollback</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>Deployment Sovereignty</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ SaaS only</td>
                <td style={{ padding: '12px 16px', color: '#DC2626' }}>❌ Cloud API only</td>
                <td style={{ padding: '12px 16px', background: '#FFF7ED', color: '#059669', fontWeight: 700 }}>✅ 100% Air-Gapped Intranet Deployable</td>
              </tr>
            </tbody>
          </table>
        </div>
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
