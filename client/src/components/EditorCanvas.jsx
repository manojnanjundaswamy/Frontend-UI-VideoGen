import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import OverlayToolbar from "./OverlayToolbar";
import MiniOverlayPreview from "./MiniOverlayPreview";


function parseResolution(res) {
  if (!res) return { w: 1920, h: 1080 };
  const [w, h] = String(res).split(':').map(x => parseInt(x, 10));
  return { w: w || 1920, h: h || 1080 };
}

// convert scale strings used by ffmpeg into a numeric factor for canvas display
function scaleToFactor(scaleStr, metaRes, intrinsic = { w: 1920, h: 1080 }) {
  // if scale is like "1920:1080" => factor = 1920 / metaRes.w
  // if scale is "500:-1" => factor = 500 / intrinsic.w
  // if scale contains "iw" or "ih" or expressions: fallback to scale_factor property or 1
  if (!scaleStr) return 1;
  if (scaleStr.includes('iw') || scaleStr.includes('ih') || scaleStr.includes('*') || scaleStr.includes('/')) {
    return null; // fallback, caller can handle
  }
  const parts = scaleStr.split(':');
  const sw = parseInt(parts[0], 10);
  const sh = parseInt(parts[1], 10);
  if (!isNaN(sw) && !isNaN(sh) && sw > 0) {
    return sw / metaRes.w;
  }
  if (!isNaN(sw) && sw > 0 && sh === -1) {
    return sw / intrinsic.w;
  }
  return 1;
}

export default function EditorCanvas() {
  const {
    overlays,
    meta,
    selectedOverlayId,
    setSelectedOverlayId,
    setOverlays
  } = useEditorStore();

  const containerRef = React.useRef(null);
  const res = parseResolution(meta?.resolution || '1920:1080');
  const canvasW = 1000; // visual width in px
  const canvasH = Math.round((res.h / res.w) * canvasW);
  const selected = useEditorStore((s) => s.overlays[s.selectedOverlayId]);

  const overlayEntries = Object.entries(overlays || {}).sort((a, b) => ((a[1].layer || 0) - (b[1].layer || 0)));

  // compute onClick selection
  function onClickOverlay(key) {
    setSelectedOverlayId(key);
  }

  const renderOverlays = overlayEntries.map(([key, o]) => {
    // compute factor
    // prefer explicit scale_factor property, otherwise try to parse o.scale (ffmpeg-style)
    const scaleFactor = o.scale_factor ?? null;
    const parsedFactor = scaleFactor || scaleToFactor(o.scale, res, { w: 1920, h: 1080 }) || 1;
    const displayW = Math.round((parsedFactor) * canvasW);
    const displayH = Math.round((parsedFactor) * canvasH);

    // compute center offset
    const xPercent = (o.x_offset_percent || 0);
    const yPercent = (o.y_offset_percent || 0);
    // x,y relative to center
    const cx = (canvasW / 2) + (canvasW * (xPercent / 100)) - (displayW / 2);
    const cy = (canvasH / 2) - (canvasH * (yPercent / 100)) - (displayH / 2);

    const style = {
      position: 'absolute',
      left: Math.round(cx) + 'px',
      top: Math.round(cy) + 'px',
      width: displayW + 'px',
      height: displayH + 'px',
      border: selectedOverlayId === key ? '2px solid #2ac0ff' : '1px solid rgba(255,255,255,0.06)',
      boxSizing: 'border-box',
      pointerEvents: 'auto',
      cursor: 'pointer',
      opacity: (o.opacity != null ? (o.opacity / 100) : 1)
    };

    if ((o.type || '').startsWith('video')) {
      return (
        <video key={key} style={style} src={o.url} muted loop playsInline onClick={() => onClickOverlay(key)} />
      );
    }
    // default image
    return (
      <img
        key={key}
        alt={o.key || 'overlay'}
        src={o.url}
        style={style}
        onClick={() => onClickOverlay(key)}
      />
    );
  });

  return (
    <div className="p-3">
      <div className="absolute top-2 right-2 w-32 h-32 bg-slate-700/70 rounded border border-slate-500">
        {selected && <MiniOverlayPreview overlay={selected} />}
      </div>
      <OverlayToolbar />
      <div style={{ width: canvasW + 16, height: canvasH + 16, borderRadius: 8, overflow: 'hidden', background: '#000', position: 'relative', padding: 8 }}>
        <div style={{ width: canvasW, height: canvasH, position: 'relative', margin: '0 auto', background: '#111' }} ref={containerRef}>
          {renderOverlays}
          {/* center guide */}
          <div style={{ position: 'absolute', left: canvasW/2 - 1, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.02)' }} />
          <div style={{ position: 'absolute', top: canvasH/2 - 1, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.02)' }} />
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-300">Resolution: {meta?.resolution || '1920:1080'} &nbsp; FPS: {meta?.fps || 30}</div>
    </div>
  );
}
