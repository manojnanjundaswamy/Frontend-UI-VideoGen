// src/components/CanvasView.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";

/**
 * CanvasView
 * - Respects meta.resolution (e.g. 1920:1080)
 * - Fits into the container while preserving aspect ratio
 * - Renders overlays array (images/videos/text as boxes)
 * - Clicking an overlay selects it (calls store.selectOverlay)
 *
 * Offsets interpretation:
 * - x_offset_percent: 0 => center, positive => right, value is percent of half-width (FFmpeg-like)
 * - y_offset_percent: 0 => center, positive => UP (FFmpeg-style), value is percent of half-height
 *
 * Scale string:
 * - "W:H" where W or H may be -1; we convert W,H (pixels) relative to meta resolution then to canvas px.
 * - If H = -1, approximate using meta aspect ratio.
 */

function parseResolution(res) {
  const [w, h] = (res || "1920:1080").split(":").map((v) => parseInt(v, 10) || 0);
  return { w, h };
}

function parseScaleToPixels(scaleStr, meta, canvasW, canvasH) {
  // scaleStr like "500:-1" or "1920:1080"
  if (!scaleStr) return { w: Math.round(canvasW * 0.2), h: Math.round(canvasH * 0.2) };

  const parts = ("" + scaleStr).split(":");
  const sw = parseInt(parts[0], 10);
  const sh = parseInt(parts[1], 10);

  // meta resolution
  const metaW = meta?.w || 1920;
  const metaH = meta?.h || 1080;

  // compute pixel size relative to canvas
  if (!isNaN(sw) && !isNaN(sh)) {
    if (sw > 0 && sh > 0) {
      const wpx = Math.round((sw / metaW) * canvasW);
      const hpx = Math.round((sh / metaH) * canvasH);
      return { w: wpx, h: hpx };
    }
    if (sw > 0 && sh === -1) {
      // preserve meta aspect ratio
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

  // fallback - use percentage of canvas
  return { w: Math.round(canvasW * 0.2), h: Math.round(canvasH * 0.2) };
}

export default function CanvasView() {
  // select needed slices
  const overlays = useEditorStore((s) => s.overlays || []);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);
  const selectOverlay = useEditorStore.getState().selectOverlay;
  const meta = useEditorStore((s) => s.meta || { resolution: "1920:1080", fps: 30 });

  // parse meta resolution
  const metaRes = parseResolution(meta.resolution);

  // refs and internal size
  const containerRef = React.useRef(null);
  const [size, setSize] = React.useState({ width: 1000, height: 500 });

  // recompute canvas fit on resize
  React.useEffect(() => {
    function computeSize() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // compute max size that preserves aspect ratio metaRes.w:metaRes.h
      const containerW = rect.width;
      const containerH = rect.height;
      const metaRatio = metaRes.w / metaRes.h;
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

  // helper: convert overlay center-percent coords -> canvas pixels
  function overlayPositionPx(o, overlayPixelSize) {
    // percent values: x_offset_percent, y_offset_percent
    // interpretation: percent relative to half-range. 100% -> full half width.
    const xPercent = Number(o.x_offset_percent || 0);
    const yPercent = Number(o.y_offset_percent || 0);

    const cx = size.width / 2;
    const cy = size.height / 2;

    const x = cx + (xPercent / 100) * (size.width / 2);
    const y = cy - (yPercent / 100) * (size.height / 2); // FFmpeg positive up -> subtract

    // overlayPixelSize gives width/height, we want top-left for absolute positioning
    const left = Math.round(x - overlayPixelSize.w / 2);
    const top = Math.round(y - overlayPixelSize.h / 2);

    // clamp so overlay remains visible inside canvas
    const clampedLeft = Math.max(Math.min(left, size.width - 4), -4);
    const clampedTop = Math.max(Math.min(top, size.height - 4), -4);

    return { left: clampedLeft, top: clampedTop, centerX: Math.round(x), centerY: Math.round(y) };
  }

  // sort overlays by layer
  const overlaysSorted = [...overlays].sort((a, b) => (a.layer || 0) - (b.layer || 0));

  return (
    <div className="w-full" style={{ minHeight: 360 }}>
      <div className="mb-2 text-sm text-slate-300">
        Resolution: <strong>{meta.resolution}</strong> &nbsp; FPS: <strong>{meta.fps}</strong>
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
        {/* center area sized to fit meta resolution */}
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
            // compute size in px for this canvas
            const targetPx = parseScaleToPixels(o.scale || meta.default_scale, metaRes, size.width, size.height);
            const pos = overlayPositionPx(o, targetPx);
            const isSelected = selectedOverlayId === o.id;

            // style common
            const borderColor = isSelected ? "rgba(56,189,248,0.9)" : "rgba(255,255,255,0.06)";
            const opacity = (o.opacity == null ? 100 : Number(o.opacity)) / 100;

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
                  opacity: opacity,
                }}
              >
                {/* render type */}
                {o.type === "image" && o.url ? (
                  // img scaled to fit overlay box
                  <img src={o.url} alt={o.id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : o.type === "video" && o.url ? (
                  <video src={o.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
                ) : o.type === "text" ? (
                  <div style={{ color: o.fontcolor || "white", fontSize: o.fontsize || 24 }}>{o.text || "Text"}</div>
                ) : o.type === "music" ? (
                  <div style={{ color: "white", padding: 8 }}>🎵 Music: {o.url ? "attached" : "no url"}</div>
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
