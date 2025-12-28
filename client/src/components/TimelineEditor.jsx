import React, { useState } from "react";
import useEditorStore from "../store/useEditorStore";
import generateFullConfig from "../utils/generateFilterConfig";
import { requestPreview, requestRender } from "../hooks/useN8NPreview";
import { Play, Film, Layers, Image as ImageIcon, Type, Music, Loader2, Eye } from 'lucide-react';
import Button from "./ui/Button";
import VideoModal from "./ui/VideoModal";

function matchOverlayToSegment(o = {}, seg = {}) {
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
  const segmentPreviews = useEditorStore((s) => s.segmentPreviews || {});

  // Store State for Options
  const videoType = useEditorStore((s) => s.videoType);
  const setVideoType = useEditorStore((s) => s.setVideoType);
  const visualsType = useEditorStore((s) => s.visualsType);
  const setVisualsType = useEditorStore((s) => s.setVisualsType);

  const setPreviewIndex = useEditorStore.getState().setPreviewSegmentIndex;
  const selectOverlay = useEditorStore.getState().selectOverlay;
  const setSegmentPreviewStatus = useEditorStore.getState().setSegmentPreviewStatus;

  const rawState = useEditorStore.getState().getStateRaw();

  // Preview Options State
  const [previewOptions, setPreviewOptions] = useState({
    needAudio: true,
    autoBackground: false
  });

  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);

  // Get full channel object for context
  const channels = useEditorStore(s => s.channels || []);
  const selectedChannelName = useEditorStore(s => s.selectedChannel);
  const currentChannel = channels.find(c => c.channel_name === selectedChannelName) || {};

  const doPreview = async (seg, idx) => {
    // Set Loading
    setSegmentPreviewStatus(idx, { loading: true, error: null });

    try {
      const filterConfig = generateFullConfig(rawState);
      const { needAudio, autoBackground } = previewOptions;

      // Pass channel details as context (bucket, voice_id, etc.)
      const context = {
        channel_name: currentChannel.channel_name || "default",
        bucket_name: currentChannel.bucket_name || "youtube-automation",
        workspace_folder: currentChannel.workspace_folder || "Previews",
        default_voice: currentChannel.default_voice || null,
        voice_reference: currentChannel.voice_reference || null,
        s3_url: currentChannel.s3_url || "http://host.docker.internal:9000"
      };

      const response = await requestPreview(seg, filterConfig, needAudio, autoBackground, context);
      console.log("Preview result:", response);

      // Assume response.id contains filename or response is the object from compose
      // If response is the compose request body output, we might assume the ID is what we constructed.
      // BUT, usually n8n returns the response of the last node.
      // If the last node is MergeImageAndAudio, check its returns.
      // Assuming we can construct the URL if success.

      // Construct URL:
      // http://localhost:9000/youtube-automation/Previews/chX_segY_type.mp4 
      // Need to respect channel/bucket from context if possible, or use standard

      // Actually, looking at ffmpeg_proxy.json, the output id is like:
      // ch{seg.chapter_number}_seg{seg.segment_number}_{seg.scene_type}.mp4
      // And the compose service usually puts it in the workspace folder.

      // Let's rely on constructing it or if response has it.
      // For now, construct based on convention as the n8n logic defines it.

      const filename = `ch${seg.chapter_number ?? 0}_seg${seg.segment_number ?? 0}_${seg.scene_type ?? "seg"}.mp4`;

      // Constructing Localhost URL for MinIO
      // Ensure we use localhost port 9000 instead of host.docker.internal
      const videoUrl = `http://localhost:9000/${context.bucket_name}/${context.channel_name}/${context.workspace_folder}/${filename}`;

      setSegmentPreviewStatus(idx, { loading: false, url: videoUrl });

    } catch (err) {
      console.error(err);
      setSegmentPreviewStatus(idx, { loading: false, error: err.message });
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
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
        <Film className="w-12 h-12 mb-4 opacity-50" />
        <p>No segments loaded</p>
        <p className="text-sm">Import content to get started</p>
      </div>
    );
  }

  // Store State for Options

  return (
    <div className="space-y-4">
      <VideoModal url={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />

      <div className="flex flex-col gap-3 px-1 border-b border-white/5 pb-4">

        {/* Header Title */}
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Timeline & Settings
          </h4>
          <span className="text-xs text-slate-500">{segments.length} segments</span>
        </div>

        {/* Configuration Row */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Video Format Dropdown */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Format</span>
            <select
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none hover:border-slate-600 transition-colors"
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
            >
              <option value="LONG">Landscape (16:9)</option>
              <option value="SHORT">Portrait (9:16)</option>
            </select>
          </div>

          {/* Visuals Source Dropdown */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Visuals</span>
            <select
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none hover:border-slate-600 transition-colors"
              value={visualsType}
              onChange={(e) => {
                const newVal = e.target.value;
                setVisualsType(newVal);
                // Auto-disable AutoBG if none
                if (newVal === 'none') {
                  setPreviewOptions(p => ({ ...p, autoBackground: false }));
                } else {
                  setPreviewOptions(p => ({ ...p, autoBackground: true }));
                }
              }}
            >
              <option value="videos">Videos</option>
              <option value="images">Images</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="w-px h-8 bg-white/10 mx-1"></div>

          {/* Functional Toggles */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] .text-slate-500 font-medium uppercase tracking-wider text-transparent">Preview</span>
            <div className="flex items-center gap-3 mt-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={previewOptions.needAudio}
                  onChange={e => setPreviewOptions(p => ({ ...p, needAudio: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                />
                TTS Audio
              </label>

              {visualsType !== 'none' && (
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors opacity-100 animate-in fade-in duration-300">
                  <input
                    type="checkbox"
                    checked={previewOptions.autoBackground}
                    onChange={e => setPreviewOptions(p => ({ ...p, autoBackground: e.target.checked }))}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                  />
                  Auto BG (Pexels)
                </label>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="space-y-2">
        {segments.map((seg, idx) => {
          const isActive = idx === previewIndex;

          // overlays that apply to this segment
          const matching = overlays.filter((o) => matchOverlayToSegment(o, seg));
          const matchingSorted = [...matching].sort((a, b) => (a.layer || 0) - (b.layer || 0));

          return (
            <div
              key={idx}
              className={`
                group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer
                ${isActive
                  ? "bg-indigo-900/10 border-indigo-500/30 ring-1 ring-indigo-500/20"
                  : "bg-slate-900/40 border-white/5 hover:border-slate-700 hover:bg-slate-900/60"
                }
              `}
              onClick={() => setPreviewIndex(idx)}
            >
              {/* SEGMENT MARKER */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors
                 ${isActive ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-slate-700'}
              `} />

              {/* SEGMENT HEADER */}
              <div className="flex justify-between items-start pl-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">#{seg.segment_number}</span>
                    <span className={`text-sm font-medium ${isActive ? 'text-indigo-200' : 'text-slate-300'}`}>
                      {seg.scene_type}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                      Ch {seg.chapter_number}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2 max-w-[280px] leading-relaxed">
                    {seg.chapter_name || seg.narration_text}
                  </div>
                </div>

                <div className="flex gap-1 items-center">
                  {/* PREVIEW STATUS / ACTIONS */}
                  {segmentPreviews[idx]?.loading ? (
                    <div className="p-2">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    </div>
                  ) : segmentPreviews[idx]?.url ? (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                        title="Watch Generated Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Playing preview for segment:", segmentPreviews);
                          console.log(segmentPreviews[idx].url);
                          setPlayingVideoUrl(segmentPreviews[idx].url);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 fill-current" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-indigo-300"
                        title="Regenerate Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          doPreview(seg, idx);
                        }}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        title="Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          doPreview(seg, idx);
                        }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* OVERLAYS MINI-LIST */}
              {matchingSorted.length > 0 && (
                <div className="mt-3 pl-3 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {matchingSorted.map((o) => {
                    const visible = o.visible === undefined ? true : !!o.visible;
                    return (
                      <div
                        key={o.id}
                        className={`
                           flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] border transition-colors
                           ${visible ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-slate-900 text-slate-600 border-transparent decoration-slice'}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOverlay(o.id);
                        }}
                      >
                        {o.type === "image" && <ImageIcon className="w-3 h-3" />}
                        {o.type === "video" && <Film className="w-3 h-3" />}
                        {o.type === "text" && <Type className="w-3 h-3" />}
                        {o.type === "music" && <Music className="w-3 h-3" />}
                        <span className="max-w-[80px] truncate">{o.id}</span>
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
