// Real Production Mermaid Diagrams Extracted Directly from ISRO SAC HLD & Master Plan Specifications

export const HLD_ARCHITECTURE_MERMAID = `flowchart TD
    %% Custom Semantic Styling Classes
    classDef client fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#1E40AF;
    classDef shield fill:#FFF7ED,stroke:#EA580C,stroke-width:2px,color:#9A3412;
    classDef vault fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px,color:#5B21B6;
    classDef gateway fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef cloud fill:#ECFDF5,stroke:#059669,stroke-width:2px,color:#065F46;
    classDef storage fill:#F8FAFC,stroke:#475569,stroke-width:2px,color:#1E293B;
    classDef gate fill:#FFF1F2,stroke:#E11D48,stroke-width:2px,stroke-dasharray: 4 4,color:#9F1239;

    subgraph PHASE1 ["🔒 STAGE 1: ON-DEVICE PERCEPTION & PRIVACY SHIELD (Client MV3 Sandbox)"]
        direction TB
        User(["👤 User / Security Operator"]):::client
        SidePanel["🖥️ svc-ext-shell (Chrome Side Panel UI · Audit HUD)"]:::client
        TargetTab["🌐 Target Web Portal (ISRO e-Procurement · GeM · SAKSHAM)"]:::client
        ContentExtractor["📜 Content Script (DOM Scene Tree Extractor & Element Walker)"]:::client
        
        subgraph WEBGPU_PIPELINE ["⚡ svc-vision-local (Dedicated WebGPU Offscreen Context)"]
            TileDiff["⚡ 8x8 Dirty-Tile dHash (Temporal Diff Filter · Skips >85% Static Frames)"]:::shield
            NeuralDet["🔍 DBNet-Tiny + Ultra-Light-Face (Neural Text & Biometric Detectors)"]:::shield
            IndicOCR["🔤 Indic CRNN Engine (Devanagari, Tamil, Hindi, Latin OCR)"]:::shield
            PIIRules["🇮🇳 Sovereign PII Validator (Verhoeff Checksum · PAN · GSTIN)"]:::shield
            Inpainter["🎨 Safety Halo Inpainter (4px Dilated Redaction Canvas)"]:::shield
        end

        VaultTokenize[("🔐 svc-vault-local: Tokenize<br/>(Maps Real PII ➔ ⟨SYNTHETIC_TOKENS⟩ in AES-256 Vault)")]:::vault
        MerkleChain[("📜 Tamper-Proof Audit Chain (SHA-256 Merkle Ledger)")]:::vault
    end

    subgraph PHASE2 ["🚪 STAGE 2: ZERO-TRUST EDGE GATEWAY & EGRESS PERIMETER (DMZ)"]
        direction TB
        EgressGuard{"🛡️ Zero-Raw-PII Egress Guard<br/>(Hardware / Heuristic Packet Filter)"}:::gate
        APIGateway["🚪 svc-gateway<br/>(Envoy Ingress · TLS 1.3 mTLS · WSS Proxy)"]:::gateway
        AuthService["🔑 svc-auth<br/>(Device Attestation & Short-Lived JWT)"]:::gateway
    end

    subgraph PHASE3 ["🧠 STAGE 3: SOVEREIGN REASONING TIER (Air-Gapped Intranet)"]
        direction TB
        Orchestrator["🧠 svc-orchestrator<br/>(FastAPI · LangGraph State Machine Loop)"]:::cloud
        SovereignVLM["🤖 svc-vlm-cloud<br/>(Qwen2.5-VL-7B · vLLM PagedAttention GPU)"]:::cloud
        PolicyEngine["📜 svc-policy<br/>(Open Policy Agent · Rego Guardrails)"]:::cloud
        
        subgraph PERSISTENCE ["💾 Enterprise Telemetry & Persistence"]
            PostgresDB[("🗄️ PostgreSQL (Session State & Trajectories)")]:::storage
            RedisCluster[("⚡ Redis Cluster (Locks & Token Cache)")]:::storage
            TimescaleDB[("📊 TimescaleDB (High-Throughput Telemetry)")]:::storage
            MinIOS3[("📦 MinIO S3 (Sanitized Frames & Audit)")]:::storage
        end
    end

    subgraph PHASE4 ["🔐 STAGE 4: LOCAL REHYDRATION & SAFE DOM EXECUTION (Service Worker & Tab)"]
        direction TB
        AgentRunner["🤖 svc-agent-local<br/>(Action Downlink Receiver & State Machine)"]:::client
        HumanApprovalGate{"⚠️ Level-3 Risk Gate<br/>(Mandatory User Confirmation Modal)"}:::gate
        VaultRehydrate[("🔐 svc-vault-local: Rehydrate<br/>(Swaps ⟨TOKEN⟩ ➔ Real PII in Local Volatile RAM)")]:::vault
        DOMDispatcher["📜 Content Script (Synthetic Event Dispatcher)"]:::client
        MutatedTab["🌐 Target Web Portal (Mutated DOM State / Form Filled)"]:::client
    end

    %% STAGE 1 FLOW
    User -->|"1. Submit Task Intent"| SidePanel
    SidePanel -->|"2. Trigger Capture"| ContentExtractor
    ContentExtractor -->|"3a. DOM Scene Tree"| Inpainter
    TargetTab -->|"3b. Viewport Pixels (captureVisibleTab)"| TileDiff
    
    TileDiff -->|"4. Changed Tiles"| NeuralDet
    NeuralDet -->|"5. BBoxes (Text & Faces)"| IndicOCR
    IndicOCR -->|"6. Extracted Strings"| PIIRules
    PIIRules -->|"7. Verified Coordinates"| VaultTokenize
    
    VaultTokenize -->|"8. Synthetic Tokens (⟨AADHAAR_01⟩)"| Inpainter
    Inpainter -->|"9. Sanitized Canvas + Token Graph"| MerkleChain
    MerkleChain -->|"10. Chained Hash Proof"| EgressGuard

    %% STAGE 2 FLOW
    EgressGuard -->|"11. Verified Zero-PII Egress"| APIGateway
    APIGateway <-->|"12. Validate JWT & Device Attestation"| AuthService
    APIGateway -->|"13. Forward Sanitized Request"| Orchestrator

    %% STAGE 3 FLOW
    Orchestrator -->|"14. Visual Reasoning Prompt (Tokens Only)"| SovereignVLM
    SovereignVLM -->|"15. Candidate Action Hypothesis"| PolicyEngine
    PolicyEngine -->|"16. Validated Action JSON"| Orchestrator
    
    Orchestrator -.->|"Session State"| PostgresDB
    Orchestrator -.->|"Token Locks"| RedisCluster
    Orchestrator -.->|"Real-Time Metrics"| TimescaleDB
    Orchestrator -.->|"Sanitized Frame Audit"| MinIOS3

    %% STAGE 4 FLOW (Linear forward transition)
    Orchestrator ==>|"17. WSS Action Plan Downlink"| AgentRunner
    AgentRunner -->|"18. Evaluate Action Severity"| HumanApprovalGate
    HumanApprovalGate -->|"L3 Mutation: Prompt User"| SidePanel
    SidePanel -->|"User Approves"| AgentRunner
    HumanApprovalGate -->|"L1/L2 Safe: Auto-Proceed"| VaultRehydrate
    
    AgentRunner -->|"19. Resolve Token ⟨AADHAAR_01⟩"| VaultRehydrate
    VaultRehydrate -->|"20. Decrypted String (In-Memory Only)"| AgentRunner
    AgentRunner -->|"21. Dispatch Synthetic Event (Click / Type)"| DOMDispatcher
    DOMDispatcher -->|"22. Apply Mutation to Active DOM"| MutatedTab
    MutatedTab -.->|"23. Next Frame Closed-Loop Perception"| TargetTab`;

