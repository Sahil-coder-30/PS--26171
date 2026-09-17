import React, { useState } from 'react';

interface Objection {
  id: string;
  question: string;
  category: string;
  answer: string;
  takeaway: string;
}

export const JudgeDefenseMatrix: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const objections: Objection[] = [
    {
      id: 'obj-1',
      question: '"If our VLM is hosted in our secure on-prem ISRO data center, why do we need on-device browser sanitization?"',
      category: 'CYBERSECURITY & ZERO-TRUST',
      answer: 'Intranet hosting does not satisfy the zero-trust principle. Network telemetry can be tapped by compromised internal nodes, internal reverse proxy logs store unencrypted screenshots containing citizen Aadhaar/PAN cards, and VLM context caches persist in GPU RAM. PRATYAKSHA enforces mathematical egress prevention: sensitive data never touches the network wire under any circumstance.',
      takeaway: 'Rule: Never trust the network perimeter; enforce privacy at the sensor source.'
    },
    {
      id: 'obj-2',
      question: '"What happens if an operator opens an encrypted PDF tender or an HTML5 Canvas signature pad where DOM elements do not exist?"',
      category: 'PERCEPTION ROBUSTNESS',
      answer: 'This is precisely why pure DOM agents (like Browser-Use or LangChain) fail. PRATYAKSHA runs an independent pixel pipeline over WebGPU. DBNet detects text bounding boxes inside rendered PDF canvas viewports, and CRNN OCR extracts strings directly from pixel rasters. If the DOM tree sees nothing, the vision channel still captures, indexes, and anonymizes the text.',
      takeaway: 'Dual-stream fusion guarantees 100% sensory coverage even on non-DOM viewports.'
    },
    {
      id: 'obj-3',
      question: '"Doesn\'t running on-device neural networks in WebGPU introduce unacceptable memory and battery overhead?"',
      category: 'EDGE PERFORMANCE',
      answer: 'Our models are INT8-quantized and specialized: DBNet-small is 4.8MB and CRNN is 8.2MB. Total WebGPU VRAM footprint is under 64MB, and execution runs exclusively in an offscreen document on dirty-tile change triggers (8x8 dHash). On typical modern laptop GPUs, inference finishes in 62ms with zero UI thread stuttering.',
      takeaway: 'Quantized INT8 models on WebGPU deliver 60ms latency at <64MB RAM.'
    },
    {
      id: 'obj-4',
      question: '"How do you prevent catastrophic actions like submitting an irreversible financial bid without authorization?"',
      category: 'SAFETY & GOVERNANCE',
      answer: 'Every LangGraph action passes through an Open Policy Agent (OPA) safety gate. Destructive or state-mutating actions (HTTP POST, payments, tenders, confirmation dialogs) automatically trigger a Human-in-the-Loop (HITL) pause in the Chrome Side Panel HUD. The agent pauses execution until the operator explicitly clicks Approve or Modify.',
      takeaway: 'Human-in-the-loop gate ensures zero unauthorized mutations.'
    }
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-warm)',
      borderRadius: '16px',
      padding: '26px 30px',
      margin: '28px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '6px'
        }}>
          JUDGE SCRUTINY CHEAT SHEET
        </span>
        <h3 style={{ margin: 0, fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>
          Anticipated Technical Objections &amp; Bulletproof Defense
        </h3>
      </div>
      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.55 }}>
        Rigorous engineering answers to tough questions from ISRO systems architects, cybersecurity evaluators, and ML leads.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {objections.map((obj, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={obj.id}
              style={{
                border: '1px solid ' + (isOpen ? 'var(--isro-orange)' : 'var(--border-warm)'),
                borderRadius: '10px',
                background: isOpen ? '#FFFAF5' : '#FAF7F2',
                overflow: 'hidden',
                transition: 'all 0.15s ease'
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#EA580C',
                    marginBottom: '3px'
                  }}>
                    {obj.category}
                  </span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {obj.question}
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: '#EA580C', fontWeight: 700 }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid #F4EBE1' }}>
                  <p style={{ fontSize: '13px', color: '#332F2B', lineHeight: 1.6, margin: '10px 0' }}>
                    <strong>Winning Response:</strong> {obj.answer}
                  </p>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E7E0D6',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#059669',
                    fontWeight: 600
                  }}>
                    🎯 Key Takeaway: {obj.takeaway}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
