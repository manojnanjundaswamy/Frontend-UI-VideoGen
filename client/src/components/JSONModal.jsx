import React from "react";
import { createPortal } from "react-dom";

export default function JSONModal({ json, onClose }) {
  if (!json) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-8">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-200">Generated JSON Preview</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-950 p-4">
          <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>
    </div>,
    document.body
  );
}
