import type { DocModule, Microservice } from '../types';

export const MICROSERVICES: Microservice[] = [
  {
    id: 'shield',
    name: 'Perception Shield (Client Extension)',
    runtime: 'Chrome MV3 + WebGPU + ONNX Runtime Web',
    badge: 'ON-DEVICE PRIVACY',
    desc: 'Captures raw screen pixels & DOM scene graph. Runs local DBNet + CRNN OCR in under 80ms. Replaces PII with cryptographic vault tokens before network egress.',
    spec: '0.00% Real PII Leaked · AES-256-GCM Vault · WebGPU Hardware Accelerated'
  },
  {
    id: 'langgraph',
    name: 'LangGraph State Orchestrator',
    runtime: 'FastAPI + Python 3.11 + Redis Cluster',
    badge: 'STATE MACHINE & REASONING',
    desc: 'Receives sanitized viewport PNG and tokenized DOM. Orchestrates multi-step browser tasks using an explicit Directed Acyclic Graph (DAG) with self-healing backtrack loops.',
    spec: 'Checkpoint Memory · 12-turn Rollback · State Snapshotting'
  },
  {
    id: 'vlm',
    name: 'Sovereign Multimodal VLM Cluster',
    runtime: 'vLLM / TensorRT-LLM + Qwen2.5-VL 72B',
    badge: 'SOVEREIGN INFERENCE',
    desc: 'Grounds high-level user commands to precise bounding box coordinates and CSS selector trajectories on anonymized DOM nodes.',
    spec: '98.4% UI Grounding · 2.1s Inference Latency · Zero Data Retention'
  },
  {
    id: 'executor',
    name: 'Action Dispatcher & Rehydration Engine',
    runtime: 'Chrome MV3 Content Script + CDP Dispatcher',
    badge: 'SYNTHETIC EXECUTION',
    desc: 'Executes verified click/type actions in the active browser tab. Queries in-memory vault to swap synthetic tokens back into real citizen values only upon DOM keystroke dispatch.',
    spec: 'Trusted synthetic events · MutationObserver re-anchoring · Anti-bot bypass'
  }
];

