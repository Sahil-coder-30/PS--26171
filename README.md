# SIH 2026 — Problem Statement 26171 (ISRO)
## On-Device Visual Perception for Light-Weight Browser Agents

**Codename: PRATYAKSHA (प्रत्यक्ष)**  
*Privacy-preserving Real-time Agentic Tokenizer & Vision-Augmented Knowledge Shield for Autonomous Workflows*

**Organization**: Indian Space Research Organisation (ISRO) / Department of Space  
**Category**: Software | **Theme**: Smart Automation  

---

## 🌐 Live Web Documentation Suite (Ready for Vercel)

This repository contains a full HTML5/CSS3 documentation suite in warm light cream mode, featuring executive dashboards, architecture diagrams, and complete source code specifications.

| File | Description |
|------|-------------|
| [**`Master Hub (index.html)`**](./Docs/index.html) | **Master Portal**: Unified executive dashboard, visual comparison diagrams, and module navigator for all 5 modules |
| [**`Project Readme (HTML)`**](./Docs/readme.html) | **Interactive Readme**: Web version of this README with rubric gauges, architecture diagrams, and direct links |
| [**`Module 01: Master Plan`**](./Docs/01_master_plan.html) | **Strategic Blueprint**: Full research, PS analysis, 12 competitive benchmarks, evaluation strategy, and team sprint plan |
| [**`Module 02: Browser Agent`**](./Docs/02_browser_agent.html) | **Execution Engine**: Browser extension agent — perception-action loop, DOM interaction engine, rehydration vault, wire protocol, and demo script |
| [**`Module 03: Perception Problem`**](./Docs/03_perception_problem.html) | **Neural Vision Models**: 7 DOM blindspots (PDF, canvas, video, shadow DOM), dual-channel WebGPU vision pipeline, and model specs |
| [**`Module 04: High-Level Design (HLD)`**](./Docs/04_hld.html) | **Microservices Architecture**: 8 microservices inventory, 7-step data flow, API contract spec, security matrix, database schemas, and ADRs |
| [**`Module 05: Chrome Extension`**](./Docs/05_browser_extension.html) | **Extension Deep Dive**: Manifest V3 build specification, file structure, Service Worker, Offscreen Document, Content Script, WebGPU ONNX integration, and Web Store distribution |

---

## 🧭 Problem Statement Summary

ISRO requires a **privacy-preserving vision agent** that runs directly in the browser. The core requirement:

> *Sensitive/PII data must be sanitized **before** any network request is made. Only anonymized, unidentifiable data should be transmitted to the central server.*

The central server VLM processes the sanitized context and returns **actionable commands** (click, type, scroll) that the browser agent executes autonomously.

---

## ⚖️ Evaluation Rubric

| # | Metric | Weight | Focus |
|---|--------|--------|-------|
| 1 | Accuracy of visual context from screen | 25% | Server VLM comprehension |
| 2 | Recall & Precision for PII detection | 20% | High recall on Indian identity credentials |
| 3 | Precision of redaction | 20% | Pixel-level bounding box masks without layout distortion |
| 4 | Client-side resource utilization | 20% | <85MB VRAM, <8% CPU on standard government laptops |
| 5 | End-to-end task latency | 15% | Sub-50ms local sanitization |

> **40% of marks are pure privacy.** This is a sanitization platform with an agent attached — not an agent with privacy as an afterthought.

---

## 🏗️ System Architecture at a Glance

```
Browser Extension (Chrome MV3 / Firefox WebExtension)
│
├── 1. PERCEIVE    → chrome.tabs.captureVisibleTab() + DOM Scene Tree Extractor
├── 2. SANITIZE    → Offscreen WebGPU Pipeline (Ultra-Light-Face + DBNet + CRNN)
│                     ├── Verhoeff (Aadhaar), Modulo-36 (GSTIN), IFSC Dictionary
│                     └── Reversible Pseudonym Vault (Local In-Memory Map)
├── 3. TRANSMIT    → Only Sanitized Canvas + Tokenized Scene Graph → HTTPS/WSS
│
└──► SERVER (ISRO Intranet / Self-Hosted Enterprise GPU Node)
         Qwen2.5-VL-7B-Instruct (Open-Weights, 100% Offline Deployable)
         Receives: Sanitized pixels + semantic tokens (⟨AADHAAR_01⟩, ⟨PAN_01⟩)
         Returns:  Structured JSON Action Plan with token targets
┌─── CLIENT RETURN
│
├── 4. REHYDRATE   → Client Rehydration Vault swaps tokens back to real values LOCALLY
└── 5. EXECUTE     → Content Script synthesizes events (click, type, scroll) in DOM
```

---

## 🚀 Our Core Innovations

1. **Reversible Pseudonymization Vault** — Replaces PII with semantic tokens (`⟨AADHAAR_01⟩`). Server plans using tokens; client rehydrates locally. Real values never leave the device.
2. **Fail-Closed Dual-Channel Fusion** — DOM structural analysis + WebGPU vision model fusion. If either detects PII, it masks. High-risk pages default to paranoid redaction.
3. **Indian Sovereign PII Stack** — Verhoeff checksum (Aadhaar), PAN/GSTIN modulo validators, IFSC registry, Devanagari OCR. Zero false positives through algorithmic certainty.
4. **Cryptographic Egress Ledger** — SHA-256 Merkle-chained audit log of every byte that leaves the device. Live split-screen diff HUD for real-time verification.
5. **Browser Agent Execution Engine** — Structured JSON action protocol; the extension executes `click`, `type`, `scroll`, `navigate`, `extract` from server commands, with mandatory human confirmation for destructive actions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Browser Extension | Chrome Manifest V3 (MV3), Firefox WebExtension |
| On-Device ML | ONNX Runtime Web (`@webgpu` + `@wasm` fallback) |
| Vision Models | Ultra-Light-Face, DBNet-Tiny, CRNN (ONNX, ~20MB total) |
| Server VLM | Qwen2.5-VL-7B-Instruct via vLLM / Ollama |
| PII Rules | Custom TS/JS: Verhoeff, PAN regex, GSTIN modulo-36 |
| Security | SHA-256 hash chain, CSP, action allowlist, injection guards |

---

## 🚀 Deploying to Vercel

To deploy this documentation portal on Vercel so teammates can view it:

### Method 1: Vercel CLI
```bash
npx vercel deploy --prod
```

### Method 2: GitHub / Vercel Dashboard
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Leave build settings default. The included `vercel.json` and root `index.html` will automatically serve the master documentation portal with clean URLs.

---

*All blueprints and code samples are contained within [`/Docs`](./Docs/). Start at [`Docs/index.html`](./Docs/index.html) or [`Docs/readme.html`](./Docs/readme.html).*
