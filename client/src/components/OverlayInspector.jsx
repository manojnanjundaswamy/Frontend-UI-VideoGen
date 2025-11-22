// src/components/OverlayInspector.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';

function NumericInput({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-slate-300 mb-1">{label}</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full bg-slate-700 text-white p-2 rounded"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function OverlayInspector() {
  // safe overlay list
  const overlaysRaw = useEditorStore(s => s.overlays);
  const overlays = Array.isArray(overlaysRaw) ? overlaysRaw : (overlaysRaw ? Object.values(overlaysRaw) : []);
  const selectedOverlayId = useEditorStore(s => s.selectedOverlayId);
  const updateOverlay = useEditorStore(s => s.updateOverlay);
  const removeOverlay = useEditorStore(s => s.removeOverlay);

  const overlay = overlays.find(o => o.id === selectedOverlayId);
  if (!overlay) return <div className="text-sm text-slate-400">Select an overlay to edit.</div>;

  return (
    <div>
      <div className="mb-3 text-sm">Type: <strong>{overlay.type}</strong></div>

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">URL</label>
        <input className="w-full bg-slate-700 text-white p-2 rounded" value={overlay.url || ''} onChange={e => updateOverlay(overlay.id, { url: e.target.value })} />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">Scale (ffmpeg style or blank)</label>
        <input className="w-full bg-slate-700 text-white p-2 rounded" value={overlay.scale || ''} onChange={e => updateOverlay(overlay.id, { scale: e.target.value })} placeholder="e.g. 1920:1080 or iw*0.25:ih*0.25" />
      </div>

      <NumericInput label="Scale Factor (numeric)" value={overlay.scaleFactor} onChange={v => updateOverlay(overlay.id, { scaleFactor: v })} placeholder="1" />
      <NumericInput label="Opacity (0-100)" value={overlay.opacity} onChange={v => updateOverlay(overlay.id, { opacity: v })} />
      <NumericInput label="X offset % (positive → right)" value={overlay.x_offset_percent} onChange={v => updateOverlay(overlay.id, { x_offset_percent: v })} />
      <NumericInput label="Y offset % (positive → up)" value={overlay.y_offset_percent} onChange={v => updateOverlay(overlay.id, { y_offset_percent: v })} />
      <NumericInput label="Layer (z-index)" value={overlay.layer} onChange={v => updateOverlay(overlay.id, { layer: v })} />

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">Colorkey (e.g. black:0.08:0.1)</label>
        <input className="w-full bg-slate-700 text-white p-2 rounded" value={overlay.colorkey || ''} onChange={e => updateOverlay(overlay.id, { colorkey: e.target.value })} />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">Segment targets (CSV numbers)</label>
        <input
          className="w-full bg-slate-700 text-white p-2 rounded"
          value={(overlay.segment_targets || []).join(',')}
          onChange={e => updateOverlay(overlay.id, { segment_targets: e.target.value.split(',').map(s => s.trim()).filter(Boolean).map(Number) })}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={() => removeOverlay(overlay.id)}>Remove</button>
        <button className="bg-slate-600 px-3 py-1 rounded text-sm">Done</button>
      </div>
    </div>
  );
}
