// src/components/ChapterTransitionEditor.jsx
import React from "react";
import useEditorStore from "../store/useEditorStore";

export default function ChapterTransitionEditor() {
  const chapter = useEditorStore((s) => s.chapterAnimation);
  const transitions = useEditorStore((s) => s.transitions);

  const update = useEditorStore.getState().updateChapterAnimation;
  const updateOffset = useEditorStore.getState().updateChapterAnimationOffset;
  const updateTransition = useEditorStore.getState().updateTransition;

  return (
    <div className="space-y-6">

      {/* ---------------------- */}
      {/* CHAPTER ANIMATION */}
      {/* ---------------------- */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Chapter Animation</h3>

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={chapter.enable}
            onChange={(e) => update({ enable: e.target.checked })}
          />
          <span className="text-sm">Enable chapter animation</span>
        </label>

        <div className="mb-3">
          <label className="block text-sm mb-1">Mode</label>
          <select
            value={chapter.mode}
            onChange={(e) => update({ mode: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
          >
            <option value="intro">intro</option>
            <option value="full">full</option>
            <option value="intro_and_full">intro_and_full</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Duration (sec)</label>
            <input
              type="number"
              value={chapter.duration}
              onChange={(e) => update({ duration: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Persistent Opacity %</label>
            <input
              type="number"
              value={chapter.persistent_opacity}
              onChange={(e) =>
                update({ persistent_opacity: Number(e.target.value) })
              }
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* OFFSET */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm mb-1">Offset X</label>
            <input
              type="number"
              value={chapter.offset.x}
              onChange={(e) => updateOffset("x", Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Offset Y</label>
            <input
              type="number"
              value={chapter.offset.y}
              onChange={(e) => updateOffset("y", Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* TEXT SETTINGS */}
        <div className="mt-3">
          <label className="block text-sm mb-1">Font</label>
          <input
            type="text"
            value={chapter.font}
            onChange={(e) => update({ font: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm mb-1">Font Size</label>
            <input
              type="number"
              value={chapter.fontsize}
              onChange={(e) => update({ fontsize: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Font Color</label>
            <input
              type="text"
              value={chapter.fontcolor}
              onChange={(e) => update({ fontcolor: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* TEXT BOX */}
        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={chapter.box}
            onChange={(e) => update({ box: e.target.checked })}
          />
          <span className="text-sm">Enable Text Box</span>
        </label>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm mb-1">Box Color</label>
            <input
              type="text"
              value={chapter.boxcolor}
              onChange={(e) => update({ boxcolor: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Border Width</label>
            <input
              type="number"
              value={chapter.boxborderw}
              onChange={(e) => update({ boxborderw: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* ---------------------- */}
      {/* TRANSITIONS */}
      {/* ---------------------- */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Scene Transitions</h3>

        {Object.entries(transitions).map(([key, t]) => (
          <div key={key} className="p-3 bg-slate-900 rounded border border-slate-700 mb-3">
            <div className="text-sm font-medium mb-2">
              {key.replace(/_/g, " ")}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Visual</label>
                <input
                  type="text"
                  value={t.visual || ""}
                  onChange={(e) =>
                    updateTransition(key, { visual: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Duration</label>
                <input
                  type="number"
                  value={t.duration || 1}
                  onChange={(e) =>
                    updateTransition(key, { duration: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
