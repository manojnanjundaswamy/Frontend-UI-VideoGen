import React from "react";
import { useEditorStore } from "../store/useEditorStore";

/**
 * Simple toolbar. For improved UX you can replace prompt() with a modal.
 */
export default function OverlayToolbar() {
  const addOverlay = useEditorStore((s) => s.addOverlay);
  const applyPreset = useEditorStore((s) => s.applyPreset);

  function defaultOverlay(type) {
    const id = `${type}_${Date.now()}`;
    if (type === "text") {
      return {
        id,
        type: "text",
        text: "New Text",
        font: "/app/fonts/ComicNeue-BoldItalic.ttf",
        fontcolor: "yellow",
        fontsize: 72,
        opacity: 100,
        x_offset_percent: 0,
        y_offset_percent: 0,
        layer: 10,
        scale_factor: 1
      };
    }

    if (type === "audio") {
      return {
        id,
        type: "audio",
        url: "",
        volume: 0.2,
        fade_in: 1,
        fade_out: 1,
        scope: "all", // all | intro | chapter | segment
      };
    }

    // image / video
    return {
      id,
      type,
      url: "",
      scale: "",          // ffmpeg scale string OR blank
      scale_factor: 1,    // UI numeric factor (optional)
      opacity: 100,
      x_offset_percent: 0,
      y_offset_percent: 0,
      layer: 10,
      colorkey: ""
    };
  }

  return (
    <div className="flex gap-2 p-2">
      <button className="px-3 py-1 bg-sky-600 rounded text-sm" onClick={() => addOverlay(defaultOverlay("image"))}>Add Image</button>
      <button className="px-3 py-1 bg-green-600 rounded text-sm" onClick={() => addOverlay(defaultOverlay("video"))}>Add Video</button>
      <button className="px-3 py-1 bg-amber-600 rounded text-sm" onClick={() => addOverlay(defaultOverlay("text"))}>Add Text</button>
      <button className="px-3 py-1 bg-purple-600 rounded text-sm" onClick={() => addOverlay(defaultOverlay("audio"))}>Add Music</button>
      <button className="px-3 py-1 bg-pink-600 rounded text-sm" onClick={() => addOverlay({
        id: `chapter_anim_${Date.now()}`, type: "chapter_anim", enable: true, mode: "intro", duration: 3, fontsize: 72, font: "/app/fonts/ComicNeue-BoldItalic.ttf", fontcolor: "white", x: 0, y: 0
      })}>Add Chapter Anim</button>

      {/* quick preset (demo) */}
      <button className="px-2 py-1 bg-gray-700 rounded text-sm" onClick={() => applyPreset("logo-small")}>Apply preset: logo-small</button>
    </div>
  );
}
