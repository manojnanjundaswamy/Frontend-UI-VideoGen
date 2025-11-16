// src/components/OverlayInspector.jsx
import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export default function OverlayInspector() {
  const { overlays, selectedOverlayId, updateOverlay, removeOverlay, segments, selectedRow, setSelectedRow } = useEditorStore();
  const overlay = selectedOverlayId ? overlays[selectedOverlayId] : null;

  const segmentNumbers = Array.from(new Set((segments || []).map(s => s.segment_number))).sort((a,b) => a-b);
  const chapterNumbers = Array.from(new Set((segments || []).map(s => s.chapter_number))).sort((a,b) => a-b);
  const sceneTypes = Array.from(new Set((segments || []).map(s => s.scene_type))).filter(Boolean);

  if (!overlay) {
    return (
      <div className="p-4 text-slate-400">
        Select an overlay to edit.
      </div>
    );
  }

  const patch = (patchObj) => updateOverlay(overlay.id, patchObj);

  const toggleInArray = (arr = [], val) => {
    const s = new Set(arr);
    if (s.has(val)) s.delete(val);
    else s.add(val);
    return Array.from(s);
  };

  return (
    <div className="p-4 text-slate-200">
      <h3 className="font-semibold mb-2">Inspector</h3>
      <div className="text-xs text-slate-400 mb-2">Type: <strong className="text-white">{overlay.type}</strong></div>

      {/* url / text */}
      {overlay.type === 'text' ? (
        <div className="mb-3">
          <label className="text-xs text-slate-400">Text</label>
          <textarea className="w-full bg-slate-800 text-white rounded p-2 mt-1" rows={3} value={overlay.text || ''} onChange={(e) => patch({ text: e.target.value })} />
        </div>
      ) : (
        <div className="mb-3">
          <label className="text-xs text-slate-400">URL</label>
          <input type="text" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.url || ''} onChange={(e) => patch({ url: e.target.value })} />
        </div>
      )}

      {/* ffmpeg scale */}
      <div className="mb-3">
        <label className="text-xs text-slate-400">Scale (ffmpeg style)</label>
        <input className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.scale || ''} onChange={(e) => patch({ scale: e.target.value })} placeholder="1920:1080 or iw*0.2:ih*0.2" />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400">Scale Factor (optional)</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.scale_factor ?? 1} onChange={(e) => patch({ scale_factor: Number(e.target.value) })} step="0.01" />
        </div>
        <div>
          <label className="text-xs text-slate-400">Opacity (0-100)</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.opacity ?? 100} onChange={(e) => patch({ opacity: Number(e.target.value) })} />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs text-slate-400">Colorkey (e.g. black:0.08:0.1)</label>
        <input className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.colorkey || ''} onChange={(e) => patch({ colorkey: e.target.value })} />
      </div>

      {/* position & preview sizes */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400">X offset %</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.x_offset_percent ?? 0} onChange={(e) => patch({ x_offset_percent: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs text-slate-400">Y offset % (positive moves down)</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.y_offset_percent ?? 0} onChange={(e) => patch({ y_offset_percent: Number(e.target.value) })} />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400">Layer</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.layer ?? 0} onChange={(e) => patch({ layer: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs text-slate-400">Loop (videos)</label>
          <input type="checkbox" className="ml-2" checked={!!overlay.loop} onChange={(e) => patch({ loop: !!e.target.checked })} />
        </div>
      </div>

      {/* preview box size */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400">Preview Width (px)</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.preview_w || 300} onChange={(e) => patch({ preview_w: Number(e.target.value) || 1 })} />
        </div>
        <div>
          <label className="text-xs text-slate-400">Preview Height (px)</label>
          <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.preview_h || 150} onChange={(e) => patch({ preview_h: Number(e.target.value) || 1 })} />
        </div>
      </div>

      {/* scope selection */}
      <div className="mb-3">
        <label className="text-xs text-slate-400">Scene Type</label>
        <select className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.scene_types?.[0] || ''} onChange={(e) => patch({ scene_types: e.target.value ? [e.target.value] : [] })}>
          <option value=''>(all)</option>
          {sceneTypes.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-xs text-slate-400">Segment targets (select multiple)</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {segmentNumbers.length === 0 ? <div className="text-xs text-slate-400">No segments loaded</div> :
            segmentNumbers.map(n => (
              <label key={n} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={(overlay.segment_targets || []).includes(n)} onChange={(e) => patch({ segment_targets: toggleInArray(overlay.segment_targets || [], n) })} />
                <span>Seg {n}</span>
              </label>
            ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs text-slate-400">Chapter numbers (select multiple)</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {chapterNumbers.length === 0 ? <div className="text-xs text-slate-400">No chapters</div> :
            chapterNumbers.map(n => (
              <label key={n} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={(overlay.chapter_numbers || []).includes(n)} onChange={(e) => patch({ chapter_numbers: toggleInArray(overlay.chapter_numbers || [], n) })} />
                <span>Ch {n}</span>
              </label>
            ))}
        </div>
      </div>

      {/* visual-only options for text */}
      {overlay.type === 'text' && (
        <>
          <div className="mb-3">
            <label className="text-xs text-slate-400">Font (path or family)</label>
            <input className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.font || ''} onChange={(e) => patch({ font: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="text-xs text-slate-400">Font color</label>
            <input className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.fontcolor || ''} onChange={(e) => patch({ fontcolor: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="text-xs text-slate-400">Font size</label>
            <input type="number" className="w-full bg-slate-800 text-white rounded p-2 mt-1" value={overlay.fontsize || 48} onChange={(e) => patch({ fontsize: Number(e.target.value) })} />
          </div>
        </>
      )}

      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 bg-red-600 rounded text-white" onClick={() => removeOverlay(overlay.id)}>Remove</button>
        <button className="px-3 py-2 bg-slate-600 rounded text-white" onClick={() => updateOverlay(overlay.id, {})}>Done</button>
      </div>
    </div>
  );
}
