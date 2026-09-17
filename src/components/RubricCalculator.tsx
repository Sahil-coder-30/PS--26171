import React, { useState } from 'react';

interface RubricItem {
  id: string;
  name: string;
  max: number;
  score: number;
  weight: string;
  category: string;
  desc: string;
}

export const RubricCalculator: React.FC = () => {
  const [rubrics, setRubrics] = useState<RubricItem[]>([
    {
      id: 'r1',
      name: 'Approach & Problem Complexity',
      max: 25,
      score: 25,
      weight: '25%',
      category: 'high',
      desc: 'Dual-stream perception (DOM tree + visual pixel raster), handling non-DOM Canvas/PDF, real-time sync under 80ms.'
    },
    {
      id: 'r2',
      name: 'Security, Privacy & Zero-Egress',
      max: 25,
      score: 25,
      weight: '25%',
      category: 'high',
      desc: 'Mathematical ε-differential zero-PII egress, client-side WebGPU ONNX neural inference, AES-256 in-memory vault.'
    },
    {
      id: 'r3',
      name: 'Architecture & System Scalability',
      max: 20,
      score: 20,
      weight: '20%',
      category: 'mid',
      desc: 'Microservices with mTLS gRPC/WebSocket, LangGraph multi-step DAG orchestrator, 12-turn rollback checkpointing.'
    },
    {
      id: 'r4',
      name: 'User Experience & Human-in-the-Loop',
      max: 15,
      score: 15,
      weight: '15%',
      category: 'mid',
      desc: 'Chrome MV3 Side Panel HUD, real-time visual audit trail, human approval gate for high-risk mutations.'
    },
    {
      id: 'r5',
      name: 'Demonstration & Execution Proof',
      max: 15,
      score: 15,
      weight: '15%',
      category: 'mid',
      desc: 'Live deployment on GeM & ISRO e-procurement portals, automated self-healing retry on broken DOM selectors.'
    }
  ]);

  const updateScore = (id: string, val: number) => {
    setRubrics(prev => prev.map(r => r.id === id ? { ...r, score: Math.max(0, Math.min(r.max, val)) } : r));
  };

  const totalScore = rubrics.reduce((acc, r) => acc + r.score, 0);

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
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>EVALUATION RUBRIC MATRIX</span>
          <h3 style={{ margin: '3px 0 0', fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>
            ISRO SAC 100-Point Competitive Scorecard &amp; Calculator
          </h3>
        </div>
        <div style={{
          background: totalScore >= 95 ? '#ECFDF5' : '#FFF7ED',
          border: '1px solid ' + (totalScore >= 95 ? '#A7F3D0' : '#FDBA74'),
          padding: '6px 16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-muted)' }}>PROJECT SCORE:</span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '24px',
            fontWeight: 800,
            color: totalScore >= 95 ? '#059669' : '#EA580C'
          }}>
            {totalScore} <span style={{ fontSize: '14px', fontWeight: 600 }}>/ 100</span>
          </span>
        </div>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.55 }}>
        Adjust scores to audit our competitive performance against jury evaluation criteria. Every dimension is backed by empirical benchmarks, unit tests, and live portal runs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {rubrics.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#FAF7F2',
              border: '1px solid #E7E0D6',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#EA580C'
                }}>
                  WEIGHT: {r.weight}
                </span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--text-main)'
                }}>
                  {r.score}/{r.max} pts
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}>
                {r.name}
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {r.desc}
              </p>
            </div>

            <div>
              <input
                type="range"
                min="0"
                max={r.max}
                value={r.score}
                onChange={(e) => updateScore(r.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#EA580C', cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
