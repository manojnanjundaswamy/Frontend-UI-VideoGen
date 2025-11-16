import React from "react";
import { useEditorStore } from "../store/useEditorStore";

export default function OverlayInspector() {
  const { overlays, selectedOverlayId, updateOverlay, removeOverlay, selectOverlay } = useEditorStore();
  const selected = selectedOverlayId ? overlays[selectedOverlayId] : null;

  if (!selected) {
    return (
      <div className="p-4 text-slate-300">
        Select an overlay to edit.
      </div>
    );
  }

  const patch = (partial) => updateOverlay(selected.id, partial);

  return (
    <div className="p-4">
      <h3 className="font-semibold text-slate-100">Inspector</h3>
      <div className="text-sm text-slate-300 mb-4">Type: <strong>{selected.type}</strong></div>

      {/* COMMON: url for media types */}
      {["image","video","audio"].includes(selected.type) && (
        <>
          <label className="text-xs text-slate-300">URL</label>
          <input className="w-full mb-2" value={selected.url || ""} onChange={e => patch({ url: e.target.value })} />
        </>
      )}

      {/* IMAGE/VIDEO: scale / scale_factor / colorkey / opacity / offsets / layer */}
      {["image","video"].includes(selected.type) && (
        <>
          <label className="text-xs text-slate-300">Scale (ffmpeg style or leave blank)</label>
          <input className="w-full mb-2" value={selected.scale || ""} onChange={e => patch({ scale: e.target.value })} />
          <label className="text-xs text-slate-300">Scale Factor (optional numeric)</label>
          <input className="w-full mb-2" value={selected.scale_factor ?? 1} onChange={e => patch({ scale_factor: parseFloat(e.target.value) || 1 })} />
          <label className="text-xs text-slate-300">Colorkey (e.g. black:0.08:0.1)</label>
          <input className="w-full mb-2" value={selected.colorkey || ""} onChange={e => patch({ colorkey: e.target.value })} />
        </>
      )}

      {/* TEXT */}
      {selected.type === "text" && (
        <>
          <label className="text-xs text-slate-300">Text</label>
          <textarea className="w-full mb-2" rows={3} value={selected.text || ""} onChange={e => patch({ text: e.target.value })} />
          <label className="text-xs text-slate-300">Font</label>
          <input className="w-full mb-2" value={selected.font || ""} onChange={e => patch({ font: e.target.value })} />
          <label className="text-xs text-slate-300">Font color</label>
          <input className="w-full mb-2" value={selected.fontcolor || "white"} onChange={e => patch({ fontcolor: e.target.value })} />
          <label className="text-xs text-slate-300">Font size</label>
          <input className="w-full mb-2" value={selected.fontsize || 48} onChange={e => patch({ fontsize: parseInt(e.target.value) || 48 })} />
        </>
      )}

      {/* AUDIO / MUSIC */}
      {selected.type === "audio" && (
        <>
          <label className="text-xs text-slate-300">URL</label>
          <input className="w-full mb-2" value={selected.url || ""} onChange={e => patch({ url: e.target.value })} />
          <label className="text-xs text-slate-300">Volume (0-1)</label>
          <input className="w-full mb-2" value={selected.volume ?? 0.2} onChange={e => patch({ volume: parseFloat(e.target.value) || 0.2 })} />
          <label className="text-xs text-slate-300">Fade In (s)</label>
          <input className="w-full mb-2" value={selected.fade_in ?? 0} onChange={e => patch({ fade_in: parseFloat(e.target.value) || 0 })} />
          <label className="text-xs text-slate-300">Fade Out (s)</label>
          <input className="w-full mb-2" value={selected.fade_out ?? 0} onChange={e => patch({ fade_out: parseFloat(e.target.value) || 0 })} />
          <label className="text-xs text-slate-300">Scope (all | intro | chapter | segment)</label>
          <input className="w-full mb-2" value={selected.scope || "all"} onChange={e => patch({ scope: e.target.value })} />
        </>
      )}

      {/* COMMON: opacity, offsets, layer */}
      <label className="text-xs text-slate-300">Opacity (0-100)</label>
      <input className="w-full mb-2" value={selected.opacity ?? 100} onChange={e => patch({ opacity: parseInt(e.target.value) || 100 })} />
      <label className="text-xs text-slate-300">X offset %</label>
      <input className="w-full mb-2" value={selected.x_offset_percent ?? 0} onChange={e => patch({ x_offset_percent: parseFloat(e.target.value) || 0 })} />
      <label className="text-xs text-slate-300">Y offset % (positive moves down)</label>
      <input className="w-full mb-2" value={selected.y_offset_percent ?? 0} onChange={e => patch({ y_offset_percent: parseFloat(e.target.value) || 0 })} />
      <label className="text-xs text-slate-300">Layer</label>
      <input className="w-full mb-2" value={selected.layer ?? 0} onChange={e => patch({ layer: parseInt(e.target.value) || 0 })} />

      {/* CHAPTER ANIMATION editor */}
      {selected.type === "chapter_anim" && (
        <>
          <label className="text-xs text-slate-300">Enable</label>
          <input type="checkbox" checked={selected.enable} onChange={e => patch({ enable: !!e.target.checked })} />
          <label className="text-xs text-slate-300">Mode (intro | full | intro_and_full)</label>
          <input className="w-full mb-2" value={selected.mode || "intro"} onChange={e => patch({ mode: e.target.value })} />
          <label className="text-xs text-slate-300">Duration (s)</label>
          <input className="w-full mb-2" value={selected.duration || 3} onChange={e => patch({ duration: parseFloat(e.target.value) || 3 })} />
        </>
      )}

      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 bg-red-600 rounded" onClick={() => { removeOverlay(selected.id); }}>Remove</button>
        <button className="px-3 py-2 bg-gray-600 rounded" onClick={() => selectOverlay(null)}>Done</button>
      </div>
    </div>
  );
}
