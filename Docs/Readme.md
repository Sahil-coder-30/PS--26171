# SIH 2026 — Problem Statement 26171 (ISRO)
## On-Device Visual Perception for Light-Weight Browser Agents

**Codename: PRATYAKSHA (प्रत्यक्ष)**  
*Privacy-preserving Real-time Agentic Tokenizer & Vision-Augmented Knowledge Shield for Autonomous Workflows*

**Organization**: Indian Space Research Organisation (ISRO) / Department of Space  
**Category**: Software | **Theme**: Smart Automation  

---

## 📂 Documentation Suite (Organized by Architectural Track)

### Track 1 · Strategy &amp; Executive Alignment
| Module | Document | Scope &amp; Focus | Target Audience |
|:---:|:---|:---|:---|
| **HUB** | [`index.html`](./index.html) | **Master Documentation Hub**: Unified executive dashboard, visual comparison diagrams, interactive system topology, and centralized module switcher | Jury, Evaluators &amp; Leads |
| **DOC** | [`readme.html`](./readme.html) | **Interactive Project Brief**: Live web version of this README with rubric gauges, architecture flows, and 5-step pill diagram | All Stakeholders |
| **06** | [`06_team_presentation.html`](./06_team_presentation.html) | **Pitch Deck &amp; Gemini Comparison**: Pitch deck, Gemini in Chrome showdown matrix, user journey, and 4-track engineering role breakdown | Jury, Team &amp; Evaluators |
| **01** | [`01_master_plan.html`](./01_master_plan.html) | **Master Strategic Blueprint**: Full research, PS analysis, 12-competitor showdown, decoded 40% rubric, and sprint roadmap | Strategy &amp; Tech Leads |

### Track 2 · System Architecture &amp; Reality Audits
| Module | Document | Scope &amp; Focus | Target Audience |
|:---:|:---|:---|:---|
| **04** | [`04_hld.html`](./04_hld.html) | **High-Level Design (HLD)**: 8 microservices inventory (4 local + 4 cloud), API contract spec, WebSocket protocol, security matrix, and ADRs | System Architects &amp; Backend |
| **07** | [`07_reality_check_and_innovations.html`](./07_reality_check_and_innovations.html) | **Reality Audit &amp; 6 Innovations**: Stripped marketing claims, realistic latency benchmarks, sustainable ML stack, and 6 defensible jury moats | ISRO Jury &amp; Reviewers |

### Track 3 · Deep-Dive Engineering Modules
| Module | Document | Scope &amp; Focus | Target Audience |
|:---:|:---|:---|:---|
| **08** | [`08_ml_privacy_module.html`](./08_ml_privacy_module.html) | **⭐ ML &amp; Privacy Module (Official Spec)**: Local privacy firewall, 17-feature set, PaddleOCR.js, YOLO26n ONNX, BERT NER, Layered PII, Entity Resolver (IoU fusion), Session Token Vault, Visual Redactor, and 17-step build plan | ML Engineers &amp; Privacy Leads |
| **03** | [`03_perception_problem.html`](./03_perception_problem.html) | **Neural Vision &amp; Perception Blindspots**: 7 DOM blindspots (PDFs, canvas, scans), 8×8 dirty-tile dHash filter, 4 quantized ONNX models (~20MB), and Verhoeff engine | ML &amp; Vision Engineers |
| **05** | [`05_browser_extension.html`](./05_browser_extension.html) | **Chrome MV3 Extension Deep Dive**: Service Worker, Offscreen Document, Content Script, Side Panel HUD, WebGPU ONNX execution, and Web Store distribution | Extension &amp; Frontend Leads |
| **02** | [`02_browser_agent.html`](./02_browser_agent.html) | **Browser Agent &amp; Action Dispatcher**: Perception-action loop, 10 synthetic DOM actions, local rehydration vault, prompt injection defense, and e-procurement demo script | Agent &amp; Automation Leads |

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

## 🏗️ System Architecture at a Glance (Local Privacy Firewall)

```
RAW WEBPAGE (Live DOM Tree + Screen Pixels)
│
▼
LOCAL PRIVACY FIREWALL (Client-Side Extension / Web Worker Sandbox)
├── DOM Analyzer              Semantic HTML signals, labels, input types, autocomplete, ARIA, bboxes
├── PaddleOCR.js / PP-OCRv5   Sub-millisecond character extraction, word polygons, confidence
├── YOLO26n ONNX (WebGPU)     Visual detection: FACE, ID_CARD, PASSPORT, CREDIT_CARD, SIGNATURE, QR/BARCODE
├── BERT-base NER (ONNX)      Contextual named entities: PERSON, LOCATION, ORGANIZATION
├── Structured PII Rules      Verhoeff/Luhn checksums, PAN/GSTIN modulo, Email/Phone regex
├── Entity Resolver           Spatial IoU fusion & multi-source confidence weighting
├── Session Manager           Stable anonymous identities ([PERSON_A71C], crypto.getRandomValues)
├── Semantic Anonymizer       Surgical text span rewriting preserving page reasoning layout
├── Visual Redactor           Irreversible canvas pixel masking with 15% safety padding
└── Sanitized Context Builder Compact JSON schema wire payload (elements + pseudonyms)
│
▼
FINAL PRIVACY GATE (Fail-Closed Outbound Audit Barrier)
├── Blocks: Raw DOM [X], Raw OCR [X], Raw PII [X], Session Mapping Vault [X]
└── Allows: Redacted Screenshot WebP + Sanitized Semantic JSON Payload
│
▼
SERVER AI AGENT (ISRO Intranet / Cloud VLM)
└── Reasons over [PERSON_A71C], element roles, and masked screenshot → returns action JSON (CLICK, TYPE, SCROLL)
```

