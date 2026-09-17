import React, { useState } from 'react';

export const SprintTimeline: React.FC = () => {
  const [activeSprint, setActiveSprint] = useState<number>(1);

  const sprints = [
    {
      num: 1,
      hours: 'Hours 00 – 08',
      title: 'Foundation & Dual-Channel Sensor Pipeline',
      badge: 'INITIAL SENSOR RIG',
      milestones: [
        'Scaffold Chrome Manifest V3 structure with background service worker, content scripts, and side panel.',
        'Implement chrome.tabs.captureVisibleTab viewport frame grabber with 8x8 dHash dirty-tile perceptual filter.',
        'Extract live DOM accessibility tree and computed CSS bounding rectangles into structured JSON.',
        'Verify zero layout shifts and tab performance with Chrome Performance Profiler.'
      ],
      deliverable: 'Working extension streaming raw viewport screenshots and sanitized interactive DOM scene graphs.'
    },
    {
      num: 2,
      hours: 'Hours 08 – 18',
      title: 'WebGPU Privacy Shield & Local Ephemeral Vault',
      badge: 'ZERO-EGRESS NEURAL VAULT',
      milestones: [
        'Initialize ONNX Runtime Web in offscreen document with WebGPU backend execution provider.',
        'Port quantized INT8 DBNet text detector (4.8MB) and Ultra-Light Face detector (1.2MB).',
        'Implement CRNN Indic OCR with regex pattern matching for Aadhaar, PAN, phones, and emails.',
        'Deploy AES-256-GCM in-memory Vault with deterministic token registry in offscreen RAM.'
      ],
      deliverable: 'Proven mathematical zero-egress: sensitive text pixel-blurred and tokenized locally before network dispatch.'
    },
    {
      num: 3,
      hours: 'Hours 18 – 28',
      title: 'LangGraph Orchestrator & Sovereign VLM Reasoning',
      badge: 'REASONING CLUSTER',
      milestones: [
        'Establish bidirectional mTLS WebSocket connection to Python FastAPI LangGraph cluster.',
        'Stream sanitized viewport PNG and tokenized DOM scene graph to Qwen2.5-VL 72B.',
        'Implement state graph with Action, Observe, Verify, and Self-Healing error recovery nodes.',
        'Enforce Open Policy Agent (OPA) safety constraints to block high-risk mutations without user consent.'
      ],
      deliverable: 'Autonomous multi-step planning loop executing verified click, type, and navigation action plans.'
    },
    {
      num: 4,
      hours: 'Hours 28 – 36',
      title: 'Action Execution, Side Panel HUD & Jury Polish',
      badge: 'PRODUCTION HARDENING',
      milestones: [
        'Build synthetic DOM event dispatcher supporting synthetic click, keyboard typing, and scroll.',
        'Complete local vault token rehydration before event dispatch (swapping tokens to real values only in DOM inputs).',
        'Build Chrome Side Panel audit trail displaying live reasoning logs, screenshot diffs, and Human Approval gates.',
        'Execute end-to-end live rehearsal across GeM and ISRO e-procurement portals.'
      ],
      deliverable: 'Bulletproof, live-tested on-device agent ready for ISRO SAC final jury presentation.'
    }
  ];

  const current = sprints.find(s => s.num === activeSprint) || sprints[0];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-warm)',
      borderRadius: '16px',
      padding: '26px 30px',
      margin: '28px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: '#EA580C',
            textTransform: 'uppercase'
          }}>HACKATHON EXECUTION ROADMAP</span>
          <h3 style={{ margin: '3px 0 0', fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>
            36-Hour Engineering Sprint Timeline &amp; Milestones
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {sprints.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveSprint(s.num)}
              style={{
                background: activeSprint === s.num ? '#EA580C' : '#FAF7F2',
                color: activeSprint === s.num ? '#FFFFFF' : '#736B63',
                border: '1px solid ' + (activeSprint === s.num ? '#EA580C' : '#E7E0D6'),
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sprint {s.num}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: '#FAF7F2',
        border: '1px solid #E7E0D6',
        borderRadius: '12px',
        padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#EA580C',
              background: '#FFF7ED',
              border: '1px solid #FDBA74',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {current.hours} · {current.badge}
            </span>
            <h4 style={{ margin: '8px 0 0', fontSize: '17px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}>
              {current.title}
            </h4>
          </div>
        </div>

        <ul style={{ paddingLeft: '18px', margin: '12px 0 16px', fontSize: '13px', color: '#332F2B', lineHeight: 1.65 }}>
          {current.milestones.map((m, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>{m}</li>
          ))}
        </ul>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E7E0D6',
          padding: '8px 14px',
          borderRadius: '8px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#059669',
          fontWeight: 600
        }}>
          🏁 Phase Deliverable: {current.deliverable}
        </div>
      </div>
    </div>
  );
};
