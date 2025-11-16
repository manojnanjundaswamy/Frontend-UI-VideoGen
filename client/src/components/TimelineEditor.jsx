// src/components/TimelineEditor.jsx
import React from "react";
import { useEditorStore } from "../store/useEditorStore";
import { requestPreview, requestRender } from "../hooks/useN8NPreview";
import { buildFilterConfig } from "../utils/ffmpegConfigBuilder";

export default function TimelineEditor() {
  const segments = useEditorStore((s) => s.selectedRow?.prompt_parsed || []);
  const overlays = useEditorStore((s) => s.overlays);
  const texts = useEditorStore((s) => s.texts);
  const audioOverlays = useEditorStore((s) => s.audioOverlays);
  const meta = useEditorStore((s) => s.meta);
  const needAudio = useEditorStore((s) => s.needAudio);
  const setNeedAudio = useEditorStore((s) => s.setNeedAudio);

  const [status, setStatus] = React.useState(null);

  if (!segments || !segments.length) {
    return <div className="text-sm text-slate-400">Load a row to see segments.</div>;
  }

  const handlePreview = async (seg) => {
    setStatus("previewing");
    try {
      const filter_config = buildFilterConfig(meta, {}, overlays, texts, audioOverlays, {});
      const res = await requestPreview(seg, filter_config, needAudio);
      setStatus("preview_ok");
      // try to find file_url
      const fileUrl = res.preview_url || res.file_url || (Array.isArray(res.response) && res.response[0]?.file_url);
      if (fileUrl) {
        window.dispatchEvent(new CustomEvent("ffmpeg-preview", { detail: { url: fileUrl.replace("host.docker.internal", "localhost") } }));
      }
    } catch (err) {
      console.error(err);
      setStatus("preview_error");
    }
  };

  const handleRender = async (seg) => {
    setStatus("rendering");
    try {
      const filter_config = buildFilterConfig(meta, {}, overlays, texts, audioOverlays, {});
      const res = await requestRender(seg, filter_config);
      setStatus(`render_ok`);
      console.info("Render response", res);
    } catch (err) {
      console.error(err);
      setStatus("render_error");
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <input type="checkbox" checked={needAudio} onChange={(e) => setNeedAudio(e.target.checked)} />
        <label className="text-sm">Include Audio in Preview</label>
      </div>

      <h4 className="font-semibold mb-2">Timeline</h4>

      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={`${seg.segment_number}-${seg.chapter_number}-${seg.scene_type}-${i}`} className="flex items-center justify-between p-2 bg-slate-900 rounded">
            <div>
              <div className="font-medium">Seg {seg.segment_number} • Ch {seg.chapter_number} • {seg.scene_type}</div>
              <div className="text-xs text-slate-400">{seg.chapter_name}</div>
            </div>

            <div className="flex gap-2">
              <button className="px-2 py-1 bg-sky-600 rounded text-sm" onClick={() => handlePreview(seg)}>Preview</button>
              <button className="px-2 py-1 bg-emerald-600 rounded text-sm" onClick={() => handleRender(seg)}>Render</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs">Status: {status}</div>
    </div>
  );
}
