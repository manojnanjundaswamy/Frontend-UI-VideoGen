// src/components/CanvasView.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";
import { Eye, EyeOff, Image as ImageIcon, Video, Type, Music } from 'lucide-react';

function parseResolution(res) {
  const [w, h] = (res || "1920:1080").split(":").map((v) => parseInt(v, 10) || 0);
  return { w, h };
}

function parseScaleToPixels(scaleStr, meta, canvasW, canvasH) {
  if (!scaleStr) return { w: Math.round(canvasW * 0.2), h: Math.round(canvasH * 0.2) };

  const parts = ("" + scaleStr).split(":");
  const sw = parseInt(parts[0], 10);
  const sh = parseInt(parts[1], 10);

  const metaW = meta?.w || 1920;
  const metaH = meta?.h || 1080;

  if (!isNaN(sw) && !isNaN(sh)) {
    if (sw > 0 && sh > 0) {
      const wpx = Math.round((sw / metaW) * canvasW);
      const hpx = Math.round((sh / metaH) * canvasH);
      return { w: wpx, h: hpx };
    }
    if (sw > 0 && sh === -1) {
      const wpx = Math.round((sw / metaW) * canvasW);
      const hpx = Math.round((wpx * metaH) / metaW);
      return { w: wpx, h: hpx };
    }
    if (sw === -1 && sh > 0) {
      const hpx = Math.round((sh / metaH) * canvasH);
      const wpx = Math.round((hpx * metaW) / metaH);
      return { w: wpx, h: hpx };
    }
  }

  return { w: Math.round(canvasW * 0.2), h: Math.round(canvasH * 0.2) };
}

// match() logic ported from n8n Normalize / Create nodes
function matchOverlayToSegment(o = {}, seg = {}) {
  if (!o) return false;
  const hasNoFilter =
    (!o.segment_targets || (Array.isArray(o.segment_targets) && o.segment_targets.length === 0)) &&
    (!o.scene_types || (Array.isArray(o.scene_types) && o.scene_types.length === 0)) &&
    (!o.chapter_numbers || (Array.isArray(o.chapter_numbers) && o.chapter_numbers.length === 0));
  if (hasNoFilter) return true;
  if (Array.isArray(o.segment_targets) && o.segment_targets.includes(seg.segment_number)) return true;
  if (Array.isArray(o.scene_types) && o.scene_types.includes(seg.scene_type)) return true;
  if (Array.isArray(o.chapter_numbers) && o.chapter_numbers.includes(seg.chapter_number)) return true;
  return false;
}

