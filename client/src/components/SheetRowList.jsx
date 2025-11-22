import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function SheetRowList() {
  const rows = useEditorStore(s => s.rows);
  const selectRow = useEditorStore(s => s.selectRow);

  if (!rows || rows.length === 0) return <div className="text-sm text-slate-400">No rows found</div>;

  return (
    <div className="space-y-3 mt-4">
      {rows.map(r => (
        <div key={r.row_number} className="bg-slate-800 p-3 rounded shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-slate-400">{r.status}</div>
            </div>
            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm" onClick={() => selectRow(r)}>Open</button>
          </div>
        </div>
      ))}
    </div>
  );
}
