import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export default function OverlayInspector() {
  const {
    overlays,
    selectedOverlayId,
    setSelectedOverlayId,
    updateOverlay,
    removeOverlay
  } = useEditorStore();

  if (!selectedOverlayId) {
    return <div className="p-3 text-slate-300">Select an overlay to edit.</div>;
  }

  const overlay = overlays[selectedOverlayId];
  if (!overlay) {
    return <div className="p-3 text-slate-300">Overlay not found.</div>;
  }

  const onChange = (k, v) => {
    updateOverlay(selectedOverlayId, { [k]: v });
  };

  return (
    <div className="p-3">
      <h4 className="font-semibold">Inspector</h4>

      <div className="mt-3">
        <label className="text-xs text-slate-300">Type</label>
        <div className="text-sm mb-2">{overlay.type || (overlay.url?.endsWith('.mp4') ? 'video' : 'image')}</div>

        <label className="text-xs text-slate-300">URL</label>
        <input className="w-full p-2 bg-slate-800 rounded" value={overlay.url || ''} onChange={e => onChange('url', e.target.value)} />

        <label className="text-xs text-slate-300 mt-2">Scale (ffmpeg style or leave blank)</label>
        <input className="w-full p-2 bg-slate-800 rounded" value={overlay.scale || ''} onChange={e => onChange('scale', e.target.value)} />

        <label className="text-xs text-slate-300 mt-2">Scale Factor (optional, numeric)</label>
        <input className="w-full p-2 bg-slate-800 rounded" value={overlay.scale_factor ?? ''} onChange={e => onChange('scale_factor', e.target.value ? parseFloat(e.target.value) : undefined)} />

        <label className="text-xs text-slate-300 mt-2">Opacity (0-100)</label>
        <input className="w-full p-2 bg-slate-800 rounded" type="number" min="0" max="100" value={overlay.opacity ?? 100} onChange={e => onChange('opacity', Number(e.target.value))} />

        <label className="text-xs text-slate-300 mt-2">X offset %</label>
        <input className="w-full p-2 bg-slate-800 rounded" type="number" value={overlay.x_offset_percent ?? 0} onChange={e => onChange('x_offset_percent', Number(e.target.value))} />

        <label className="text-xs text-slate-300 mt-2">Y offset %</label>
        <input className="w-full p-2 bg-slate-800 rounded" type="number" value={overlay.y_offset_percent ?? 0} onChange={e => onChange('y_offset_percent', Number(e.target.value))} />

        <label className="text-xs text-slate-300 mt-2">Layer</label>
        <input className="w-full p-2 bg-slate-800 rounded" type="number" value={overlay.layer ?? 0} onChange={e => onChange('layer', Number(e.target.value))} />

        <label className="text-xs text-slate-300 mt-2">Colorkey (e.g. black:0.08:0.1)</label>
        <input className="w-full p-2 bg-slate-800 rounded" value={overlay.colorkey || ''} onChange={e => onChange('colorkey', e.target.value)} />

        <div className="mt-4 flex gap-2">
          <button className="px-3 py-2 bg-red-600 rounded" onClick={() => { if (confirm('Remove overlay?')) { removeOverlay(selectedOverlayId); } }}>Remove</button>
          <button className="px-3 py-2 bg-slate-600 rounded" onClick={() => setSelectedOverlayId(null)}>Done</button>
        </div>
      </div>
    </div>
  );
}
