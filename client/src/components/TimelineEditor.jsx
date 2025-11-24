// src/components/TimelineEditor.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";
import generateFullConfig from "../utils/generateFilterConfig";
import { requestPreview, requestRender } from "../hooks/useN8NPreview";

/**
 * NEW Timeline Editor
 * - lets user pick preview segment (Canvas updates live)
 * - shows overlays that affect each segment
 * - click overlay → open inspector
 * - toggle overlay visibility
 */

function matchOverlayToSegment(o = {}, seg = {}) {
  if (!o) return false;
  const noFilters =
    (!o.segment_targets || o.segment_targets.length === 0) &&
    (!o.scene_types || o.scene_types.length === 0) &&
    (!o.chapter_numbers || o.chapter_numbers.length === 0);

  if (noFilters) return true;
  if (o.segment_targets?.includes(seg.segment_number)) return true;
  if (o.scene_types?.includes(seg.scene_type)) return true;
  if (o.chapter_numbers?.includes(seg.chapter_number)) return true;

  return false;
}

export default function TimelineEditor() {
  const segments = useEditorStore((s) => s.segments || []);
  const overlays = useEditorStore((s) => s.overlays || []);
  const previewIndex = useEditorStore((s) => s.previewSegmentIndex || 0);

  const setPreviewIndex = useEditorStore.getState().setPreviewSegmentIndex;
  const selectOverlay = useEditorStore.getState().selectOverlay;
  const updateOverlay = useEditorStore.getState().updateOverlay;

  const rawState = useEditorStore.getState().getStateRaw();

  const doPreview = async (seg) => {
    try {
      const filterConfig = generateFullConfig(rawState);
      const response = await requestPreview(seg, filterConfig, true);
      console.log("Preview result:", response);
      alert("Preview started. Check n8n workflow.");
    } catch (err) {
      alert("Preview failed: " + err.message);
    }
  };

  const doRender = async (seg) => {
    try {
      const filterConfig = generateFullConfig(rawState);
      const response = await requestRender(seg, filterConfig);
      console.log("Render result:", response);
      alert("Render started!");
    } catch (err) {
      alert("Render failed: " + err.message);
    }
  };

  if (!segments.length) {
    return <div className="text-sm text-slate-400">Load a row to see segments.</div>;
  }

  return (
    <div>
      <h4 className="font-semibold mb-3">Timeline</h4>

      <div className="space-y-4">
        {segments.map((seg, idx) => {
          const isActive = idx === previewIndex;

          // overlays that apply to this segment
          const matching = overlays.filter((o) => matchOverlayToSegment(o, seg));
          const matchingSorted = [...matching].sort((a, b) => (a.layer || 0) - (b.layer || 0));

          return (
            <div
              key={idx}
              className={`p-3 rounded border ${
                isActive ? "border-sky-500 bg-slate-800" : "border-slate-700 bg-slate-900"
              }`}
            >
              {/* SEGMENT HEADER */}
              <div className="flex justify-between items-center cursor-pointer"
                   onClick={() => setPreviewIndex(idx)}>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      doPreview(seg);
                    }}
                  >
                    Preview
                  </button>

                  <button
                    className="px-3 py-1 bg-emerald-600 rounded text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      doRender(seg);
                    }}
                  >
                    Render
                  </button>
                </div>
              </div>

              {/* OVERLAYS LIST */}
              {matchingSorted.length > 0 && (
                <div className="mt-3 ml-2 space-y-1">
                  <div className="text-xs text-slate-400 mb-1">Overlays applied:</div>

                  {matchingSorted.map((o) => {
                    const visible = o.visible === undefined ? true : !!o.visible;
                    return (
                      <div
                        key={o.id}
                        className="flex items-center justify-between bg-slate-800 rounded px-2 py-1"
                      >
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => selectOverlay(o.id)}
                        >
                          <span className="text-lg">
                            {o.type === "image" && "🖼️"}
                            {o.type === "video" && "🎞️"}
                            {o.type === "text" && "✏️"}
                            {o.type === "music" && "🎵"}
                          </span>

                          <span className="text-sm">
                            {o.id} <span className="text-slate-500">(layer {o.layer})</span>
                          </span>
                        </div>

                        <button
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                          onClick={() => updateOverlay(o.id, { visible: !visible })}
                        >
                          {visible ? "👁" : "🙈"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
