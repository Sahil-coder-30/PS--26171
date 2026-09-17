import React, { useState } from 'react';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module02AgentEngine: React.FC<Props> = ({ onNavigate }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const actionJsonSchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PratyakshaActionFrame",
  "type": "object",
  "required": ["turn_id", "action_type", "confidence"],
  "properties": {
    "turn_id": { "type": "integer" },
    "action_type": {
      "type": "string",
      "enum": ["CLICK", "INPUT", "SELECT", "SCROLL", "WAIT", "NAVIGATE", "ASSERT", "SUBMIT_GATE"]
    },
    "target": {
      "type": "object",
      "properties": {
        "dom_node_id": { "type": "integer" },
        "css_selector": { "type": "string" },
        "bounding_box": {
          "type": "array",
          "items": { "type": "number" },
          "minItems": 4,
          "maxItems": 4
        }
      }
    },
    "payload": {
      "type": "object",
      "properties": {
        "vault_token": { "type": "string", "pattern": "^<VAULT_[A-Z0-9_]+>$" },
        "raw_fallback_text": { "type": "string" },
        "key_event": { "type": "string" }
      }
    },
    "risk_level": { "type": "string", "enum": ["L1_SAFE", "L2_MUTATION", "L3_CRITICAL"] },
    "confidence": { "type": "number", "minimum": 0.0, "maximum": 1.0 }
  }
}`;

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
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          🤖 Autonomous Browser Agent Execution Engine
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          Deep technical dive into the dual-stream perception pipeline, atomic action space contracts, LangGraph state machine orchestration DAG, and closed-loop self-healing error recovery.
        </p>
      </header>

      {/* SECTION 1: DUAL CHANNEL PERCEPTION */}
      <section id="m2-s1" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 01</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Dual-Channel Perception Architecture
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', margin: '20px 0' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ color: '#2563EB', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              CHANNEL A: STRUCTURAL DOM TREE
            </div>
            <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontFamily: "'Outfit', sans-serif", color: 'var(--text-main)' }}>
              Accessibility &amp; Interactive Node Graph
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Traverses the live DOM using a non-intrusive TreeWalker. Filters out invisible elements, computes layout bounding rectangles via <code>getBoundingClientRect()</code>, and tags interactive controls (buttons, inputs, dropdowns) with deterministic IDs.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ color: '#EA580C', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              CHANNEL B: VISUAL BITMAP RENDER
            </div>
            <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontFamily: "'Outfit', sans-serif", color: 'var(--text-main)' }}>
              Pixel Canvas &amp; WebGL Surface
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Captures rendered viewport pixels via <code>chrome.tabs.captureVisibleTab()</code>. Crucial for HTML5 Canvas elements, interactive GIS satellite layers, custom SVG charts, and embedded PDF tender documents where the DOM has zero text nodes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACTION SCHEMA */}
      <section id="m2-s2" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 02</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Action Schema &amp; Atomic Commands Contract
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
          Actions emitted by the reasoning cluster conform to a rigorous JSON Schema. Each action is typed, bound to target bounding boxes or selectors, and tagged with risk severity:
        </p>

        <div style={{ background: '#1C1917', borderRadius: '14px', padding: '20px', border: '1px solid #332E2A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#059669', fontWeight: 700 }}>
              JSON SCHEMA: PratyakshaActionFrame
            </span>
            <button
              onClick={() => copyCode(actionJsonSchema, 'action-schema')}
              style={{
                background: copiedKey === 'action-schema' ? '#059669' : '#2E2926',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer'
              }}
            >
              {copiedKey === 'action-schema' ? '✓ Copied' : 'Copy Schema'}
            </button>
          </div>
          <pre style={{ margin: 0, overflowX: 'auto', fontSize: '11.5px', color: '#F5F5F4', lineHeight: 1.5 }}>
            <code>{actionJsonSchema}</code>
          </pre>
        </div>
      </section>

      {/* SECTION 3: LANGGRAPH STATE MACHINE */}
      <section id="m2-s3" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 03</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          LangGraph State Orchestration Graph
        </h2>

        <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '14px', padding: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
            Unlike brittle unbounded loops, PRATYAKSHA utilizes an explicit state graph powered by LangGraph. Each step is a validated state transition:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#EA580C', fontSize: '13.5px', fontFamily: "'Outfit', sans-serif" }}>Node 1: Perceive</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Ingests sanitized tokens &amp; dirty-tile diffs.</p>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#2563EB', fontSize: '13.5px', fontFamily: "'Outfit', sans-serif" }}>Node 2: Plan &amp; Reason</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Qwen2.5-VL generates candidate action hypothesis.</p>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#7C3AED', fontSize: '13.5px', fontFamily: "'Outfit', sans-serif" }}>Node 3: Safety Guard</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>OPA checks financial and data alteration constraints.</p>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#059669', fontSize: '13.5px', fontFamily: "'Outfit', sans-serif" }}>Node 4: Dispatch &amp; Verify</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Dispatches event, watches DOM mutation to confirm effect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SELF HEALING */}
      <section id="m2-s4" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 04</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Self-Healing &amp; Error Recovery Loop
        </h2>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '14px', padding: '24px' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
            When a government portal triggers an asynchronous validation toast, dynamic modal dialog, or shifts form inputs after an AJAX call:
          </p>
          <ul style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '18px', margin: '10px 0 0' }}>
            <li><strong>MutationObserver Re-anchoring:</strong> If target selector coordinates shifted by &gt;10px, the engine re-computes bounding boxes before firing click events.</li>
            <li><strong>12-Turn Checkpoint Rollback:</strong> When an unrecoverable validation error occurs, LangGraph rolls back state to the previous stable snapshot without losing session cookies.</li>
            <li><strong>Heuristic Form Recovery:</strong> Detects misplaced focus states and re-issues focus/blur synthetic sequences to trigger Angular/React synthetic state binders.</li>
          </ul>
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
