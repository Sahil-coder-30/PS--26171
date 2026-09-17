import React, { useState } from 'react';
import { MermaidView } from '../components/MermaidView';
import { ArchitectureInspector } from '../components/ArchitectureInspector';
import { HLD_ARCHITECTURE_MERMAID, HLD_SEQUENCE_MERMAID } from '../data/mermaidDiagrams';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module04ArchitectureHLD: React.FC<Props> = ({ onNavigate }) => {
  const [activeDiagramTab, setActiveDiagramTab] = useState<'topology' | 'sequence'>('topology');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const restIngestSchema = `// POST /v1/agent/task — Viewport Ingestion Schema
interface ViewportIngestPayload {
  session_id: string;              // UUIDv4 active operator tab session
  turn_index: number;              // Monotonic step index [0..N]
  viewport_dimensions: {
    width: 1920;
    height: 1080;
    device_pixel_ratio: 1.0;
  };
  sanitized_viewport_b64: string;  // JPEG/WebP with pixel-blurred PII
  tokenized_dom_tree: {
    node_id: number;
    tag: string;
    computed_rect: [number, number, number, number]; // [x, y, w, h]
    interactive_role: "button" | "input" | "select" | "link";
    anonymized_text: string;       // Contains <VAULT_AADHAAR_001>
  }[];
  privacy_attestation: {
    merkle_root_hash: string;      // SHA-256 Merkle leaf of redacted regions
    raw_pii_detected_count: number;// E.g., 3 PII entities vaulted
    egress_filter_passed: true;
  };
  timestamp_utc: string;
}`;

  const wssActionSchema = `// WSS /v1/agent/action-stream — Action Frame Downlink
interface ActionDownlinkFrame {
  task_id: string;
  turn_index: number;
  action_type: "CLICK" | "TYPE" | "SCROLL" | "WAIT" | "SUBMIT_GATE";
  target_selector?: string;         // e.g. "button#bid-submit-btn"
  synthetic_tokens_to_rehydrate?: {
    token: "<VAULT_AADHAAR_001>";
    target_input_selector: "input#uidai_no";
  }[];
  risk_level: "L1_SAFE" | "L2_MUTATION" | "L3_HIGH_RISK_FINANCIAL";
  requires_human_approval: boolean; // Triggers Side Panel approval gate if L3
  explanation_hi_en: string;        // Sovereign bilingual reasoning explanation
}`;

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
            ✓ AUTHENTIC MERMAID 10 ACTIVE
          </span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          📐 High-Level Architecture &amp; Microservices Specification
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          PRATYAKSHA separates the client-side browser perception and local privacy vault from the sovereign air-gapped reasoning cluster. Explore the authentic Mermaid system topology and cryptographic sequence flow below with interactive pan, zoom, and live service telemetry.
        </p>

        {/* Stat Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '24px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>INGRESS FILTER</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C', fontFamily: "'Outfit', sans-serif" }}>0.00% PII Egress</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>OFFSCREEN INFERENCE</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', fontFamily: "'Outfit', sans-serif" }}>62ms WebGPU Latency</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>REASONING CLUSTER</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669', fontFamily: "'Outfit', sans-serif" }}>LangGraph DAG</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>ISRO PORTAL COMPAT</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED', fontFamily: "'Outfit', sans-serif" }}>GeM · SAKSHAM · NIC</div>
          </div>
        </div>
      </header>

      {/* SECTION 1: MERMAID ARCHITECTURE TOPOLOGY & SEQUENCE FLOW */}
      <section id="m4-s1" style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 01 &amp; 03</span>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 0' }}>
              Authentic Mermaid 10 Architecture Canvas
            </h2>
          </div>

          {/* Diagram Tab Switcher */}
          <div style={{ display: 'flex', background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
            <button
              onClick={() => setActiveDiagramTab('topology')}
              style={{
                background: activeDiagramTab === 'topology' ? '#EA580C' : 'transparent',
                color: activeDiagramTab === 'topology' ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '7px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🏛️ 4-Stage Architecture Topology
            </button>
            <button
              onClick={() => setActiveDiagramTab('sequence')}
              style={{
                background: activeDiagramTab === 'sequence' ? '#EA580C' : 'transparent',
                color: activeDiagramTab === 'sequence' ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '7px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              ⏱️ 15-Step Cryptographic Sequence Flow
            </button>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
          {activeDiagramTab === 'topology'
            ? 'Below is the full 4-tier architecture topology: (1) Client MV3 Offscreen Sandbox with WebGPU Privacy Shield, (2) Zero-Trust Edge Gateway DMZ, (3) Sovereign LangGraph Reasoning Cluster, and (4) Local Rehydration & DOM Dispatcher. Pan with click & drag or 1 finger, zoom with pinch or scroll wheel.'
            : 'Below is the end-to-end operational sequence diagram detailing the 15 cryptographic handshakes between User, Content Script, WebGPU Privacy Shield, Local AES Vault, Gateway, LangGraph, and Sovereign VLM.'
          }
        </p>

        {/* Real Mermaid Component */}
        <MermaidView
          id={`hld-${activeDiagramTab}`}
          chart={activeDiagramTab === 'topology' ? HLD_ARCHITECTURE_MERMAID : HLD_SEQUENCE_MERMAID}
          title={activeDiagramTab === 'topology' ? 'PRATYAKSHA 4-Tier Sovereign Architecture Topology' : 'PRATYAKSHA 15-Step Cryptographic Execution Sequence Flow'}
          subtitle="Use mouse wheel or 2-finger pinch to zoom centered at cursor; drag canvas to pan across services"
        />
      </section>

      {/* Live Microservice Telemetry Inspector */}
      <section style={{ marginBottom: '48px' }}>
        <ArchitectureInspector />
      </section>

      {/* SECTION 2: MICROSERVICES INVENTORY */}
      <section id="m4-s2" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 02</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Microservices Inventory &amp; Specifications
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
          PRATYAKSHA is decomposed into 7 specialized microservices strictly segregated by security zones:
        </p>

        <div className="table-container" style={{ overflowX: 'auto', border: '1px solid var(--border-warm)', borderRadius: '12px', background: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--border-warm)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>Service ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>Security Zone</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>Runtime / Tech</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>Primary Responsibility</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>Egress Contract</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-ext-shell</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Client MV3</span></td>
                <td style={{ padding: '12px 16px' }}>React 18 + Chrome Extensions API</td>
                <td style={{ padding: '12px 16px' }}>Operator HUD, task intent input, real-time visual trajectory, L3 human approval modal</td>
                <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>Zero External Egress</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-vision-local</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#FFF7ED', color: '#9A3412', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Offscreen WebGPU</span></td>
                <td style={{ padding: '12px 16px' }}>ONNX Runtime Web + WGSL Shaders</td>
                <td style={{ padding: '12px 16px' }}>8x8 tile diff, DBNet text detection, Ultra-Light face detection, Indic CRNN OCR</td>
                <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>Zero Raw Pixels</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-vault-local</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#F5F3FF', color: '#5B21B6', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>RAM-Only Vault</span></td>
                <td style={{ padding: '12px 16px' }}>Web Crypto API (AES-256-GCM)</td>
                <td style={{ padding: '12px 16px' }}>Maps real Aadhaar/PAN strings to ephemeral session tokens; rehydrates upon synthetic keystroke</td>
                <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>Never Touches Disk</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-gateway</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Edge DMZ</span></td>
                <td style={{ padding: '12px 16px' }}>Envoy Proxy + Rust Inspector</td>
                <td style={{ padding: '12px 16px' }}>TLS 1.3 mTLS termination, device attestation, heuristic regex scan for accidental raw PII</td>
                <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>Hard Drops Raw PII</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-orchestrator</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Sovereign Intranet</span></td>
                <td style={{ padding: '12px 16px' }}>Python 3.11 + FastAPI + LangGraph</td>
                <td style={{ padding: '12px 16px' }}>Dual-stream perception fusion, DAG state machine, 12-turn rollback checkpointing</td>
                <td style={{ padding: '12px 16px', color: '#2563EB', fontWeight: 600 }}>Sanitized Tokens Only</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-warm)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-vlm-cloud</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Air-Gapped GPU</span></td>
                <td style={{ padding: '12px 16px' }}>vLLM + Qwen2.5-VL-7B (4-bit AWQ)</td>
                <td style={{ padding: '12px 16px' }}>High-precision UI grounding, next-action hypothesis generation on sanitized tokens</td>
                <td style={{ padding: '12px 16px', color: '#2563EB', fontWeight: 600 }}>Zero Data Retention</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#EA580C' }}>svc-policy</td>
                <td style={{ padding: '12px 16px' }}><span className="badge" style={{ background: '#FFF1F2', color: '#9F1239', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Security Guardrail</span></td>
                <td style={{ padding: '12px 16px' }}>Open Policy Agent (OPA) + Rego</td>
                <td style={{ padding: '12px 16px' }}>Enforces financial transaction limits, prevents forbidden form submissions without L3 confirmation</td>
                <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>Deterministic Allow/Block</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: API CONTRACT SPECIFICATIONS */}
      <section id="m4-s4" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 04</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Microservices API &amp; WebSocket Contracts
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
          All inter-service network packets are strictly validated against production JSON Schema specifications. Notice that raw PII is structurally impossible to serialize:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
          {/* REST Ingest Contract */}
          <div style={{ background: '#1C1917', borderRadius: '14px', padding: '20px', border: '1px solid #332E2A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#EA580C', fontWeight: 700 }}>
                REST: /v1/agent/task (UPLINK)
              </span>
              <button
                onClick={() => copyCode(restIngestSchema, 'rest-code')}
                style={{
                  background: copiedKey === 'rest-code' ? '#059669' : '#2E2926',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer'
                }}
              >
                {copiedKey === 'rest-code' ? '✓ Copied' : 'Copy Schema'}
              </button>
            </div>
            <pre style={{ margin: 0, overflowX: 'auto', fontSize: '11.5px', color: '#F5F5F4', lineHeight: 1.5 }}>
              <code>{restIngestSchema}</code>
            </pre>
          </div>

          {/* WSS Action Downlink Contract */}
          <div style={{ background: '#1C1917', borderRadius: '14px', padding: '20px', border: '1px solid #332E2A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
                WSS: /v1/agent/action-stream (DOWNLINK)
              </span>
              <button
                onClick={() => copyCode(wssActionSchema, 'wss-code')}
                style={{
                  background: copiedKey === 'wss-code' ? '#059669' : '#2E2926',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer'
                }}
              >
                {copiedKey === 'wss-code' ? '✓ Copied' : 'Copy Schema'}
              </button>
            </div>
            <pre style={{ margin: 0, overflowX: 'auto', fontSize: '11.5px', color: '#F5F5F4', lineHeight: 1.5 }}>
              <code>{wssActionSchema}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 5: SECURITY ARCHITECTURE */}
      <section id="m4-s5" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 05</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Zero-Trust Boundary &amp; Cryptographic Proofs
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#EA580C', fontFamily: "'Outfit', sans-serif" }}>
              1. Hardware &amp; WebGPU Isolation
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Inference runs inside an isolated Chrome MV3 Offscreen Document with separate V8 isolate and hardware context. Neither malicious page scripts nor browser extensions can spy on model activations or intermediate tensors.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#2563EB', fontFamily: "'Outfit', sans-serif" }}>
              2. SHA-256 Merkle Audit Chain
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Every redacted coordinate box and tokenized string generates a cryptographic leaf node in an in-memory Merkle tree. The Merkle root is signed and sent with each request, creating a tamper-proof audit trail for national compliance.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#059669', fontFamily: "'Outfit', sans-serif" }}>
              3. Level-3 Human-in-the-Loop Gate
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Any irreversible state mutation (e.g. "Final Bid Submission", "Funds Transfer", "Delete Record") strictly halts execution and prompts the human operator on the Side Panel with a 2-click cryptographically signed authorization.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: DATA STORAGE DESIGN */}
      <section id="m4-s6" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 06</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Enterprise Data Storage Design
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#EA580C', fontWeight: 700 }}>SESSION PERSISTENCE</span>
            <h4 style={{ margin: '4px 0 8px', fontSize: '16px', color: 'var(--text-main)', fontFamily: "'Outfit', sans-serif" }}>PostgreSQL 16</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Stores structured session history, encrypted task trajectories, user authorization records, and LangGraph checkpoints with foreign-key cascade integrity.
            </p>
          </div>

          <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#2563EB', fontWeight: 700 }}>FAST LOCKS &amp; CACHE</span>
            <h4 style={{ margin: '4px 0 8px', fontSize: '16px', color: 'var(--text-main)', fontFamily: "'Outfit', sans-serif" }}>Redis 7.2 Cluster</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Distributed locks for active browser tabs, ephemeral task pub/sub channels, sub-millisecond rate limit counters, and token existence sets.
            </p>
          </div>

          <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>METRICS TELEMETRY</span>
            <h4 style={{ margin: '4px 0 8px', fontSize: '16px', color: 'var(--text-main)', fontFamily: "'Outfit', sans-serif" }}>TimescaleDB</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Time-series tracking of WebGPU inference latencies, dirty tile skip ratios, network round-trip delays, and action execution success rates.
            </p>
          </div>

          <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: '#7C3AED', fontWeight: 700 }}>AUDIT OBJECT STORE</span>
            <h4 style={{ margin: '4px 0 8px', fontSize: '16px', color: 'var(--text-main)', fontFamily: "'Outfit', sans-serif" }}>MinIO S3</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Immutable WORM (Write Once Read Many) storage for sanitized viewport WebP artifacts and signed cryptographic Merkle audit bundles.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: ADRs */}
      <section id="m4-s9" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 09</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Architectural Decision Records (ADRs)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', color: 'var(--text-main)' }}>
                ADR-001: WebGPU ONNX In-Browser Redaction vs Cloud OCR
              </strong>
              <span style={{ background: '#D1FAE5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>ACCEPTED</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.55, margin: 0 }}>
              <strong>Context &amp; Decision:</strong> Sending raw browser viewports to cloud OCR endpoints violates Indian DPDP Act 2023 and ISRO SAC confidentiality guidelines. We chose WebGPU ONNX Runtime Web to execute DBNet INT8 and Indic CRNN directly inside the client GPU, guaranteeing mathematical zero-PII egress before any network packet leaves the host machine.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', color: 'var(--text-main)' }}>
                ADR-002: LangGraph State Machine DAG vs Autonomous ReAct Loop
              </strong>
              <span style={{ background: '#D1FAE5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>ACCEPTED</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.55, margin: 0 }}>
              <strong>Context &amp; Decision:</strong> Unconstrained ReAct loops frequently hallucinate cyclic page refreshes or fail silently on unexpected DOM mutations. We adopted an explicit LangGraph Directed Acyclic Graph with deterministic state transitions, 12-turn checkpoint rollback, and self-healing backtrack edges.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '12px', padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', color: 'var(--text-main)' }}>
                ADR-003: Ephemeral RAM Token Vault vs Persistent Secret Storage
              </strong>
              <span style={{ background: '#D1FAE5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>ACCEPTED</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.55, margin: 0 }}>
              <strong>Context &amp; Decision:</strong> Storing real citizen PII in localStorage or IndexedDB creates persistent forensic risk if the workstation is inspected. We mandate an in-memory AES-256-GCM vault whose encryption keys are held exclusively in volatile RAM and cryptographically zeroed upon tab closure.
            </p>
          </div>
        </div>
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
