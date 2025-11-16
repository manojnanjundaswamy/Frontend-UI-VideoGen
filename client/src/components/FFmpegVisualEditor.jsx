// src/components/EditorCanvas.jsx
import React, { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";

/**
 * cssScaleFromFFmpeg(scaleStr, naturalW, naturalH)
 * - supports "1920:1080", "600:-1", "iw*0.25:ih*0.25"
 * - returns { w, h } in pixels (integer)
 */
function cssScaleFromFFmpeg(scaleStr, naturalW = 600, naturalH = 400) {
  if (!scaleStr) return { w: naturalW, h: naturalH };

  // numeric W:H or with -1
  if (!/iw|ih/.test(scaleStr)) {
    const [ws, hs] = scaleStr.split(":").map((s) => Number(s));
    if (ws === -1 && hs > 0) {
      const h = hs;
      const aspect = naturalW / naturalH;
      const w = Math.round(h * aspect);
      return { w, h };
    }
    if (hs === -1 && ws > 0) {
      const w = ws;
      const aspect = naturalW / naturalH;
      const h = Math.round(w / aspect);
      return { w, h };
    }
    if (Number.isFinite(ws) && Number.isFinite(hs)) return { w: ws, h: hs };
  }

  // iw*X:ih*X
  if (/iw\*/.test(scaleStr) && /ih\*/.test(scaleStr)) {
    const [ws, hs] = scaleStr.split(":");
    const fx = parseFloat(ws.replace("iw*", "")) || 1;
    const fy = parseFloat(hs.replace("ih*", "")) || fx || 1;
    return { w: Math.round(naturalW * fx), h: Math.round(naturalH * fy) };
  }

  // fallback to natural
  return { w: naturalW, h: naturalH };
}

function toPreviewUrl(url) {
  if (!url) return url;
  return url.replace("host.docker.internal", "localhost");
}

export default function EditorCanvas() {
  const overlays = useEditorStore((s) => s.overlays);
  const texts = useEditorStore((s) => s.texts);
  const audioOverlays = useEditorStore((s) => s.audioOverlays);
  const meta = useEditorStore((s) => s.meta);
  const selectedKey = useEditorStore((s) => s.selectedKey);
  const selectKey = useEditorStore((s) => s.selectKey);

  const [assetsMeta, setAssetsMeta] = useState({});

  // load natural sizes (images)
  useEffect(() => {
    const keys = Object.keys(overlays);
    keys.forEach((k) => {
      const o = overlays[k];
      if (!o || !o.url) return;
      if (assetsMeta[k]) return;
      const img = new Image();
      img.onload = () => setAssetsMeta((s) => ({ ...s, [k]: { naturalW: img.naturalWidth, naturalH: img.naturalHeight } }));
      img.onerror = () => setAssetsMeta((s) => ({ ...s, [k]: { naturalW: 600, naturalH: 400 } }));
      img.src = toPreviewUrl(o.url);
    });
  }, [overlays]); // eslint-disable-line

  // resolution canvas size (logical)
  const [resW, resH] = (meta?.resolution || "1920:1080").split(":").map(Number);

  // combine overlays + texts sorted by layer
  const entries = Object.entries({ ...overlays, ...texts, ...audioOverlays }).sort((a, b) => (a[1].layer || 0) - (b[1].layer || 0));

  // fixed preview container width but scaled to resolution ratio
  const previewWidth = 900;
  const previewHeight = Math.round((previewWidth * resH) / resW);
  const pxScale = previewWidth / resW; // convert ffmpeg-px to UI px

  return (
    <div>
      <div style={{ width: previewWidth, height: previewHeight, background: "#101019", position: "relative", borderRadius: 8, overflow: "hidden" }}>
        {/* center coordinate origin */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: previewWidth, height: previewHeight }}>
          {entries.map(([k, o]) => {
            const asset = assetsMeta[k] || { naturalW: 600, naturalH: 400 };
            const { w: ovW, h: ovH } = cssScaleFromFFmpeg(o.scale, asset.naturalW, asset.naturalH);
            // compute center-based position in ffmpeg pixels
            const xp = (o.x_offset_percent || 0) / 100;
            const yp = (o.y_offset_percent || 0) / 100;
            const ff_left = (resW - ovW) / 2 + resW * xp;
            const ff_top = (resH - ovH) / 2 - resH * yp; // subtract because positive yp goes up in UI
            // convert to preview px
            const left = Math.round(ff_left * pxScale);
            const top = Math.round(ff_top * pxScale);
            const width = Math.round(ovW * pxScale);
            const height = Math.round(ovH * pxScale);

            const style = {
              position: "absolute",
              left,
              top,
              width,
              height,
              opacity: (o.opacity != null ? (o.opacity / 100) : 1),
              cursor: "pointer",
              zIndex: (o.layer ?? 0) + 1000,
              transformOrigin: "top left",
              objectFit: "cover"
            };

            if (o.type === "text") {
              return (
                <div key={k} onClick={() => selectKey(k)} style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", color: o.fontcolor || "white", fontSize: o.fontsize || 48, padding: 6, background: o.box ? (o.boxcolor || "rgba(0,0,0,0.4)") : "transparent", whiteSpace: "pre-wrap" }}>
                  {o.text}
                </div>
              );
            }

            return <img key={k} src={toPreviewUrl(o.url)} onClick={() => selectKey(k)} style={style} alt={k} draggable={false} />;
          })}
        </div>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <div>Resolution: {meta.resolution}</div>
        <div>FPS: {meta.fps}</div>
      </div>
    </div>
  );
}
