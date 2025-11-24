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

function TextArrayField({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-slate-300 mb-1">{label}</label>
      <input
        type="text"
        value={Array.isArray(value) ? value.join(",") : ""}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((x) => x.trim())
              .filter((x) => x !== "")
          )
        }
        placeholder="comma-separated"
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
      {/* SELECT OVERLAY */}
      <div className="mb-4">
        <label className="block text-sm text-slate-300 mb-1">Select Overlay</label>
        <select
          value={selectedOverlayId || ""}
          onChange={(e) => api.selectOverlay(e.target.value || null)}
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
        <div className="text-sm text-slate-500">
          Select an overlay from the list.
        </div>
      )}

      {selected && (
        <div>
          <div className="text-sm text-slate-400 mb-3">
            Type: <strong className="text-white">{selected.type}</strong>
          </div>

          {/* COMMON FIELDS */}
          <div className="mb-3">
            <label className="block text-sm text-slate-300 mb-1">URL</label>
            <input
              type="text"
              value={selected.url || ""}
              onChange={(e) => setField("url", e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
            />
          </div>

          {/* Scale */}
          <div className="mb-3">
            <label className="block text-sm text-slate-300 mb-1">Scale (ffmpeg)</label>
            <input
              type="text"
              value={selected.scale || ""}
              onChange={(e) => setField("scale", e.target.value)}
              placeholder="500:-1 or iw*0.5"
              className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
            />
          </div>

          <NumericField
            label="Opacity (0-100)"
            value={selected.opacity}
            onChange={(v) => setField("opacity", v)}
          />
          <NumericField
            label="X offset % (center origin)"
            value={selected.x_offset_percent}
            onChange={(v) => setField("x_offset_percent", v)}
          />
          <NumericField
            label="Y offset % (center origin)"
            value={selected.y_offset_percent}
            onChange={(v) => setField("y_offset_percent", v)}
          />
          <NumericField
            label="Layer (z-index)"
            value={selected.layer}
            onChange={(v) => setField("layer", v)}
          />

          {/* MATCHING FIELDS */}
          <TextArrayField
            label="segment_targets"
            value={selected.segment_targets}
            onChange={(arr) => setField("segment_targets", arr)}
          />
          <TextArrayField
            label="scene_types"
            value={selected.scene_types}
            onChange={(arr) => setField("scene_types", arr)}
          />
          <TextArrayField
            label="chapter_numbers"
            value={selected.chapter_numbers}
            onChange={(arr) => setField("chapter_numbers", arr)}
          />

          {/* EXTRA FIELDS */}
          <NumericField
            label="scale_factor"
            value={selected.scale_factor}
            onChange={(v) => setField("scale_factor", v)}
          />

          {/* Video-specific */}
          {selected.type === "video" && (
            <NumericField
              label="Loop? (1 = loop enabled)"
              value={selected.loop ? 1 : 0}
              onChange={(v) => setField("loop", v === 1)}
            />
          )}

          {/* Music-specific */}
          {selected.type === "music" && (
            <>
              <NumericField
                label="Volume"
                value={selected.volume}
                onChange={(v) => setField("volume", v)}
              />
              <NumericField
                label="Fade In (sec)"
                value={selected.fade_in}
                onChange={(v) => setField("fade_in", v)}
              />
              <NumericField
                label="Fade Out (sec)"
                value={selected.fade_out}
                onChange={(v) => setField("fade_out", v)}
              />
            </>
          )}

          {/* Text-specific */}
          {selected.type === "text" && (
            <>
              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Text</label>
                <input
                  type="text"
                  value={selected.text || ""}
                  onChange={(e) => setField("text", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Font</label>
                <input
                  type="text"
                  value={selected.font || ""}
                  onChange={(e) => setField("font", e.target.value)}
                  placeholder="/app/fonts/ComicNeue.ttf"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <NumericField
                label="Font Size"
                value={selected.fontsize}
                onChange={(v) => setField("fontsize", v)}
              />

              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Font Color</label>
                <input
                  type="text"
                  value={selected.fontcolor || ""}
                  onChange={(e) => setField("fontcolor", e.target.value)}
                  placeholder="white"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              {/* Text Box */}
              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-1">Box Background</label>
                <input
                  type="text"
                  value={selected.boxcolor || ""}
                  onChange={(e) => setField("boxcolor", e.target.value)}
                  placeholder="black@0.5"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <NumericField
                label="Box Border Width"
                value={selected.boxborderw}
                onChange={(v) => setField("boxborderw", v)}
              />
            </>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="px-3 py-2 bg-red-600 rounded text-sm"
              onClick={() => api.removeOverlay(selected.id)}
            >
              Remove
            </button>
            <button
              className="px-3 py-2 bg-slate-600 rounded text-sm"
              onClick={() => api.selectOverlay(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
