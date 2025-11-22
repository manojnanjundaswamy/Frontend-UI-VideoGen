import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function TimelineEditor() {
  const segments = useEditorStore(s => s.segments);
  const exportFilterConfig = useEditorStore(s => s.exportFilterConfig);

  const handlePreview = (seg) => {
    // for now we just open a window with JSON preview
    const filter = exportFilterConfig();
    const payload = { segment: seg, filter_config: filter, need_audio: true };
    window.open().document.write(`<pre>${JSON.stringify(payload, null, 2)}</pre>`);
  };

  if (!segments || !segments.length) return <div className="text-sm text-slate-400">Load a row to see segments.</div>;

  return (
    <div>
      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" defaultChecked className="w-4 h-4" /> <span className="text-sm">Include Audio in Preview</span>
      </label>

      <div className="space-y-3">
        {segments.map(seg => (
          <div key={seg.segment_number} className="bg-slate-700 p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Seg {seg.segment_number} • Ch {seg.chapter_number} • {seg.scene_type}</div>
                <div className="text-xs text-slate-400">{seg.chapter_name}</div>
              </div>
              <div className="flex gap-2">
                <button className="bg-sky-600 px-3 py-1 rounded text-sm" onClick={() => handlePreview(seg)}>Preview</button>
                <button className="bg-emerald-600 px-3 py-1 rounded text-sm">Render</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