export const MODULES_DATA: DocModule[] = [
  {
    id: 'module-00',
    num: '00',
    route: '/00-vision',
    title: 'Project Vision & Executive Blueprint',
    icon: '📖',
    badge: 'FOUNDATION & PROBLEM STATEMENT',
    desc: 'Strategic problem statement analysis (ISRO SAC PS-26171), central perception dilemma, 5-step execution flow, and 6 core innovations.',
    sections: [
      { id: 'overview', origId: 'overview', title: '01. Executive Summary & Core Mission', icon: '🎯', summary: 'High-level mission statement and sovereign agent principles.' },
      { id: 'paradox', origId: 'paradox', title: '02. The Core Perception & Privacy Paradox', icon: '⚡', summary: 'Why conventional cloud agents leak PII and fail on canvas.' },
      { id: 'pipeline', origId: 'pipeline', title: '03. 5-Step Execution Pipeline', icon: '🏛️', summary: 'End-to-end flow from viewport capture to rehydration.' },
      { id: 'innovations', origId: 'innovations', title: '04. Six Core Technical Innovations', icon: '💡', summary: 'WebGPU OCR, Local Vault, LangGraph DAG, and Zero-Trust.' },
      { id: 'rubric', origId: 'rubric', title: '05. 100-Point Evaluation Rubric Alignment', icon: '📊', summary: 'Detailed 100-point SIH evaluation scorecard.' }
    ]
  },
  {
    id: 'module-01',
    num: '01',
    route: '/01-strategy',
    title: 'Master Plan, Strategy & Competitive Moats',
    icon: '🎯',
    badge: 'EVALUATION & STRATEGY',
    desc: 'Full master plan documentation: 100-point rubric breakdown, market analysis, master plan flowchart, on-device model pipeline, 6 core innovations, and benchmark target metrics.',
    sections: [
      { id: 'overview', origId: 'overview', title: '01. The Most Important Insight & Central Crisis', icon: '🚀', summary: 'Strategic alignment with national space missions and DPDP Act.' },
      { id: 'rubric', origId: 'rubric', title: '02. Evaluation Rubric — Decoded for Victory', icon: '⚖️', summary: 'Interactive 100-point SIH scorecard with criteria breakdown.' },
      { id: 'market', origId: 'market', title: '03. Market Analysis — Why Every Existing Solution Fails', icon: '🛡️', summary: 'Head-to-head comparison with Browser-Use, Adept, and OpenAI Operator.' },
      { id: 'architecture', origId: 'architecture', title: '04. Full System Architecture (Mermaid)', icon: '📐', summary: 'Interactive Mermaid strategy flowchart of client-to-cloud execution.' },
      { id: 'models', origId: 'models', title: '05. On-Device Model Pipeline — Why Not One Big VLM?', icon: '⚡', summary: 'Local quantized neural detector stack specifications.' },
      { id: 'innovations', origId: 'innovations', title: '06. 6 Core Innovations & Competitive Moats', icon: '💡', summary: 'Deep dive into our architectural moats and patents.' },
      { id: 'metrics', origId: 'metrics', title: '07. Target Benchmark Metrics vs Baseline', icon: '📊', summary: 'Accuracy, latency, and PII leakage comparison benchmarks.' },
      { id: 'sprint', origId: 'sprint', title: '08. 4-Phase Sprint Plan & Team Distribution', icon: '⏱️', summary: 'Work breakdown and hackathon sprint schedule.' }
    ]
  },
  {
    id: 'module-02',
    num: '02',
    route: '/02-browser-agent',
    title: 'Browser Agent Autonomous Execution Engine',
    icon: '🤖',
    badge: 'AGENT ARCHITECTURE',
    desc: 'Complete browser agent specification: dual-channel perception, action schema, LangGraph state machine, rehydration vault, and wire protocol.',
    sections: [
      { id: 'what-is-agent', origId: 'what-is-agent', title: '01. What is a Browser Agent? (PS-26171 Context)', icon: '🤖', summary: 'Core definition, perception-action loop, and sovereignty.' },
      { id: 'mv3-arch', origId: 'mv3-arch', title: '02. Chrome Manifest V3 Extension — Component Map', icon: '🧩', summary: 'Service Worker, Content Script, Offscreen, and Side Panel.' },
      { id: 'perception-loop', origId: 'perception-loop', title: '03. Perception Pipeline — How the Agent Sees the Page', icon: '👁️', summary: 'Synchronous fusion of DOM accessibility tree and visual bitmap.' },
      { id: 'action-engine', origId: 'action-engine', title: '04. Action Execution Engine — All Supported Actions', icon: '🕹️', summary: 'Atomic commands for Click, Input, Select, Scroll, Wait, and Assert.' },
      { id: 'rehydration', origId: 'rehydration', title: '05. The Reversible Rehydration Vault', icon: '🔐', summary: 'Ephemeral cryptographic key lifecycle and zero-disk persistence.' },
      { id: 'security', origId: 'security', title: '06. Security & Adversarial Hardening', icon: '🛡️', summary: 'Prompt injection defense, honeypot evasion, and sandboxing.' },
      { id: 'wire-protocol', origId: 'wire-protocol', title: '07. Client ↔ Server Wire Protocol (Full Schema)', icon: '📜', summary: 'Production JSON Schema definitions for task and action frames.' },
      { id: 'demo-flow', origId: 'demo-flow', title: '08. ISRO SIH Stage Demo Scenario — Step-by-Step', icon: '🎬', summary: 'GeM supplier tender submission walkthrough.' }
    ]
  },
  {
    id: 'module-03',
    num: '03',
    route: '/03-privacy-shield',
    title: 'Dual-Channel Perception Shield & WebGPU Privacy Vault',
    icon: '🛡️',
    badge: 'PRIVACY & WEBGPU',
    desc: 'Deep perception problem analysis: the 7 fatal DOM blindspots, DOM vs Vision matrix, 8x8 dirty tiles, 4 local vision models, Indian PII rule engine, and full perceive code.',
    sections: [
      { id: 'blindspots', origId: 'blindspots', title: '01. What the DOM Cannot See — The 7 Fatal Blindspots', icon: '🙈', summary: 'Canvas, WebGL, SVG, Shadow DOM, iFrames, and PDFs.' },
      { id: 'dual-channel', origId: 'dual-channel', title: '02. DOM Channel vs Vision Channel — Capability Matrix', icon: '⚖️', summary: 'Exhaustive feature-by-feature comparison matrix.' },
      { id: 'dirty-tiles', origId: 'dirty-tiles', title: '03. Cascaded 8×8 Dirty-Tile Perceptual Hash Filter', icon: '⚡', summary: 'Temporal frame diffing algorithm saving 85%+ GPU cycles.' },
      { id: 'models', origId: 'models', title: '04. The Four Local Vision Models — Technical Specifications', icon: '🧠', summary: 'DBNet-Tiny, Ultra-Light-Face, Indic CRNN, and MobileNetV4.' },
      { id: 'rule-engine', origId: 'rule-engine', title: '05. Indian Sovereign PII Rule Engine — Algorithmic Certainty', icon: '🇮🇳', summary: 'Verhoeff checksum for Aadhaar, PAN regex, and GSTIN validator.' },
      { id: 'complete-perceive', origId: 'complete-perceive', title: '06. The Complete, Corrected PERCEIVE Step Implementation', icon: '💻', summary: 'Production TypeScript perceive loop implementation.' }
    ]
  },
  {
    id: 'module-04',
    num: '04',
    route: '/04-hld',
    title: 'High-Level Architecture & Microservices Specification',
    icon: '📐',
    badge: 'SYSTEM DESIGN & INTERACTION',
    desc: 'Complete 10-section High-Level Design: authentic Mermaid 10 architecture flowchart and sequence diagram on PanZoom canvas, microservices inventory, API contracts, security, data storage, deployment topology, ADRs, and roadmap.',
    sections: [
      { id: 's1', origId: 's1', title: '01. System Overview — The Big Picture (Mermaid)', icon: '📐', summary: 'Interactive PanZoom Mermaid architecture topology.' },
      { id: 's2', origId: 's2', title: '02. Microservices Inventory', icon: '📦', summary: 'Detailed specifications for all 7 platform services.' },
      { id: 's3', origId: 's3', title: '03. 7-Step Data-Flow Architecture (Mermaid Sequence)', icon: '⏱️', summary: 'Full cryptographic sequence flow across 8 participants.' },
      { id: 's4', origId: 's4', title: '04. API Contract Specification', icon: '📜', summary: 'REST, WebSocket, and JSON Schema interface definitions.' },
      { id: 's5', origId: 's5', title: '05. Security Architecture', icon: '🔒', summary: 'Egress filtering, mTLS 1.3, and Merkle audit chain.' },
      { id: 's6', origId: 's6', title: '06. Data Storage Design', icon: '💾', summary: 'Postgres, Redis Cluster, TimescaleDB, and MinIO S3.' },
      { id: 's7', origId: 's7', title: '07. Deployment Topology', icon: '🌐', summary: 'Air-gapped enterprise deployment and hardware allocation.' },
      { id: 's8', origId: 's8', title: '08. Scalability & Resilience', icon: '⚡', summary: 'Fault isolation, automated fallback, and rate limits.' },
      { id: 's9', origId: 's9', title: '09. Architecture Decision Records (ADRs)', icon: '📋', summary: 'Formal ADR-001 through ADR-004 engineering records.' },
      { id: 's10', origId: 's10', title: '10. Build Roadmap — Sprint Plan', icon: '🗓️', summary: 'Detailed development and testing delivery schedule.' }
    ]
  },
  {
    id: 'module-05',
    num: '05',
    route: '/05-extension',
    title: 'Manifest V3 Browser Extension & Privacy Shield Implementation',
    icon: '🧩',
    badge: 'CHROME MV3 CODEBASE',
    desc: 'Complete 12-section Chrome MV3 extension architecture: strategic rationale, MV3 changes, file structure, component deep dive, message passing, screen capture, DOM extraction, WebGPU worker, vault layer, CSP, and side panel UI.',
    sections: [
      { id: 's1', origId: 's1', title: '01. Why a Chrome Extension — Strategic Rationale', icon: '🎯', summary: 'Zero-install deployment and tab sandbox integration.' },
      { id: 's2', origId: 's2', title: '02. Manifest V3 Architecture — Key Changes', icon: '⚙️', summary: 'Service worker lifecycle and remote code restrictions.' },
      { id: 's3', origId: 's3', title: '03. Project File Structure', icon: '📁', summary: 'Monorepo organization and build artifacts.' },
      { id: 's4', origId: 's4', title: '04. Extension Components — Deep Dive', icon: '🧩', summary: 'Service worker, content scripts, and offscreen context.' },
      { id: 's5', origId: 's5', title: '05. Message Passing Protocol', icon: '💬', summary: 'Cross-context RPC and typed event bus.' },
      { id: 's6', origId: 's6', title: '06. Screen Capture Pipeline', icon: '📸', summary: 'captureVisibleTab optimizations and dirty tile diffing.' },
      { id: 's7', origId: 's7', title: '07. DOM Extraction Strategy', icon: '🌳', summary: 'TreeWalker serialization and bounding box computation.' },
      { id: 's8', origId: 's8', title: '08. WebGPU in Chrome Extension — Implementation', icon: '🚀', summary: 'Hardware-accelerated ONNX inference in offscreen document.' },
      { id: 's9', origId: 's9', title: '09. Vault & Privacy Layer', icon: '🔐', summary: 'In-memory AES-256-GCM token substitution.' },
      { id: 's10', origId: 's10', title: '10. Permissions Model & Content Security Policy', icon: '🛡️', summary: 'Least privilege permissions and WASM security policy.' },
      { id: 's11', origId: 's11', title: '11. Side Panel UI Design', icon: '🎛️', summary: 'React 18 operator HUD with L3 approval gate.' },
      { id: 's12', origId: 's12', title: '12. Build & Distribution', icon: '📦', summary: 'Vite bundling, CRX packaging, and enterprise deployment.' }
    ]
  },
  {
    id: 'module-06',
    num: '06',
    route: '/06-roadmap',
    title: 'Hackathon Delivery Roadmap & Judge Defense Protocol',
    icon: '⏱️',
    badge: 'EXECUTION & JURY WINNING',
    desc: '36-hour sprint delivery roadmap, interactive timeline, judge defense cheat sheet answering tough evaluator challenges, and 60-second closing pitch.',
    sections: [
      { id: 'roadmap', origId: 'roadmap', title: '01. 36-Hour Hackathon Delivery Timeline & Milestones', icon: '⏱️', summary: 'Four 9-hour sprints dividing frontend, vision, and orchestrator.' },
      { id: 'defense', origId: 'defense', title: '02. Judge Defense Cheat Sheet & Competitive Moats', icon: '🛡️', summary: 'Mathematical answers to jury objections and counter-arguments.' },
      { id: 'pitch', origId: 'pitch', title: '03. 60-Second Closing Elevator Pitch', icon: '🎤', summary: 'The decisive closing argument for ISRO SAC evaluation.' }
    ]
  }
];
