import React from "react";
import { useEditorStore } from "../store/useEditorStore";

export default function OverlayInspector() {
  const { overlays, selectedOverlayId, updateOverlay, removeOverlay, selectOverlay } =
    useEditorStore();
  const selected = selectedOverlayId ? overlays[selectedOverlayId] : null;

  if (!selected) {
    return (
      <div className="p-4 text-slate-400">
        Select an overlay to edit.
      </div>
    );
  }

  const patch = (p) => updateOverlay(selected.id, p);

  const input = (label, value, onChange, props = {}) => (
    <div className="mb-3">
      <label className="text-xs text-slate-400">{label}</label>
      <input
        className="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 border border-slate-600"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );

  return (
    <div className="p-4 text-slate-200">
      <h3 className="font-semibold mb-2">Inspector</h3>
      <div className="text-xs text-slate-400 mb-4">
        Type: <span className="text-slate-200">{selected.type}</span>
      </div>

      {/* IMAGE/VIDEO/AUDIO URL */}
      {["image", "video", "audio"].includes(selected.type) &&
        input("URL", selected.url, (v) => patch({ url: v }))}

      {/* SCALE */}
      {["image", "video"].includes(selected.type) &&
        input("Scale (ffmpeg style)", selected.scale, (v) => patch({ scale: v }))}

      {["image", "video"].includes(selected.type) &&
        input(
          "Scale Factor",
          selected.scale_factor,
          (v) => patch({ scale_factor: parseFloat(v) || 1 }),
          { type: "number", step: "0.01" }
        )}

      {selected.type === "text" &&
        input("Text", selected.text, (v) => patch({ text: v }))}

      {selected.type === "text" &&
        input("Font", selected.font, (v) => patch({ font: v }))}

      {selected.type === "text" &&
        input("Font Size", selected.fontsize, (v) => patch({ fontsize: parseInt(v) || 48 }),
        { type: "number" })}

      {/* AUDIO */}
      {selected.type === "audio" &&
        input("Volume", selected.volume, (v) => patch({ volume: parseFloat(v) || 0.2 }),
        { type: "number", step: "0.01", min: 0, max: 1 })}

      {/* COMMON */}
      {input(
        "Opacity (0-100)",
        selected.opacity,
        (v) => patch({ opacity: parseInt(v) || 100 }),
        { type: "number", min: 0, max: 100 }
      )}

      {input(
        "X offset %",
        selected.x_offset_percent,
        (v) => patch({ x_offset_percent: parseFloat(v) || 0 }),
        { type: "number", step: "0.1" }
      )}

      {input(
        "Y offset % (positive moves down)",
        selected.y_offset_percent,
        (v) => patch({ y_offset_percent: parseFloat(v) || 0 }),
        { type: "number", step: "0.1" }
      )}

      {input(
        "Layer",
        selected.layer,
        (v) => patch({ layer: parseInt(v) || 0 }),
        { type: "number" }
      )}

      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-red-700 rounded"
          onClick={() => removeOverlay(selected.id)}
        >
          Remove
        </button>
        <button
          className="px-3 py-1 bg-slate-700 rounded"
          onClick={() => selectOverlay(null)}
        >
          Done
        </button>
      </div>
    </div>
  );
}
