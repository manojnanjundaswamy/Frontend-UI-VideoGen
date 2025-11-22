// src/components/OverlayInspector.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";

function NumericField({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-slate-300 mb-1">{label}</label>
      <input
        type="number"
        value={value == null ? "" : value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
      />
    </div>
  );
}

export default function OverlayInspector() {
  const overlays = useEditorStore((s) => s.overlays || []);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);
  const api = useEditorStore.getState();

  const selected = overlays.find((o) => o.id === selectedOverlayId) || null;

  const setField = (key, val) => {
    if (!selected) return;
    api.updateOverlay(selected.id, { [key]: val });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm text-slate-300 mb-1">Select an overlay to edit.</label>
        <select
          value={selectedOverlayId || ""}
          onChange={(e) => {
            const v = e.target.value;
            api.selectOverlay(v || null);
          }}
          className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
        >
          <option value="">-- none --</option>
          {overlays.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id} · {o.type}
            </option>
          ))}
        </select>
      </div>

      {!selected && (
        <div className="text-sm text-slate-500">Select an overlay from the list above or click it on the canvas.</div>
      )}

      {selected && (
        <div>
          <div className="text-sm text-slate-400 mb-3">
            Type: <strong className="text-white">{selected.type}</strong>
          </div>

          {/* URL */}
          <div className="mb-3">
            <label className="block text-sm text-slate-300 mb-1">URL</label>
            <input
              type="text"
              value={selected.url || ""}
              onChange={(e) => setField("url", e.target.value)}
              placeholder="http://..."
              className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
            />
          </div>

          {/* Scale (ffmpeg style) */}
          <div className="mb-3">
            <label className="block text-sm text-slate-300 mb-1">Scale (ffmpeg style)</label>
            <input
              type="text"
              value={selected.scale || ""}
              onChange={(e) => setField("scale", e.target.value)}
              placeholder="1920:1080 or 500:-1"
              className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
            />
          </div>

          {/* Numeric fields */}
          <NumericField
            label="Opacity (0-100)"
            value={selected.opacity}
            onChange={(v) => setField("opacity", v)}
          />
          <NumericField
            label="X offset % (positive → right, center origin)"
            value={selected.x_offset_percent}
            onChange={(v) => setField("x_offset_percent", v)}
          />
          <NumericField
            label="Y offset % (positive → up, center origin)"
            value={selected.y_offset_percent}
            onChange={(v) => setField("y_offset_percent", v)}
          />
          <NumericField label="Layer (z-index)" value={selected.layer} onChange={(v) => setField("layer", v)} />

          {/* Colorkey */}
          <div className="mb-3">
            <label className="block text-sm text-slate-300 mb-1">Colorkey (e.g. black:0.08:0.1)</label>
            <input
              type="text"
              value={selected.colorkey || ""}
              onChange={(e) => setField("colorkey", e.target.value)}
              placeholder="black:0.08:0.1"
              className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
            />
          </div>

          {/* Text-specific fields */}
          {selected.type === "text" && (
            <>
              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Text</label>
                <input
                  type="text"
                  value={selected.text || ""}
                  onChange={(e) => setField("text", e.target.value)}
                  placeholder="Caption or title"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Font (path or family)</label>
                <input
                  type="text"
                  value={selected.font || ""}
                  onChange={(e) => setField("font", e.target.value)}
                  placeholder="/app/fonts/ComicNeue-BoldItalic.ttf"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <NumericField
                label="Font size"
                value={selected.fontsize}
                onChange={(v) => setField("fontsize", v)}
              />
              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Font color</label>
                <input
                  type="text"
                  value={selected.fontcolor || ""}
                  onChange={(e) => setField("fontcolor", e.target.value)}
                  placeholder="white"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="px-3 py-2 bg-red-600 rounded text-sm"
              onClick={() => {
                api.removeOverlay(selected.id);
              }}
            >
              Remove
            </button>
            <button
              className="px-3 py-2 bg-slate-600 rounded text-sm"
              onClick={() => {
                // done: simply deselect
                api.selectOverlay(null);
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
