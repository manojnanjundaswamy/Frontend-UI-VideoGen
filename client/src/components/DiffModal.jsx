import React from "react";

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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 w-[85%] h-[85%] rounded-lg shadow-xl p-4 relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded text-sm"
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-3">Diff Viewer</h2>

        <div className="h-full overflow-auto space-y-2 p-2 text-sm">
          {diffs.length === 0 && (
            <div className="text-green-400 font-medium">No differences found.</div>
          )}

          {diffs.map((d, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                d.type === "added"
                  ? "bg-green-900/40 border border-green-600"
                  : d.type === "removed"
                  ? "bg-red-900/40 border border-red-600"
                  : "bg-yellow-900/40 border border-yellow-600"
              }`}
            >
              <div className="font-mono">
                <strong>{d.key}</strong>
              </div>

              {d.type === "added" && (
                <pre className="text-green-300">{JSON.stringify(d.newVal, null, 2)}</pre>
              )}

              {d.type === "removed" && (
                <pre className="text-red-300">{JSON.stringify(d.oldVal, null, 2)}</pre>
              )}

              {d.type === "changed" && (
                <div className="flex gap-4">
                  <pre className="w-1/2 text-red-300">
                    OLD: {JSON.stringify(d.oldVal, null, 2)}
                  </pre>
                  <pre className="w-1/2 text-green-300">
                    NEW: {JSON.stringify(d.newVal, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
