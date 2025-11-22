// src/components/TimelineEditor.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function TimelineEditor() {
  const segments = useEditorStore((s) => s.segments || []);
  const preview = async (seg) => {
    // stub preview action
    console.log('Preview seg', seg);
    alert('Preview requested (stub) for seg ' + seg.segment_number);
  };
  const renderSeg = async (seg) => {
    console.log('Render seg', seg);
    alert('Render requested (stub) for seg ' + seg.segment_number);
  };

  if (!segments || segments.length === 0) {
    return <div className="text-sm text-slate-400">Load a row to see segments.</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <label className="inline-flex items-center">
          <input type="checkbox" className="mr-2" defaultChecked />
          <span className="text-sm text-slate-300">Include Audio in Preview</span>
        </label>
      </div>

      <h4 className="font-semibold mb-2">Timeline</h4>
      <div className="space-y-3">
        {segments.map((seg, i) => (
          <div key={`${seg.segment_number}-${i}`} className="bg-slate-900 rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">Seg {seg.segment_number} • Ch {seg.chapter_number} • {seg.scene_type}</div>
              <div className="text-xs text-slate-400">{seg.chapter_name || seg.narration_text?.slice(0, 80)}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-sky-600 rounded text-sm" onClick={() => preview(seg)}>Preview</button>
              <button className="px-3 py-1 bg-emerald-600 rounded text-sm" onClick={() => renderSeg(seg)}>Render</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
