# SIH 2026 — Problem Statement 26171 (ISRO)
## On-Device Visual Perception for Light-Weight Browser Agents

**Codename: PRATYAKSHA (प्रत्यक्ष)**  
*Privacy-preserving Real-time Agentic Tokenizer & Vision-Augmented Knowledge Shield for Autonomous Workflows*

**Organization**: Indian Space Research Organisation (ISRO) / Department of Space  
**Category**: Software | **Theme**: Smart Automation  

---

## 📂 Documentation Index

| File | Description |
|------|-------------|
| [`index.html`](./index.html) | **Master Documentation Portal**: Unified executive dashboard, visual comparison diagrams, and module navigator in warm light cream mode |
| [`01_master_plan.html`](./01_master_plan.html) | **Module 01**: Full research, PS analysis, competitive landscape, architecture, evaluation strategy, and team sprint plan |
| [`02_browser_agent.html`](./02_browser_agent.html) | **Module 02**: Browser extension agent — perception-action loop, DOM interaction engine, rehydration vault, wire protocol, and demo script |
| [`03_perception_problem.html`](./03_perception_problem.html) | **Module 03**: The perception problem — 7 DOM blindspots (PDF, canvas, video, shadow DOM), dual-channel WebGPU vision pipeline, and model specs |

---

## 🧭 Problem Statement Summary

ISRO requires a **privacy-preserving vision agent** that runs in the browser. The core requirement:

> *Sensitive/PII data must be sanitized **before** any network request is made. Only anonymized, unidentifiable data should be transmitted to the central server.*

The server VLM then processes the sanitized context and returns **actionable commands** (click, type, scroll) that the browser agent executes.

---

## ⚖️ Evaluation Rubric

| # | Metric | Weight |
|---|--------|--------|
| 1 | Accuracy of visual context from screen | 25% |
| 2 | Recall & Precision for PII detection | 20% |
| 3 | Precision of redaction | 20% |
| 4 | Client-side resource utilization | 20% |
| 5 | End-to-end task latency | 15% |

**40% of marks are pure privacy.** This is a sanitization platform with an agent attached — not the other way around.

---

## 🏗️ System Architecture at a Glance

```
Browser Extension (Chrome MV3 / Firefox)
│
├── CONTENT SCRIPT            DOM extraction, screen capture, action injection
├── OFFSCREEN WORKER          Privacy Shield (Local Vision Models on WebGPU)
│   ├── Face Detector         Ultra-Light-Fast-Face (~2.5MB ONNX)
│   ├── Text Region Detector  DBNet-Tiny (~6MB ONNX)
│   ├── OCR Engine            CRNN + Indic fine-tune (~8MB ONNX)
│   ├── PII Rule Engine       Verhoeff/PAN/GSTIN/IFSC validators (pure JS)
│   └── Pseudonym Vault       In-memory token ↔ real-value map
├── SERVICE WORKER            Session, egress ledger (SHA-256 chain), routing
└── SIDE PANEL / POPUP        Audit HUD, paranoid mode toggle, ledger viewer
│
└──► SERVER (ISRO Intranet / localhost)
         Qwen2.5-VL-7B / InternVL2.5 (open-weights, offline-deployable)
         Receives: Sanitized canvas + scene graph with placeholder tokens
         Returns:  Structured JSON action plan referencing placeholder tokens
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
| PII Rules | Custom JS: Verhoeff, PAN regex, GSTIN modulo-36 |
| Security | SHA-256 hash chain, CSP, action allowlist, injection guards |

---

## 👥 Team Role Distribution

| Role | Focus |
|------|-------|
| Extension & UI Lead | MV3 scaffold, content scripts, action dispatcher, HUD |
| Edge ML Lead | ONNX model pipeline, WebGPU worker, dirty-tile optimizer |
| PII & Security Lead | Verhoeff/PAN validators, pseudonym vault, egress ledger |
| Server & VLM Lead | Qwen2.5-VL server, structured action JSON protocol |
| Benchmark & Demo Lead | IndoGov-PII Bench, mock e-Office portal, pitch deck |

---

*All work is documented in the HTML files in this Docs folder. Start with `01_master_plan.html` for the full picture.*
