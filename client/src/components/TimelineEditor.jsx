import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { requestPreview, requestRender } from '../hooks/useN8NPreview';
import { buildFilterConfig } from '../utils/ffmpegConfigBuilder';

export default function TimelineEditor() {
  const { segments = [], overlays = {}, selectedRow, needAudio, setNeedAudio } = useEditorStore();
  const [status, setStatus] = React.useState(null);

  if (!segments || !segments.length) {
    return <div className="text-sm text-slate-400">Load a row to see segments.</div>;
  }

  const handlePreview = async (seg) => {
    setStatus('previewing');
    try {
      const s = useEditorStore.getState();
      const filter_config = buildFilterConfig(s.meta, s.timing, s.overlays, s.textOverlays, s.audioOverlays, s.transitions);
      const res = await requestPreview(seg, filter_config, needAudio);
      setStatus('preview_ok');
      if (res.preview_url || (Array.isArray(res.response) && res.response[0]?.file_url)) {
        const url = res.preview_url || res.response[0].file_url;
        window.dispatchEvent(new CustomEvent('ffmpeg-preview', { detail: { url } }));
      } else {
        console.warn('Preview returned but no preview URL', res);
      }
    } catch (e) {
      console.error(e);
      setStatus('preview_error');
    }
  };

  const handleRender = async (seg) => {
    setStatus('rendering');
    try {
      const s = useEditorStore.getState();
      const filter_config = buildFilterConfig(s.meta, s.timing, s.overlays, s.textOverlays, s.audioOverlays, s.transitions);
      const res = await requestRender(seg, filter_config);
      setStatus(`render_ok`);
      // you can dispatch a notification or handle returned url similarly
    } catch (e) {
      console.error(e);
      setStatus('render_error');
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <input
          id="need-audio"
          type="checkbox"
          checked={needAudio}
          onChange={(e) => setNeedAudio(e.target.checked)}
        />
        <label htmlFor="need-audio" className="text-sm text-slate-200">Include Audio in Preview</label>
      </div>

      <h4 className="font-semibold mb-2">Timeline</h4>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div
            key={`${seg.segment_number}-${seg.chapter_number}-${seg.scene_type}-${i}`}
            className="flex items-center justify-between p-2 bg-slate-900 rounded"
          >
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

      <div className="mt-4 text-xs text-slate-300">Status: {status}</div>
    </div>
  );
}
