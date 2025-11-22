// src/components/SheetRowList.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function SheetRowList() {
  const rows = useEditorStore((s) => s.rows || []);
  const openRow = useEditorStore((s) => s.openRow);

  if (!rows || rows.length === 0) {
    return <div className="text-sm text-slate-400 mt-3">No rows found</div>;
  }

  return (
    <div className="space-y-3 mt-3">
      <h4 className="text-sm text-slate-300 mb-2">Sheet Projects</h4>
      {rows.map((r) => (
        <div key={r.row_number} className="bg-slate-800 p-3 rounded flex items-center justify-between">
          <div>
            <div className="font-medium">{r.title || r.hook || `Row ${r.row_number}`}</div>
            <div className="text-xs text-slate-400">{r.status || 'pending'}</div>
          </div>
          <button
            className="px-3 py-1 bg-violet-600 rounded text-sm"
            onClick={() => openRow(r)}
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
