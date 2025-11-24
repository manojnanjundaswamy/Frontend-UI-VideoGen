import React from 'react';
import useEditorStore from '../store/useEditorStore';
import generateFullConfig from "../utils/generateFilterConfig";
import { requestPreview, requestRender } from "../hooks/useN8NPreview";

export default function TimelineEditor() {
  const segments = useEditorStore((s) => s.segments || []);
  const rawState = useEditorStore.getState().getStateRaw();

  const doPreview = async (seg) => {
    try {
      const filterConfig = generateFullConfig(rawState);
      const response = await requestPreview(seg, filterConfig, true);

      console.log("Preview result:", response);
      alert("Preview started! Check n8n output window.");

    } catch (err) {
      console.error(err);
      alert("Preview failed: " + err.message);
    }
  };

  const doRender = async (seg) => {
    try {
      const filterConfig = generateFullConfig(rawState);
      const response = await requestRender(seg, filterConfig);

      console.log("Render result:", response);
      alert("Render started! Check n8n workflow.");

    } catch (err) {
      console.error(err);
      alert("Render failed: " + err.message);
    }
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
          <div key={`${seg.segment_number}-${i}`}
               className="bg-slate-900 rounded p-3 flex justify-between items-center">

            <div>
              <div className="font-medium">
                Seg {seg.segment_number} • Ch {seg.chapter_number} • {seg.scene_type}
              </div>
              <div className="text-xs text-slate-400">
                {seg.chapter_name || seg.narration_text?.slice(0, 80)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-sky-600 rounded text-sm"
                onClick={() => doPreview(seg)}
              >
                Preview
              </button>

              <button
                className="px-3 py-1 bg-emerald-600 rounded text-sm"
                onClick={() => doRender(seg)}
              >
                Render
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