export const HLD_SEQUENCE_MERMAID = `sequenceDiagram
    autonumber
    actor User as 👤 User / Operator
    participant Tab as 🌐 Target Tab DOM
    participant Content as 📜 Content Script
    participant Offscreen as ⚡ WebGPU Privacy Shield
    participant Vault as 🔐 Local Vault Service
    participant Gateway as 🚪 API Gateway
    participant Orchestrator as 🧠 Orchestrator (LangGraph)
    participant VLM as 🤖 Sovereign VLM (vLLM)

    User->>Content: 1. Submit task intent via Side Panel ("Fill supplier bid")
    Content->>Tab: 2. Traverse interactive elements & computed styles
    Tab-->>Content: 3. Return structured DOM scene tree
    Content->>Offscreen: 4. chrome.tabs.captureVisibleTab() + DOM scene tree
    Note over Offscreen: Stage A: 8x8 dHash skips redundant static tiles<br/>Stage B: DBNet detects text regions in PDFs/Canvases<br/>Stage C: Ultra-Light-Face flags biometrics<br/>Stage D: CRNN OCR extracts Devanagari + Latin strings<br/>Stage E: Verhoeff algorithm validates 12-digit Aadhaar
    Offscreen->>Vault: 5. Register verified PII {type: 'AADHAAR', raw: '5489-1234-8901', bbox}
    Vault-->>Offscreen: 6. Return typed token ⟨AADHAAR_01⟩
    Note over Offscreen: Stage F: 4px safety halo dilation inpainting on canvas<br/>Stage G: SHA-256 Merkle egress hash proof generated
    Offscreen->>Gateway: 7. POST /v1/agent/task (Sanitized canvas + Tokenized scene + Hash proof)
    Note over Gateway: Ingress inspection: Verify TLS 1.3 + JWT<br/>Heuristic check: Zero raw PII allowed across boundary
    Gateway->>Orchestrator: 8. Forward sanitized task context
    Orchestrator->>VLM: 9. Prompt Qwen2.5-VL with sanitized image & token IDs
    Note over VLM: Model inspects layout & synthetic tokens<br/>Plans next step: Click input box ⟨AADHAAR_01⟩
    VLM-->>Orchestrator: 10. Emits structured action plan JSON
    Orchestrator-->>Content: 11. Stream Action Plan frame via WebSocket
    Note over Content: Intercept action targeting ⟨AADHAAR_01⟩
    Content->>Vault: 12. Query real decrypted value for token ⟨AADHAAR_01⟩
    Vault-->>Content: 13. Return real Aadhaar string (in local RAM only)
    Content->>Tab: 14. dispatchEvent(new InputEvent('input', {data: realValue}))
    Tab-->>User: 15. Real-time visual confirmation in portal`;

