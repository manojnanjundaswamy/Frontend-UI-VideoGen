import React from "react";

export default function MiniOverlayPreview({ overlay }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      {overlay.type === "image" && overlay.url && (
        <img src={overlay.url} className="max-w-full max-h-full object-contain" />
      )}

      {overlay.type === "video" && overlay.url && (
        <video
          src={overlay.url}
          className="max-w-full max-h-full object-contain"
          muted
          autoPlay
          loop
        />
      )}

      {overlay.type === "text" && (
        <div className="text-slate-200 text-center text-sm p-2 bg-slate-600/40 rounded">
          {overlay.text}
        </div>
      )}

      {overlay.type === "audio" && (
        <div className="text-xs text-slate-300">🎵 Audio Overlay</div>
      )}
    </div>
  );
}