---

## 🚀 Core Innovations & Capabilities

1. **Reversible Pseudonymization Vault** — Replaces PII with semantic tokens (`[PERSON_A71C]`, `[AADHAAR_9F12]`). Server plans using tokens; client rehydrates locally. Real values never leave the device.
2. **Fail-Closed Multi-Modal Fusion** — DOM structural analysis + PaddleOCR + YOLO26n visual detection + BERT-base NER fused via geometric IoU overlap.
3. **Indian Sovereign PII Stack** — Verhoeff checksum (Aadhaar), PAN/GSTIN modulo validators, IFSC registry, Devanagari OCR. Zero false positives through algorithmic certainty.
4. **Final Privacy Gate & Egress Audit** — Fail-closed verification barrier: regex scan of serialized JSON + canvas pixel confirmation + post-redaction OCR verification.
5. **Non-Blocking Web Worker Isolation** — Offloads all heavy ML inference (YOLO26n, PaddleOCR, BERT) to dedicated Web Workers with WebGPU/WASM to keep host DOM at 60 FPS.
6. **10-Step Operational Execution Loop** — `OBSERVE` → `DETECT` → `FUSE` → `IDENTIFY` → `PROTECT` → `VERIFY` → `SEND` → `REASON` → `ACT` → `OBSERVE AGAIN`.

---

## 🛠️ Complete Tech Stack (16 Layers)

| Layer | Technology | Role |
|-------|-----------|------|
| Browser Extension | Chrome Manifest V3 (MV3), Firefox WebExtension | Page lifecycle integration, tab control, screenshot access, sandboxed messaging |
| Frontend Language | JavaScript (ES2022) / TypeScript | Extension logic, privacy engine, deterministic validation rules |
| DOM Inspection | DOM APIs + `MutationObserver` | Zero-inference semantic extraction, bounding coordinate queries, SPA tracking |
| OCR Engine | `PaddleOCR.js` / `PP-OCRv5` | Local browser character recognition, word polygons, confidence metrics |
| Computer Vision | `YOLO26n` (ONNX Runtime Web) | Visual privacy-object detection (faces, cards, IDs, signatures, QR codes) |
| Model Format | `ONNX` | Standardized portable model serialization optimized for web runtime execution |
| Contextual NER | `BERT-base NER` (Transformers.js) | Unstructured text token entity recognition (PERSON, LOCATION, ORG) |
| Inference Runtime | `ONNX Runtime Web` | High-performance client-side execution of ONNX models |
| NLP Runtime | `Transformers.js` | Browser-friendly pipeline for tokenization, embeddings, and NER classification |
| Acceleration | `WebGPU` | Direct GPU compute shader execution for low-latency neural model passes |
| CPU Fallback | `WASM` (SIMD + Multi-Threading) | Cross-browser CPU execution when WebGPU is unavailable or disabled |
| Concurrency | `Web Workers` | Non-blocking multi-threaded processing isolating inference from host page DOM |
| Image Processing | `Canvas API` / `ImageBitmap` | Zero-copy image slicing, pixel masking, blurring, and WebP compression |
| Storage / State | In-Memory Session State (JS `Map`) | Transient pseudonym mapping vault; strictly ephemeral; no disk logging |
| Communication | `postMessage` + HTTPS / WSS | Worker-to-background messaging and encrypted server agent wire protocol |
| Server Handoff | Sanitized JSON + Masked Image | Compact semantic context payload delivered to remote AI agent |

---

## 👥 Team Role Distribution

| Role | Focus |
|------|-------|
| ML Engineer / Privacy Lead | Browser-side Privacy Firewall, YOLO26n, PaddleOCR.js, BERT-base NER, Entity Resolver, Privacy Gate |
| Extension & UI Lead | MV3 scaffold, content scripts, action dispatcher, Side Panel HUD, Web Worker messaging |
| Security & Vault Lead | Verhoeff/PAN validators, session pseudonym vault, egress ledger, fail-closed audit |
| Server & VLM Lead | Qwen2.5-VL / InternVL2.5 server, structured action JSON protocol, local intranet deployment |
| Benchmark & Demo Lead | IndoGov-PII Bench, mock e-Office portal, end-to-end evaluation suite, pitch deck |

---

*All work is documented in the HTML files in this Docs folder. Start with `index.html` for the Master Hub, or jump directly to `08_ml_privacy_module.html` for the complete ML & Privacy Module specification.*