export const MASTER_PLAN_MERMAID = `flowchart TD
    classDef client fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#1E40AF;
    classDef shield fill:#FFF7ED,stroke:#EA580C,stroke-width:2px,color:#9A3412;
    classDef vault fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px,color:#5B21B6;
    classDef gateway fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef cloud fill:#ECFDF5,stroke:#059669,stroke-width:2px,color:#065F46;

    subgraph MV3 ["🔒 CLIENT BROWSER EXTENSION (Chrome MV3 On-Device Sandbox)"]
        direction TB
        User(["👤 User / Security Operator"]):::client
        SidePanel["🖥️ Side Panel UI (Audit HUD · Approval Gate)"]:::client
        TargetTab["🌐 Active Web Tab (ISRO e-Procurement / Portal)"]:::client
        ContentScript["📜 Content Script (DOM Tree Walker & Synthesizer)"]:::client
        
        subgraph PRIVACY_SHIELD ["⚡ WebGPU Privacy Shield (Offscreen Document)"]
            FrameDiff["⚡ 8x8 Tile Diff (Skips 85% Static Frames)"]:::shield
            Detector["🎯 Multi-Model Detector (DBNet + Face + CRNN)"]:::shield
            Redactor["🛡️ Inpainting Redactor (4px Safety Dilation)"]:::shield
        end

        subgraph LOCAL_VAULT ["🔐 In-Memory Vault Service (Ephemeral)"]
            TokenGen["🎲 Deterministic Session Tokenizer"]:::vault
            AESVault["🗄️ AES-256-GCM RAM Vault"]:::vault
            Rehydration["🔄 Rehydration Engine (Token -> Real Value)"]:::vault
        end
    end

    subgraph WIRE_INGRESS ["🛡️ ISRO INTRANET SECURE INGRESS"]
        direction TB
        APIGateway["🚪 mTLS API Gateway (Strict Zero-Raw-PII Inspector)"]:::gateway
        AuditQueue["📋 Cryptographic Action Ledger (WORM Log)"]:::gateway
    end

    subgraph CLOUD_CORE ["☁️ AIR-GAPPED REASONING CLUSTER"]
        direction TB
        Orchestrator["🧠 LangGraph Dual-Track Agent Orchestrator"]:::cloud
        VLM["🤖 Sovereign Qwen2.5-VL Reasoning Engine"]:::cloud
        SafetyVerifier["⚖️ Policy & Deterministic Constraint Checker"]:::cloud
    end

    User -->|"1. Submit Task Intent"| SidePanel
    SidePanel -->|"2. Initiate Perception Loop"| ContentScript
    ContentScript -->|"3. DOM Extraction + Capture Viewport"| TargetTab
    TargetTab -->|"4. Raw Pixels + DOM Node Hierarchy"| FrameDiff
    FrameDiff -->|"5. Dirty Tiles Only"| Detector
    Detector -->|"6. Detected PII Bounds & Text"| TokenGen
    TokenGen -->|"7. Cache Real PII (RAM Only)"| AESVault
    TokenGen -->|"8. Token Replacement Map"| Redactor
    Redactor -->|"9. Sanitized Image + Anonymized JSON Tree"| APIGateway

    APIGateway -->|"10. Forward Anonymized Prompt & Image"| Orchestrator
    Orchestrator -->|"11. Visual Reasoner Prompt"| VLM
    VLM -->|"12. Structured Action Plan with Tokens"| SafetyVerifier
    SafetyVerifier -->|"13. Validated Action Stream"| APIGateway
    APIGateway -->|"14. Real-Time Action Stream"| SidePanel

    SidePanel -->|"15. Request User Approval if High Risk"| User
    SidePanel -->|"16. Authorized Action Frame"| Rehydration
    Rehydration -->|"17. Decrypt Real Value Locally"| AESVault
    Rehydration -->|"18. Dispatch Native Event to DOM"| ContentScript
    ContentScript -->|"19. Synthesize Click / Input"| TargetTab
    ContentScript -.->|"20. Closed-Loop Next Frame Verification"| FrameDiff`;
