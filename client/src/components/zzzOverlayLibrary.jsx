import React from "react";
import { overlayPresets } from "../utils/templatePresets";
import { useEditorStore } from "../store/useEditorStore";

export default function OverlayLibrary() {
  const addOverlay = useEditorStore((s) => s.addOverlay);

  return (
    <div className="p-3 bg-gray-800 rounded space-y-2">
      <div className="font-semibold">Overlay Library</div>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(overlayPresets).map(([k, tpl]) => (
          <div key={k} className="p-2 bg-gray-700 rounded flex items-center justify-between">
            <div className="text-sm">{k}</div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-indigo-600 rounded text-sm" onClick={() => addOverlay(tpl)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
