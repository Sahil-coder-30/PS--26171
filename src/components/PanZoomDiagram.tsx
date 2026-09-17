import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PanZoomDiagramProps {
  title: string;
  subtitle?: string;
  svgContent?: string;
  children?: React.ReactNode;
}

export const PanZoomDiagram: React.FC<PanZoomDiagramProps> = ({
  title,
  subtitle,
  children
}) => {
  const [scale, setScale] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDist = useRef<number>(0);
  const initialScale = useRef<number>(1.0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newScale = Math.max(0.3, Math.min(3.5, scale * zoomFactor));

    setPan({
      x: mouseX - (mouseX - pan.x) * (newScale / scale),
      y: mouseY - (mouseY - pan.y) * (newScale / scale)
    });
    setScale(newScale);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startPos.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      initialPinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - startPos.current.x,
        y: e.touches[0].clientY - startPos.current.y
      });
    } else if (e.touches.length === 2 && initialPinchDist.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDist.current;
      const newScale = Math.max(0.3, Math.min(3.5, initialScale.current * ratio));
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialPinchDist.current = 0;
  };

  const zoomIn = () => setScale((s) => Math.min(3.5, s * 1.25));
  const zoomOut = () => setScale((s) => Math.max(0.3, s / 1.25));
  const resetZoom = () => {
    setScale(1.0);
    setPan({ x: 20, y: 20 });
  };

  return (
    <div style={{
      border: '1px solid var(--border-warm)',
      borderRadius: '16px',
      background: '#FFFFFF',
      margin: '24px 0 28px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-warm)',
        fontSize: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>
            {title}
          </strong>
          {subtitle && <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>{subtitle}</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={zoomIn}
            title="Zoom In"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-warm)',
              borderRadius: '6px',
              padding: '4px 9px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            +
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-warm)',
              borderRadius: '6px',
              padding: '4px 9px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            &minus;
          </button>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'var(--text-muted)',
            minWidth: '42px',
            textAlign: 'center'
          }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={resetZoom}
            title="Reset Pan & Zoom"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-warm)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          height: '480px',
          width: '100%',
          position: 'relative',
          background: 'radial-gradient(#EFEAE1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: '#FAF8F5',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            padding: '24px'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
