import React from "react";

export default function JSONModal({ json, onClose }) {
  if (!json) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 w-[80%] h-[80%] rounded-lg shadow-xl p-4 relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded text-sm"
        >
          Close
        </button>

        <h2 className="text-lg font-semibold mb-3">Generated JSON Preview</h2>

        <pre className="bg-slate-900 p-4 rounded h-full overflow-auto text-left text-sm">
          {JSON.stringify(json, null, 2)}
        </pre>
      </div>
    </div>
  );
}
