import React, { useState } from 'react';

interface Props {
  onNavigate: (route: string, sectionId?: string) => void;
}

export const Module05ExtensionMV3: React.FC<Props> = ({ onNavigate }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const manifestCode = `{
  "manifest_version": 3,
  "name": "PRATYAKSHA — ISRO SAC Autonomous Browser Agent",
  "version": "1.0.0",
  "description": "Sovereign dual-stream browser agent with on-device WebGPU privacy shield.",
  "permissions": [
    "activeTab",
    "scripting",
    "sidePanel",
    "offscreen",
    "storage"
  ],
  "host_permissions": [
    "https://*.gov.in/*",
    "https://*.isro.gov.in/*",
    "https://*.gem.gov.in/*"
  ],
  "background": {
    "service_worker": "background.bundle.js",
    "type": "module"
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "content_scripts": [
    {
      "matches": ["https://*/*"],
      "js": ["content.bundle.js"],
      "run_at": "document_idle"
    }
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  }
}`;

  const offscreenSnippet = `// offscreen.ts — WebGPU Offscreen Neural Pipeline
import * as ort from 'onnxruntime-web/webgpu';

export class WebGPUPrivacyShield {
  private dbnetSession: ort.InferenceSession | null = null;
  private crnnSession: ort.InferenceSession | null = null;

  async initialize() {
    ort.env.wasm.numThreads = 4;
    ort.env.wasm.simd = true;

    // Allocate dedicated WebGPU tensor execution context
    this.dbnetSession = await ort.InferenceSession.create('/models/dbnet_int8.onnx', {
      executionProviders: ['webgpu']
    });
    this.crnnSession = await ort.InferenceSession.create('/models/crnn_indic_int8.onnx', {
      executionProviders: ['webgpu']
    });
    console.log('[WebGPU Shield] Neural models loaded in hardware context');
  }

  async processFrame(imageData: ImageData): Promise<SanitizedFrameResult> {
    // 1. 8x8 Tile Diff check
    const dirty = this.computeTileDiff(imageData);
    if (!dirty) return { skipped: true };

    // 2. Run DBNet text detection & Indic CRNN
    const bboxes = await this.detectTextRegions(imageData);
    const piiEntities = await this.classifyAndRedact(bboxes, imageData);

    // 3. Return sanitized canvas & token map
    return { skipped: false, sanitizedCanvas: imageData, piiEntities };
  }
}`;

  return (
    <article className="module-page" style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Breadcrumb Header */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        <button onClick={() => onNavigate('/00-vision')} style={{ background: 'none', border: 'none', color: '#EA580C', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Docs</button>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Module 05: Chrome Manifest V3 Extension Codebase</span>
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
            MODULE 05
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
            CHROME MV3 CODEBASE
          </span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          🧩 Manifest V3 Browser Extension &amp; Privacy Shield Implementation
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '880px', margin: 0 }}>
          Production Chrome MV3 implementation: Background service worker, WebGPU offscreen document execution, secure Chrome Side Panel audit HUD, and zero-trust event routing.
        </p>
      </header>

      {/* SECTION 1: MANIFEST V3 BLUEPRINT */}
      <section id="m5-s1" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 01</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Manifest V3 Declarative Blueprint
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
          Chrome MV3 strictly forbids remotely hosted code (<code>unsafe-eval</code>). PRATYAKSHA packs all neural models locally, using <code>wasm-unsafe-eval</code> solely for WebAssembly acceleration:
        </p>

        <div style={{ background: '#1C1917', borderRadius: '14px', padding: '20px', border: '1px solid #332E2A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#EA580C', fontWeight: 700 }}>
              manifest.json (Production Configuration)
            </span>
            <button
              onClick={() => copyCode(manifestCode, 'manifest-code')}
              style={{
                background: copiedKey === 'manifest-code' ? '#059669' : '#2E2926',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer'
              }}
            >
              {copiedKey === 'manifest-code' ? '✓ Copied' : 'Copy Manifest'}
            </button>
          </div>
          <pre style={{ margin: 0, overflowX: 'auto', fontSize: '11.5px', color: '#F5F5F4', lineHeight: 1.5 }}>
            <code>{manifestCode}</code>
          </pre>
        </div>
      </section>

      {/* SECTION 2: WEBGPU OFFSCREEN WORKER */}
      <section id="m5-s3" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 03</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          WebGPU Offscreen Document Worker
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
          Chrome MV3 service workers lack direct DOM and WebGPU access. PRATYAKSHA spawns an isolated offscreen document (<code>chrome.offscreen.createDocument</code>) with dedicated WebGPU compute access:
        </p>

        <div style={{ background: '#1C1917', borderRadius: '14px', padding: '20px', border: '1px solid #332E2A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
              offscreen.ts (Dedicated WebGPU Context)
            </span>
            <button
              onClick={() => copyCode(offscreenSnippet, 'offscreen-code')}
              style={{
                background: copiedKey === 'offscreen-code' ? '#059669' : '#2E2926',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer'
              }}
            >
              {copiedKey === 'offscreen-code' ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
          <pre style={{ margin: 0, overflowX: 'auto', fontSize: '11.5px', color: '#F5F5F4', lineHeight: 1.5 }}>
            <code>{offscreenSnippet}</code>
          </pre>
        </div>
      </section>

      {/* SECTION 4: SIDE PANEL HUD */}
      <section id="m5-s4" style={{ marginBottom: '48px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#EA580C' }}>SECTION 04</span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 16px' }}>
          Side Panel Audit &amp; Control HUD
        </h2>

        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-warm)', borderRadius: '14px', padding: '24px' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6 }}>
            The Chrome Side Panel provides an interactive operator interface that remains visible alongside the active portal tab:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#EA580C', fontSize: '14px' }}>Visual Trajectory Feed</strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Shows real-time screenshots with bounding boxes indicating where the agent will click next.</p>
            </div>
            <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#2563EB', fontSize: '14px' }}>Privacy Merkle Audit Ledger</strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Live log of every detected Aadhaar, PAN, and phone entity with its assigned synthetic vault token.</p>
            </div>
            <div style={{ background: '#FAF7F2', border: '1px solid var(--border-warm)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#059669', fontSize: '14px' }}>L3 Approval Gate</strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Interactive modal with one-click authorization before any high-stakes financial mutation is executed.</p>
            </div>
          </div>
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
          onClick={() => onNavigate('/04-hld')}
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
          &larr; Previous: Module 04 (Architecture HLD)
        </button>

        <button
          onClick={() => onNavigate('/06-roadmap')}
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
          Next: Module 06 (Hackathon Jury) &rarr;
        </button>
      </footer>
    </article>
  );
};
