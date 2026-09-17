import React from 'react';
import type { DocModule } from '../types';

interface MasterHeroProps {
  modules: DocModule[];
  onSelectModule: (num: string) => void;
}

export const MasterHero: React.FC<MasterHeroProps> = ({ modules, onSelectModule }) => {
  return (
    <header className="master-hero" id="top">
      <div className="hero-pre-title">
        <span className="hero-badge-pill">SIH 2024 · PS-26171</span>
        <span className="hero-meta-pill">ISRO Space Applications Centre (SAC)</span>
        <span className="hero-meta-pill">Classification: Operational Architecture</span>
      </div>
      <h1 className="master-hero-title">
        PRATYAKSHA (प्रत्यक्ष): Dual-Stream Browser Agent with On-Device WebGPU Privacy Shield
      </h1>
      <p className="master-hero-subtitle">
        The definitive unified engineering specification, mathematical privacy formulation, high-level microservice topology, and Chrome MV3 codebase documentation for India's sovereign autonomous web agent.
      </p>

      <div className="master-hero-tags">
        <span className="tag-chip">🛡️ Zero-Egress Privacy Shield</span>
        <span className="tag-chip">⚡ WebGPU On-Device ONNX</span>
        <span className="tag-chip">🤖 LangGraph Dual-Stream Perception</span>
        <span className="tag-chip">🧩 Chrome Extension Manifest V3</span>
        <span className="tag-chip">⚛️ Pure React Master Explorer</span>
        <span className="tag-chip">🎯 100-Point Rubric Breakdown</span>
      </div>

      <div className="master-module-cards">
        {modules.map((m) => (
          <div
            key={m.num}
            className="mod-jump-card"
            onClick={() => onSelectModule(m.num)}
          >
            <div className="mod-card-top">
              <span className="mod-card-num">MODULE {m.num}</span>
              <span>{m.icon}</span>
            </div>
            <span className="mod-card-name">{m.title}</span>
          </div>
        ))}
      </div>
    </header>
  );
};
