import React from "react";
import { createPortal } from "react-dom";

function diffObjects(oldObj, newObj, path = "") {
  const diffs = [];

  const oldKeys = Object.keys(oldObj || {});
  const newKeys = Object.keys(newObj || {});

  const allKeys = Array.from(new Set([...oldKeys, ...newKeys]));

  allKeys.forEach((key) => {
    const fullPath = path ? `${path}.${key}` : key;
    const oldVal = oldObj ? oldObj[key] : undefined;
    const newVal = newObj ? newObj[key] : undefined;

    // Removed
    if (oldVal !== undefined && newVal === undefined) {
      diffs.push({ type: "removed", key: fullPath, oldVal });
      return;
    }

    // Added
    if (oldVal === undefined && newVal !== undefined) {
      diffs.push({ type: "added", key: fullPath, newVal });
      return;
    }

    // Nested object → recurse
    if (
      typeof oldVal === "object" &&
      typeof newVal === "object" &&
      oldVal !== null &&
      newVal !== null &&
      !Array.isArray(oldVal) &&
      !Array.isArray(newVal)
    ) {
      diffs.push(...diffObjects(oldVal, newVal, fullPath));
      return;
    }

    // Changed
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diffs.push({ type: "changed", key: fullPath, oldVal, newVal });
    }
  });

  return diffs;
}

export default function DiffModal({ before, after, onClose }) {
  if (!before || !after) return null;

  const diffs = diffObjects(before, after);

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-8">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-200">Diff Viewer</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-950 p-4 space-y-2 text-sm">
          {diffs.length === 0 && (
            <div className="text-emerald-400 font-medium p-4 text-center">No differences found. everything looks the same.</div>
          )}

          {diffs.map((d, i) => (
            <div
              key={i}
              className={`p-3 rounded border ${d.type === "added"
                ? "bg-emerald-900/10 border-emerald-500/30"
                : d.type === "removed"
                  ? "bg-rose-900/10 border-rose-500/30"
                  : "bg-amber-900/10 border-amber-500/30"
                }`}
            >
              <div className="font-mono text-xs mb-2 text-slate-400">
                <strong>{d.key}</strong>
              </div>

              {d.type === "added" && (
                <pre className="text-emerald-400 text-xs overflow-auto">{JSON.stringify(d.newVal, null, 2)}</pre>
              )}

              {d.type === "removed" && (
                <pre className="text-rose-400 text-xs overflow-auto">{JSON.stringify(d.oldVal, null, 2)}</pre>
              )}

              {d.type === "changed" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-rose-500 font-bold">Old</div>
                    <pre className="text-rose-300 text-xs overflow-auto bg-black/20 p-2 rounded">
                      {JSON.stringify(d.oldVal, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-emerald-500 font-bold">New</div>
                    <pre className="text-emerald-300 text-xs overflow-auto bg-black/20 p-2 rounded">
                      {JSON.stringify(d.newVal, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