export default function CanvasView() {
  const overlays = useEditorStore((s) => s.overlays || []);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);
  const selectOverlay = useEditorStore.getState().selectOverlay;
  const updateOverlay = useEditorStore.getState().updateOverlay;
  const meta = useEditorStore((s) => s.meta || { resolution: "1920:1080", fps: 30 });
  const segments = useEditorStore((s) => s.segments || []);

  // current segment = first segment by default
  const currentSegment = (segments && segments.length > 0) ? segments[0] : null;

  const metaRes = parseResolution(meta.resolution);

  const containerRef = React.useRef(null);
  const [size, setSize] = React.useState({ width: 1000, height: 500 });

  React.useEffect(() => {
    function computeSize() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const containerW = rect.width;
      const containerH = rect.height;
      const metaRatio = (metaRes.w && metaRes.h) ? metaRes.w / metaRes.h : 16 / 9;

      // Add padding calculation
      const PADDING = 40;
      const availableW = containerW - PADDING;
      const availableH = containerH - PADDING;

      // Fit logic
      let width = availableW;
      let height = Math.round(availableW / metaRatio);

      if (height > availableH) {
        height = availableH;
        width = Math.round(availableH * metaRatio);
      }

      setSize({ width, height });
    }
    computeSize();
    window.addEventListener("resize", computeSize);
    return () => window.removeEventListener("resize", computeSize);
  }, [metaRes.w, metaRes.h]);

  function overlayPositionPx(o, overlayPx) {
    const x = Number(o.x_offset_percent || 0);
    const y = Number(o.y_offset_percent || 0);

    // EXACT FFmpeg behavior
    const cx = (size.width - overlayPx.w) / 2 + (size.width * (x / 100));
    const cy = (size.height - overlayPx.h) / 2 - (size.height * (y / 100));

    return {
      left: Math.round(cx),
      top: Math.round(cy)
    };
  }

  // sort overlays by layer (lowest first)
  const overlaysSorted = [...overlays].sort((a, b) => (a.layer || 0) - (b.layer || 0));

  return (
    <div className="w-full h-full flex flex-col bg-[#050505]">

      {/* Header Info */}
      <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-slate-900/50">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {meta.resolution} @ {meta.fps}fps
          </span>
          {currentSegment && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
              Seg #{currentSegment.segment_number} • {currentSegment.scene_type}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">
          Auto-Scale: Fit
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center canvas-grid"
      >
        <div
          className="relative shadow-2xl shadow-black ring-1 ring-white/10 transition-all duration-300"
          style={{
            width: size.width,
            height: size.height,
            background: "#0f0f10",
            borderRadius: 2, // sharp cinema look
          }}
        >
          {overlaysSorted.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">No overlays active</p>
            </div>
          )}

          {overlaysSorted.map((o) => {
            const targetPx = parseScaleToPixels(o.scale || meta.default_scale, metaRes, size.width, size.height);
            const pos = overlayPositionPx(o, targetPx);
            const isSelected = selectedOverlayId === o.id;
            const applies = currentSegment ? matchOverlayToSegment(o, currentSegment) : true;
            const visible = o.visible === undefined ? true : !!o.visible;
            const baseOpacity = (o.opacity == null ? 100 : Number(o.opacity)) / 100;
            const displayOpacity = visible ? (applies ? baseOpacity : Math.max(0.1, baseOpacity * 0.2)) : 0.02;

            return (
              <div
                key={o.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOverlay(o.id);
                }}
                className={`group absolute transition-all duration-150 ${isSelected ? 'z-50' : 'z-10'}`}
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: targetPx.w,
                  height: targetPx.h,
                  opacity: displayOpacity,
                }}
              >
                {/* Content Container */}
                <div
                  className={`w-full h-full overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-sm
                    ${isSelected ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10' : 'ring-1 ring-white/10 hover:ring-white/30'}
                  `}
                >
                  {o.type === "image" && o.url ? (
                    <img src={o.url} alt={o.id} className="w-full h-full object-cover" />
                  ) : o.type === "video" && o.url ? (
                    <video src={o.url} className="w-full h-full object-cover" muted loop />
                  ) : o.type === "text" ? (
                    <div style={{
                      color: o.fontcolor || "white",
                      fontSize: (o.fontsize || 24),
                      padding: 8,
                      textAlign: "center",
                      lineHeight: 1.2,
                      fontFamily: 'sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {o.text || "Text Overlay"}
                    </div>
                  ) : o.type === "music" ? (
                    <div className="flex flex-col items-center gap-2 text-white/50">
                      <Music className="w-8 h-8" />
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 uppercase tracking-wider">{o.type}</span>
                  )}
                </div>

                {/* Hover Controls */}
                <div className={`absolute -top-8 right-0 flex bg-slate-900/90 rounded-t-md px-1 py-0.5 border-x border-t border-white/10 
                   ${isSelected || 'group-hover:opacity-100 opacity-0'} transition-opacity
                `}>
                  <button
                    className="p-1 hover:text-white text-slate-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOverlay(o.id, { visible: !visible });
                    }}
                  >
                    {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>

                {/* Selection Label */}
                {isSelected && (
                  <div className="absolute -bottom-6 left-0 bg-indigo-600 px-2 py-0.5 rounded text-[10px] text-white font-medium shadow-sm">
                    {o.id}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
