// EditorCanvas.jsx
import React, { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";

// helper: parse "1920:1080" or "iw*0.25:ih*0.25" and compute pixel width/height
function cssScaleFromFFmpeg(scaleStr, naturalW, naturalH) {
  // fallback
  if (!scaleStr) return { w: naturalW, h: naturalH };

  // exact W:H (numbers)
  if (scaleStr.includes(":") && !scaleStr.includes("iw") && !scaleStr.includes("ih")) {
    const [ws, hs] = scaleStr.split(":").map((s) => Number(s));
    // if -1 appears, preserve aspect
    if (ws === -1 && hs > 0) {
      const newH = hs;
      const aspect = naturalW / naturalH;
      const newW = Math.round(newH * aspect);
      return { w: newW, h: newH };
    }
    if (hs === -1 && ws > 0) {
      const newW = ws;
      const aspect = naturalW / naturalH;
      const newH = Math.round(newW / aspect);
      return { w: newW, h: newH };
    }
    if (Number.isFinite(ws) && Number.isFinite(hs)) return { w: ws, h: hs };
  }

  // iw*X:ih*X
  if (scaleStr.includes("iw*") && scaleStr.includes("ih*")) {
    const x = parseFloat(scaleStr.split(":")[0].replace("iw*", "")) || 1;
    const y = parseFloat(scaleStr.split(":")[1].replace("ih*", "")) || x || 1;
    return { w: Math.round(naturalW * x), h: Math.round(naturalH * y) };
  }

  // if nothing matched, return natural
  return { w: naturalW, h: naturalH };
}

// utility: convert "host.docker.internal" to "localhost" for preview playback
function toPreviewUrl(url) {
  if (!url) return url;
  return url.replace("host.docker.internal", "localhost");
}

export default function EditorCanvas() {
  const overlays = useEditorStore((s) => s.overlays);
  const texts = useEditorStore((s) => s.texts);
  const meta = useEditorStore((s) => s.meta);
  const selectedKey = useEditorStore((s) => s.selectedKey);
  const selectOverlay = useEditorStore((s) => s.selectOverlay);

  const containerRef = useRef(null);
  const [assetsMeta, setAssetsMeta] = useState({}); // { key: { naturalW, naturalH } }

  // load natural sizes for image/video
  useEffect(() => {
    Object.entries(overlays).forEach(([k, o]) => {
      if (!o.url) return;
      if (assetsMeta[k]) return;
      const img = new Image();
      img.onload = () => setAssetsMeta((s) => ({ ...s, [k]: { naturalW: img.naturalWidth, naturalH: img.naturalHeight } }));
      img.onerror = () => setAssetsMeta((s) => ({ ...s, [k]: { naturalW: 600, naturalH: 400 } }));
      img.src = toPreviewUrl(o.url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlays]);

  // render overlays sorted by layer ascending (0 base)
  const entries = Object.entries({ ...overlays, ...texts }).sort((a, b) => (a[1].layer || 0) - (b[1].layer || 0));

  // resolution mapping
  const [resW, resH] = (meta?.resolution || "1920:1080").split(":").map((v) => Number(v));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        ref={containerRef}
        style={{
          width: 900, // preview canvas fixed width in UI
          height: Math.round((900 * resH) / resW),
          background: "#111",
          position: "relative",
          overflow: "hidden",
          borderRadius: 8
        }}
      >
        {/* center origin */}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: resW, height: resH, transform: "translate(-50%, -50%)" }}>
          {entries.map(([k, o]) => {
            const asset = assetsMeta[k] || { naturalW: 600, naturalH: 400 };
            const { w, h } = cssScaleFromFFmpeg(o.scale, asset.naturalW, asset.naturalH);
            // compute CSS transform based on center anchor and x_offset_percent/y_offset_percent
            const xp = (o.x_offset_percent || 0) / 100;
            const yp = (o.y_offset_percent || 0) / 100;
            // convert to pixel offset relative to canvas resolution
            const left = (resW - w) / 2 + resW * xp;
            const top = (resH - h) / 2 - resH * yp; // note: subtract for positive=y-up
            const z = (o.layer || 0) + 1000; // ensure overlays on top of canvas

            const commonStyle = {
              position: "absolute",
              left,
              top,
              width: w,
              height: h,
              transformOrigin: "top left",
              opacity: (o.opacity != null ? (o.opacity / 100) : 1),
              cursor: "pointer",
              zIndex: z
            };

            return o.type === "text" ? (
              <div
                key={k}
                onClick={() => selectOverlay(k)}
                style={{
                  ...commonStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: o.fontcolor || "white",
                  fontSize: (o.fontsize || 48),
                  fontFamily: "inherit",
                  textShadow: o.box ? "0 0 6px rgba(0,0,0,0.5)" : undefined,
                  background: o.box ? (o.boxcolor || "rgba(0,0,0,0.4)") : "transparent",
                  padding: o.box ? 6 : 0,
                  whiteSpace: "pre-wrap"
                }}
              >
                {o.text}
              </div>
            ) : (
              <img
                key={k}
                src={toPreviewUrl(o.url)}
                alt={k}
                onClick={() => selectOverlay(k)}
                style={commonStyle}
                draggable={false}
              />
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div>Resolution: {meta.resolution}</div>
        <div>FPS: {meta.fps}</div>
      </div>
    </div>
  );
}
