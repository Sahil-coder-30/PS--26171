import React from 'react';
import { SprintTimeline } from '../components/SprintTimeline';
import { JudgeDefenseMatrix } from '../components/JudgeDefenseMatrix';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module06HackathonJury: React.FC<Props> = ({ onNavigate }) => {
  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 06: Hackathon Delivery Roadmap &amp; Jury Defense</span>
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
            MODULE 06
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
            JURY PROTOCOL &amp; ROADMAP
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
            ✓ 100% COMPLETE ROADMAP
          </span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          ⏱️ Hackathon Delivery Roadmap &amp; Judge Defense Protocol
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          The complete 36-hour sprint execution timeline divided across 4 phases, along with the official jury defense cheat sheet providing mathematical answers to tough evaluator challenges.
        </p>
      </header>

      {/* SECTION 1: 36-HOUR SPRINT TIMELINE */}
      <section id="roadmap" className="doc-section" style={{ marginBottom: '56px' }}>
        <div className="section-header">
          <div className="section-icon-badge">⏱️</div>
          <h2 className="section-title">01. 36-Hour Hackathon Delivery Timeline &amp; Milestones</h2>
        </div>
        <p className="section-lead">
          The 36-hour hackathon execution plan is divided into 4 high-velocity 9-hour phases with strict verification gates:
        </p>

        <SprintTimeline />
      </section>

      {/* SECTION 2: JUDGE DEFENSE CHEAT SHEET */}
      <section id="defense" className="doc-section" style={{ marginBottom: '56px' }}>
        <div className="section-header">
          <div className="section-icon-badge">🛡️</div>
          <h2 className="section-title">02. Judge Defense Cheat Sheet &amp; Winning Answers</h2>
        </div>
        <p className="section-lead">
          Tough jury questions anticipated during ISRO SAC evaluation, paired with decisive technical counter-arguments:
        </p>

        <JudgeDefenseMatrix />
      </section>

      {/* SECTION 3: 60-SECOND CLOSING ELEVATOR PITCH */}
      <section id="pitch" className="doc-section" style={{ marginBottom: '56px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
          color: '#FAF8F5',
          borderRadius: '16px',
          padding: '32px 36px',
          border: '1px solid #44403C'
        }}>
          <span style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            03. 60-SECOND CLOSING ELEVATOR PITCH
          </span>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', margin: '14px 0 10px', color: '#FFFFFF' }}>
            Why PRATYAKSHA Wins SIH PS-26171
          </h3>
          <p style={{ fontSize: '14.5px', color: '#D6D3D1', lineHeight: 1.7, margin: 0 }}>
            &ldquo;Honorable judges, conventional browser agents like Adept and Browser-Use are non-starters for Indian national security because they stream unredacted screenshots of citizen Aadhaar, bank records, and space procurement contracts to third-party US cloud APIs. <strong>PRATYAKSHA solves this permanently with on-device WebGPU neural redaction in under 62 milliseconds.</strong> Raw PII never leaves the workstation RAM. The cloud reasoning cluster receives only synthetic tokens, and local rehydration restores real values only during synthetic DOM keystrokes. It is 100% compliant with the DPDP Act 2023, runs air-gapped on ISRO infrastructure, and delivers zero-compromise autonomy for India&apos;s space mission.&rdquo;
          </p>
        </div>
      </section>

      {/* Pagination Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '24px 0',
        borderTop: '1px solid var(--border-warm)',
        marginTop: '60px'
      }}>
        <button
          onClick={() => onNavigate('/05-extension')}
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
          &larr; Previous: Module 05 (Extension MV3)
        </button>
      </footer>
    </article>
  );
};
