// src/components/CanvasView.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";

/**
 * Enhanced CanvasView
 * - shows image/video/text/music overlays
 * - highlights overlays that match the current segment
 * - can toggle overlay visible (stores overlay.visible)
 * - shows small badges for segment_targets / scene_types
 *
 * Note: currently selects "current segment" as the first segment (segments[0]).
 * Later the TimelineEditor can set a previewSegment index in the store to control this.
 */

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
      let width = containerW;
      let height = Math.round(containerW / metaRatio);
      if (height > containerH) {
        height = containerH;
        width = Math.round(containerH * metaRatio);
      }
      setSize({ width, height });
    }
    computeSize();
    window.addEventListener("resize", computeSize);
    return () => window.removeEventListener("resize", computeSize);
  }, [metaRes.w, metaRes.h]);

  function overlayPositionPx(o, overlayPixelSize) {
    const xPercent = Number(o.x_offset_percent || 0);
    const yPercent = Number(o.y_offset_percent || 0);

    const cx = size.width / 2;
    const cy = size.height / 2;

    const x = cx + (xPercent / 100) * (size.width / 2);
    const y = cy - (yPercent / 100) * (size.height / 2);

    const left = Math.round(x - overlayPixelSize.w / 2);
    const top = Math.round(y - overlayPixelSize.h / 2);

    const clampedLeft = Math.max(Math.min(left, size.width - 4), -4);
    const clampedTop = Math.max(Math.min(top, size.height - 4), -4);

    return { left: clampedLeft, top: clampedTop, centerX: Math.round(x), centerY: Math.round(y) };
  }

  // sort overlays by layer (lowest first)
  const overlaysSorted = [...overlays].sort((a, b) => (a.layer || 0) - (b.layer || 0));

  return (
    <div className="w-full" style={{ minHeight: 360 }}>
      <div className="mb-2 text-sm text-slate-300">
        Resolution: <strong>{meta.resolution}</strong> &nbsp; FPS: <strong>{meta.fps}</strong>
        {currentSegment && (
          <span className="ml-4 text-slate-400">• Preview Segment: <strong>#{currentSegment.segment_number} {currentSegment.scene_type}</strong></span>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative bg-black rounded border border-slate-700 mx-auto"
        style={{
          width: "100%",
          minHeight: 360,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 12,
        }}
      >
        <div
          className="relative"
          style={{
            width: size.width,
            height: size.height,
            background: "#0f0f10",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.02)",
          }}
        >
          {overlaysSorted.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No overlays yet — Add one with the toolbar above.
            </div>
          )}

          {overlaysSorted.map((o) => {
            const targetPx = parseScaleToPixels(o.scale || meta.default_scale, metaRes, size.width, size.height);
            const pos = overlayPositionPx(o, targetPx);
            const isSelected = selectedOverlayId === o.id;
            const applies = currentSegment ? matchOverlayToSegment(o, currentSegment) : true;
            const visible = o.visible === undefined ? true : !!o.visible;
            const borderColor = isSelected ? "rgba(56,189,248,0.95)" : "rgba(255,255,255,0.06)";
            const baseOpacity = (o.opacity == null ? 100 : Number(o.opacity)) / 100;
            // if overlay doesn't match segment, dim it and add badge
            const displayOpacity = visible ? (applies ? baseOpacity : Math.max(0.18, baseOpacity * 0.35)) : 0.06;

            return (
              <div
                key={o.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOverlay(o.id);
                }}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  width: targetPx.w,
                  height: targetPx.h,
                  border: `2px solid ${borderColor}`,
                  boxSizing: "border-box",
                  background: "#0b0b0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  opacity: displayOpacity,
                }}
              >
                {/* Top-right overlay controls */}
                <div style={{ position: "absolute", top: 6, right: 6, zIndex: 60, display: "flex", gap: 6 }}>
                  {/* visibility toggle */}
                  <button
                    title={visible ? "Hide overlay" : "Show overlay"}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOverlay(o.id, { visible: !visible });
                    }}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {visible ? "👁" : "🙈"}
                  </button>
                </div>

                {/* badges (bottom-left) */}
                <div style={{ position: "absolute", left: 6, bottom: 6, zIndex: 60, display: "flex", gap: 6, alignItems: "center" }}>
                  {/* type badge */}
                  <div style={{ fontSize: 11, padding: "4px 6px", background: "rgba(0,0,0,0.5)", borderRadius: 6 }}>
                    {o.type}
                  </div>

                  {/* segment_targets badge */}
                  {Array.isArray(o.segment_targets) && o.segment_targets.length > 0 && (
                    <div style={{ fontSize: 11, padding: "4px 6px", background: "rgba(15,23,42,0.6)", borderRadius: 6 }}>
                      segs: {o.segment_targets.join(",")}
                    </div>
                  )}

                  {/* scene_types badge */}
                  {Array.isArray(o.scene_types) && o.scene_types.length > 0 && (
                    <div style={{ fontSize: 11, padding: "4px 6px", background: "rgba(15,23,42,0.6)", borderRadius: 6 }}>
                      scenes: {o.scene_types.join(",")}
                    </div>
                  )}
                </div>

                {/* render content depending on type */}
                {o.type === "image" && o.url ? (
                  <img src={o.url} alt={o.id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : o.type === "video" && o.url ? (
                  <video src={o.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
                ) : o.type === "text" ? (
                  <div style={{
                    color: o.fontcolor || "white",
                    fontSize: (o.fontsize || 24),
                    padding: 6,
                    textAlign: "center",
                    lineHeight: 1.1
                  }}>
                    {o.text || "Text"}
                  </div>
                ) : o.type === "music" ? (
                  <div style={{ color: "white", padding: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 24 }}>🎵</div>
                    <div style={{ fontSize: 12 }}>
                      {o.id || "music"}{o.volume != null ? ` • vol ${o.volume}` : ""}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "white", fontSize: 12 }}>{o.type}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
