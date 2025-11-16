// src/components/OverlayToolbar.jsx
import React from "react";
import { useEditorStore } from "../store/useEditorStore";

export default function OverlayToolbar() {
  const addOverlay = useEditorStore((s) => s.addOverlay);

  const makeOverlay = (type) => {
    const id = `${type}_${Date.now()}`;

    if (type === "text") {
      return {
        id,
        type: "text",
        text: "New Text",
        font: "/app/fonts/ComicNeue-BoldItalic.ttf",
        fontcolor: "white",
        fontsize: 48,
        opacity: 100,
        x_offset_percent: 0,
        y_offset_percent: 0,
        layer: 10,
        scale_factor: 1,
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
        scope: "all",
      };
    }

    // image / video
    return {
      id,
      type,
      url: "",
      scale: "",
      scale_factor: 1,
      opacity: 100,
      x_offset_percent: 0,
      y_offset_percent: 0,
      layer: 10,
      colorkey: "",
    };
  };

  const handleAdd = (type) => {
    const o = makeOverlay(type);
    addOverlay(o);
  };

  return (
    <div className="flex gap-2 p-2 bg-slate-800 rounded mb-2">
      <button
        className="px-2 py-1 bg-sky-600 rounded text-sm"
        onClick={() => handleAdd("image")}
      >
        Add Image
      </button>

      <button
        className="px-2 py-1 bg-green-600 rounded text-sm"
        onClick={() => handleAdd("video")}
      >
        Add Video
      </button>

      <button
        className="px-2 py-1 bg-amber-600 rounded text-sm"
        onClick={() => handleAdd("text")}
      >
        Add Text
      </button>

      <button
        className="px-2 py-1 bg-purple-600 rounded text-sm"
        onClick={() => handleAdd("audio")}
      >
        Add Music
      </button>

      <button
        className="px-2 py-1 bg-pink-600 rounded text-sm"
        onClick={() => handleAdd("chapter_anim")}
      >
        Add Chapter Anim
      </button>
    </div>
  );
}
