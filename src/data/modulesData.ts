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
    desc: 'Strategic problem statement analysis (ISRO SAC PS-26171), core perception dilemma, and the 5-step execution flow.',
    sections: [
      { id: 'm0-overview', origId: 'overview', title: '1. Executive Summary & Core Mission', icon: '🎯', summary: 'High-level mission statement and sovereign agent principles.' },
      { id: 'm0-problem', origId: 'problem', title: '2. The Core Perception & Privacy Paradox', icon: '⚡', summary: 'Why conventional cloud agents leak PII and fail on canvas.' },
      { id: 'm0-architecture', origId: 'architecture', title: '3. Architectural Blueprint & 5-Step Pipeline', icon: '🏛️', summary: 'End-to-end flow from viewport capture to rehydration.' },
      { id: 'm0-innovation', origId: 'innovation', title: '4. Six Core Technical Innovations', icon: '💡', summary: 'WebGPU OCR, Local Vault, LangGraph DAG, and Zero-Trust.' },
      { id: 'm0-rubric', origId: 'rubric', title: '5. Evaluation Rubric Alignment (100 Pts)', icon: '📊', summary: 'Detailed 100-point SIH evaluation scorecard.' }
    ]
  },
  {
    id: 'module-01',
    num: '01',
    route: '/01-strategy',
    title: 'Master Plan, Strategy & Competitive Moats',
    icon: '🎯',
    badge: 'EVALUATION & STRATEGY',
    desc: '100-point rubric breakdown, master plan flowchart, market analysis, 6 core innovations, and benchmark target metrics.',
    sections: [
      { id: 'm1-s1', origId: 's1', title: '01. Executive Overview & Problem Context', icon: '🚀', summary: 'Strategic alignment with national space missions.' },
      { id: 'm1-s2', origId: 's2', title: '02. 100-Point Evaluation Rubric Breakdown', icon: '⚖️', summary: 'Scoring breakdown across all 5 evaluation dimensions.' },
      { id: 'm1-s3', origId: 's3', title: '03. Master Plan Architecture Flowchart', icon: '📐', summary: 'Mermaid strategy flowchart of client-to-cloud execution.' },
      { id: 'm1-s4', origId: 's4', title: '04. Competitive Landscape & Market Moats', icon: '🛡️', summary: 'Head-to-head comparison with Browser-Use, Adept, and OpenAI Operator.' },
      { id: 'm1-s5', origId: 's5', title: '05. Six Core Technological Innovations', icon: '⚡', summary: 'Deep dive into our architectural patents and moats.' }
    ]
  },
  {
    id: 'module-02',
    num: '02',
    route: '/02-browser-agent',
    title: 'Browser Agent Autonomous Execution Engine',
    icon: '🤖',
    badge: 'AGENT ARCHITECTURE',
    desc: 'DOM + Vision dual-stream perception, action schema, LangGraph state graph, and self-healing loop.',
    sections: [
      { id: 'm2-s1', origId: 's1', title: '01. Dual-Channel Perception Architecture', icon: '👁️', summary: 'Synchronous fusion of DOM accessibility tree and visual bitmap.' },
      { id: 'm2-s2', origId: 's2', title: '02. Action Schema & Atomic Commands', icon: '🕹️', summary: 'JSON Schema definition for Click, Type, Scroll, Wait, and Assert.' },
      { id: 'm2-s3', origId: 's3', title: '03. LangGraph State Orchestration Graph', icon: '🔄', summary: 'State machine nodes, conditional edges, and checkpointing.' },
      { id: 'm2-s4', origId: 's4', title: '04. Self-Healing & Error Recovery Loop', icon: '🩹', summary: 'Automatic retry, scroll re-anchoring, and DOM tree diffing.' }
    ]
  },
  {
    id: 'module-03',
    num: '03',
    route: '/03-privacy-shield',
    title: 'Dual-Channel Perception Shield & WebGPU Privacy Vault',
    icon: '🛡️',
    badge: 'PRIVACY & WEBGPU',
    desc: 'Mathematical formulation, WebGPU offscreen ML pipeline, interactive PII simulator, AES-256 local vault, and benchmark tables.',
    sections: [
      { id: 'm3-s1', origId: 's1', title: '01. Mathematical Zero-Egress Formulation', icon: '📐', summary: 'Formal proof of ε-differential privacy and token preservation.' },
      { id: 'm3-s2', origId: 's2', title: '02. Interactive WebGPU Privacy Shield Simulator', icon: '⚡', summary: 'Real-time testbed with instant Verhoeff checksum & PII sanitization.' },
      { id: 'm3-s3', origId: 's3', title: '03. WebGPU Offscreen Neural Pipeline', icon: '🚀', summary: 'DBNet text detection and Ultra-Light face detection in browser.' },
      { id: 'm3-s4', origId: 's4', title: '04. In-Memory AES-256 Token Vault Lifecycle', icon: '🔐', summary: 'Ephemeral cryptographic key lifecycle and zero-disk persistence.' }
    ]
  },
  {
    id: 'module-04',
    num: '04',
    route: '/04-hld',
    title: 'High-Level Architecture & Microservices Specification',
    icon: '📐',
    badge: 'SYSTEM DESIGN & INTERACTION',
    desc: 'Authentic Mermaid 10 architecture diagram on PanZoom canvas, operational sequence flow, microservices inventory, and API contracts.',
    sections: [
      { id: 'm4-s1', origId: 's1', title: '01. 4-Stage System Architecture Topology (Mermaid)', icon: '📐', summary: 'Complete interactive PanZoom Mermaid architecture topology.' },
      { id: 'm4-s2', origId: 's2', title: '02. Microservices Inventory & Specs', icon: '📦', summary: 'Detailed specifications for all 7 platform services.' },
      { id: 'm4-s3', origId: 's3', title: '03. 7-Step Operational Sequence Flow (Mermaid)', icon: '⏱️', summary: 'Full cryptographic sequence flow across 8 participants.' },
      { id: 'm4-s4', origId: 's4', title: '04. Microservices API & WebSocket Contracts', icon: '📜', summary: 'REST, WebSocket, and JSON Schema interface definitions.' },
      { id: 'm4-s5', origId: 's5', title: '05. Security Architecture & Zero-Trust Boundary', icon: '🔒', summary: 'Egress filtering, mTLS 1.3, and Merkle audit chain.' },
      { id: 'm4-s6', origId: 's6', title: '06. Enterprise Data Storage Design', icon: '💾', summary: 'Postgres, Redis Cluster, TimescaleDB, and MinIO S3.' },
      { id: 'm4-s7', origId: 's7', title: '07. Deployment Topology & ISRO Intranet DMZ', icon: '🌐', summary: 'Air-gapped enterprise deployment and hardware allocation.' },
      { id: 'm4-s8', origId: 's8', title: '08. Scalability, Resilience & Circuit Breakers', icon: '⚡', summary: 'Fault isolation, automated fallback, and rate limits.' },
      { id: 'm4-s9', origId: 's9', title: '09. Architectural Decision Records (ADRs)', icon: '📋', summary: 'Formal ADR-001 through ADR-003 engineering records.' },
      { id: 'm4-s10', origId: 's10', title: '10. Build Roadmap & Sprint Milestones', icon: '🗓️', summary: 'Detailed development and testing delivery schedule.' }
    ]
  },
  {
    id: 'module-05',
    num: '05',
    route: '/05-extension',
    title: 'Manifest V3 Browser Extension & Privacy Shield Implementation',
    icon: '🧩',
    badge: 'CHROME MV3 CODEBASE',
    desc: 'Service worker, content scripts, WebGPU offscreen document, Side Panel UI, and test suite.',
    sections: [
      { id: 'm5-s1', origId: 's1', title: '01. Manifest V3 Declarative Blueprint', icon: '📋', summary: 'Production manifest.json configuration and security policies.' },
      { id: 'm5-s2', origId: 's2', title: '02. Background Service Worker & Message Router', icon: '⚙️', summary: 'Asynchronous event routing and lifecycle management.' },
      { id: 'm5-s3', origId: 's3', title: '03. WebGPU Offscreen Document Worker', icon: '🚀', summary: 'Hardware-accelerated ONNX inference isolated from webpage.' },
      { id: 'm5-s4', origId: 's4', title: '04. Side Panel Audit & Control HUD', icon: '🎛️', summary: 'Real-time human-in-the-loop approval gate and telemetry feed.' }
    ]
  },
  {
    id: 'module-06',
    num: '06',
    route: '/06-roadmap',
    title: 'Hackathon Delivery Roadmap & Judge Defense Protocol',
    icon: '⏱️',
    badge: 'EXECUTION & JURY WINNING',
    desc: '36-hour sprint schedule, interactive timeline, jury defense cheat sheet, and 60-second closing pitch.',
    sections: [
      { id: 'm6-roadmap', origId: 'roadmap', title: '01. 36-Hour Hackathon Delivery Timeline & Milestones', icon: '⏱️', summary: 'Four 9-hour sprints dividing frontend, vision, and orchestrator.' },
      { id: 'm6-defense', origId: 'defense', title: '02. Judge Defense Cheat Sheet & Competitive Moats', icon: '🛡️', summary: 'Mathematical answers to jury objections and closing pitch.' }
    ]
  }
];
