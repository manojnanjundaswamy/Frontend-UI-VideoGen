import React from "react";
import { useEditorStore } from "../store/useEditorStore";
import { buildFilterConfig } from "../utils/ffmpegConfigBuilder";

export default function FFmpegPreviewPanel() {
  const { selectedRow, overlays, segments } = useEditorStore();

  if (!selectedRow) return <div className="p-3 text-slate-400">Load a row to preview compose request.</div>;

  const meta = selectedRow.filter_config ? JSON.parse(selectedRow.filter_config).meta : {};
  const timing = selectedRow.filter_config ? JSON.parse(selectedRow.filter_config).timing : {};

  // Build once using your existing utility
  const { visual, text, audio, transitions } = splitOverlays(overlays);
        const filter_config = buildFilterConfig(meta, timing, visual, text, audio, transitions);// adapt to your function signature if needed

  return (
    <div className="p-3">
      <h4 className="font-semibold mb-2">FFmpeg Compose Preview</h4>
      <pre className="text-xs bg-slate-900 p-2 rounded max-h-96 overflow-auto text-left">
        {JSON.stringify(body, null, 2)}
      </pre>
      <div className="text-xs text-slate-400 mt-2">This is the request body that will be sent to the Compose endpoint.</div>
    </div>
  );
}
