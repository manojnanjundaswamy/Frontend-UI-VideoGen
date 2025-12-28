import React from "react";
import useEditorStore from "../store/useEditorStore";
import MultiSelect from "./ui/MultiSelect";
import Button from "./ui/Button";

function NumericField({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type="number"
        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type="text"
        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function OverlayInspector() {
  const overlays = useEditorStore((s) => s.overlays || []);
  const segments = useEditorStore((s) => s.segments || []);
  const selectedId = useEditorStore((s) => s.selectedOverlayId);
  const api = useEditorStore.getState();

  const selected = overlays.find((o) => o.id === selectedId);

  const set = (k, v) => {
    if (selected) api.updateOverlay(selected.id, { [k]: v });
  };

  // Build dynamic options
  const segmentNums = [...new Set(segments.map((s) => s.segment_number))];
  const sceneTypes = [...new Set(segments.map((s) => s.scene_type))];
  const chapterNums = [...new Set(segments.map((s) => s.chapter_number))];

  if (!selected) return (
    <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm border border-dashed border-white/5 rounded-lg">
      <p>No overlay selected</p>
      <p className="text-xs text-slate-600 mt-1">Select an overlay to edit properties</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-bold">Selected Overlay</div>
        <div className="font-mono text-sm text-indigo-400 break-all">{selected.id}</div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Common Properties</h4>
        {/* URL */}
        <InputField label="URL / Source" value={selected.url} onChange={(v) => set("url", v)} placeholder="https://..." />

        {/* Scale */}
        <InputField label="Scale (FFmpeg)" value={selected.scale} onChange={(v) => set("scale", v)} placeholder="500:-1" />

        <div className="grid grid-cols-2 gap-3">
          <NumericField label="X Offset %" value={selected.x_offset_percent} onChange={(v) => set("x_offset_percent", v)} />
          <NumericField label="Y Offset %" value={selected.y_offset_percent} onChange={(v) => set("y_offset_percent", v)} />
        </div>

        <NumericField label="Layer (Z-Index)" value={selected.layer} onChange={(v) => set("layer", v)} />

        {/* Opacity Slider */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-400">Opacity</label>
            <span className="text-xs text-slate-500">{selected.opacity ?? 100}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            value={selected.opacity ?? 100}
            onChange={(e) => set("opacity", Number(e.target.value))}
          />
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between mb-3 bg-slate-900 border border-white/5 p-3 rounded">
          <label className="text-xs font-medium text-slate-300">Visible in Preview</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={selected.visible !== false}
              onChange={(e) => set("visible", e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Colorkey */}
        <InputField label="Colorkey" value={selected.colorkey} onChange={(v) => set("colorkey", v)} placeholder="black:0.08:0.1" />
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtering & Conditions</h4>
        <MultiSelect label="Segment Targets" value={selected.segment_targets} options={segmentNums} onChange={(arr) => set("segment_targets", arr.map(Number))} />
        <MultiSelect label="Scene Types" value={selected.scene_types} options={sceneTypes} onChange={(arr) => set("scene_types", arr)} />
        <MultiSelect label="Chapter Numbers" value={selected.chapter_numbers} options={chapterNums} onChange={(arr) => set("chapter_numbers", arr.map(Number))} />
      </div>

      {/* ---------------- TYPE SPECIFIC ---------------- */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type Specific: {selected.type}</h4>

        {selected.type === "video" && (
          <div className="space-y-3">
            <NumericField label="Loop (1=Yes)" value={selected.loop ? 1 : 0} onChange={(v) => set("loop", v === 1)} />
            <div className="grid grid-cols-2 gap-3">
              <NumericField label="Start Time" value={selected.start_time} onChange={(v) => set("start_time", v)} />
              <NumericField label="Duration" value={selected.duration} onChange={(v) => set("duration", v)} />
            </div>
          </div>
        )}

        {selected.type === "music" && (
          <div className="space-y-3">
            <NumericField label="Volume" value={selected.volume} onChange={(v) => set("volume", v)} />
            <div className="grid grid-cols-2 gap-3">
              <NumericField label="Fade In" value={selected.fade_in} onChange={(v) => set("fade_in", v)} />
              <NumericField label="Fade Out" value={selected.fade_out} onChange={(v) => set("fade_out", v)} />
            </div>
            <NumericField label="Start Time" value={selected.start_time} onChange={(v) => set("start_time", v)} />
          </div>
        )}

        {selected.type === "text" && (
          <div className="space-y-3">
            <InputField label="Text Content" value={selected.text} onChange={(v) => set("text", v)} />
            <div className="grid grid-cols-2 gap-3">
              <NumericField label="Font Size" value={selected.fontsize} onChange={(v) => set("fontsize", v)} />
              <NumericField label="Border Width" value={selected.boxborderw} onChange={(v) => set("boxborderw", v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Font Color" value={selected.fontcolor} onChange={(v) => set("fontcolor", v)} />
              <InputField label="Box Color" value={selected.boxcolor} onChange={(v) => set("boxcolor", v)} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-6">
        <Button variant="danger" size="sm" className="flex-1" onClick={() => api.removeOverlay(selected.id)}>
          Remove Overlay
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => api.selectOverlay(null)}>
          Done
        </Button>
      </div>
    </div>
  );
}
