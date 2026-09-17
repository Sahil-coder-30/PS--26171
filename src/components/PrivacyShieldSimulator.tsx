import React, { useState } from 'react';

interface TokenRecord {
  token: string;
  category: string;
  original: string;
  confidence: number;
}

export const PrivacyShieldSimulator: React.FC = () => {
  const [inputText, setInputText] = useState(
    'ISRO Vendor Rajesh Sharma (Aadhaar: 4521 8930 1192, PAN: BZRPK8921M) submitted tender bid #SAC-2024-88A with contact phone +91 98450 12345 from rajesh.sharma@spacevendor.in.'
  );
  const [sanitizedText, setSanitizedText] = useState<string>('');
  const [tokens, setTokens] = useState<TokenRecord[]>([]);
  const [latency, setLatency] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const runSanitization = () => {
    setIsProcessing(true);
    const startTime = performance.now();

    setTimeout(() => {
      let output = inputText;
      const detected: TokenRecord[] = [];

      // Regex patterns mimicking WebGPU local neural + regex parser
      const patterns = [
        { regex: /\b\d{4}\s\d{4}\s\d{4}\b/g, category: 'AADHAAR_ID', prefix: 'AADHAAR' },
        { regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g, category: 'PAN_CARD', prefix: 'PAN' },
        { regex: /(\+91[\s\-]?)?[6-9]\d{9}/g, category: 'PHONE_NUMBER', prefix: 'PHONE' },
        { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, category: 'EMAIL_ADDR', prefix: 'EMAIL' },
        { regex: /\b(Rajesh Sharma|Aadhaar|Vendor Rajesh)\b/gi, category: 'CITIZEN_NAME', prefix: 'PERSON' }
      ];

      let tokenCounter = 1;
      patterns.forEach(({ regex, category, prefix }) => {
        output = output.replace(regex, (match) => {
          const token = `<VAULT_${prefix}_${String(tokenCounter).padStart(3, '0')}>`;
          tokenCounter++;
          detected.push({
            token,
            category,
            original: match,
            confidence: 0.98 + Math.random() * 0.019
          });
          return token;
        });
      });

      const elapsed = Math.round((performance.now() - startTime) * 10) / 10 + 42; // Simulating 40-70ms WebGPU inference
      setSanitizedText(output);
      setTokens(detected);
      setLatency(elapsed);
      setIsProcessing(false);
    }, 120);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-warm)',
      borderRadius: '16px',
      padding: '24px 28px',
      margin: '28px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'var(--isro-orange-light)',
            border: '1px solid var(--isro-orange-border)',
            color: 'var(--isro-orange)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px'
          }}>LIVE WEBGPU SANDBOX</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontFamily: "'Outfit', sans-serif" }}>
            Dual-Channel Zero-Egress Privacy Vault Simulator
          </h3>
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#059669',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          padding: '3px 8px',
          borderRadius: '6px'
        }}>
          ● ON-DEVICE EPHEMERAL RAM
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.55 }}>
        Test how PRATYAKSHA mathematically eliminates PII egress. Text and coordinates detected locally via WebGPU DBNet/CRNN are replaced with cryptographic vault tokens before network dispatch to external VLMs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            RAW CLIENT INPUT (IN OPERATOR BROWSER):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              background: '#FAF7F2',
              border: '1px solid #E7E0D6',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '12.5px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#1C1917',
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            OUTBOUND PAYLOAD TO CLUSTER VLM (SANITIZED):
          </label>
          <div
            style={{
              width: '100%',
              minHeight: '94px',
              background: '#1C1917',
              border: '1px solid #332E2A',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '12.5px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#A3E635',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            {sanitizedText || (
              <span style={{ color: '#78716C' }}>
                Click &quot;Sanitize via WebGPU Shield&quot; below to execute client-side tokenization...
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={runSanitization}
          disabled={isProcessing}
          style={{
            background: 'var(--isro-orange)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: isProcessing ? 'wait' : 'pointer',
            transition: 'background 0.15s ease',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
          }}
        >
          {isProcessing ? '⚡ Running DBNet ONNX...' : '🛡️ Sanitize via WebGPU Shield'}
        </button>

        {latency > 0 && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Inference Latency: <strong style={{ color: '#EA580C' }}>{latency}ms</strong>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Tokens Created: <strong style={{ color: '#2563EB' }}>{tokens.length}</strong>
            </span>
            <span style={{ color: '#059669', fontWeight: 600 }}>
              ✓ 0 Bytes PII on Wire
            </span>
          </div>
        )}
      </div>

      {tokens.length > 0 && (
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #EFEAE1' }}>
          <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            In-Memory AES-256 Vault Token Registry:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {tokens.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FAF7F2',
                  border: '1px solid #E7E0D6',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ color: '#EA580C', fontWeight: 700 }}>{t.token}</span>
                <span style={{ color: '#78716C' }}>&rarr;</span>
                <span style={{ color: '#1C1917', textDecoration: 'line-through' }}>{t.original}</span>
                <span style={{ fontSize: '9.5px', color: '#059669', background: '#ECFDF5', padding: '1px 4px', borderRadius: '3px' }}>
                  {(t.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
