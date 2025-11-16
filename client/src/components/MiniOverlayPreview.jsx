// src/components/MiniOverlayPreview.jsx
import React from "react";

export default function MiniOverlayPreview({ overlay }) {
  if (!overlay) {
    return <div className="w-full h-full bg-slate-700/40" />;
  }

  const wrap = "w-full h-full flex items-center justify-center overflow-hidden rounded";

  if (overlay.type === "image" && overlay.url) {
    return (
      <div className={wrap + " bg-slate-700/40"}>
        <img src={overlay.url} alt="preview" className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  if (overlay.type === "video" && overlay.url) {
    return (
      <div className={wrap + " bg-slate-700/40"}>
        <video src={overlay.url} className="max-w-full max-h-full object-contain" autoPlay muted loop />
      </div>
    );
  }

  if (overlay.type === "text") {
    return (
      <div className={wrap + " bg-slate-700/40 p-2"}>
        <div className="text-sm text-slate-100 text-center">{overlay.text || "Text"}</div>
      </div>
    );
  }

  if (overlay.type === "audio") {
    return <div className={wrap + " bg-slate-700/40 text-xs text-slate-200"}>Audio overlay</div>;
  }

  return <div className={wrap + " bg-slate-700/40"} />;
}
