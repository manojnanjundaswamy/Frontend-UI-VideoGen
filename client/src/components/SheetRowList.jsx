import React from 'react';
import useEditorStore from '../store/useEditorStore';
import Button from './ui/Button';
import { FileText, PlayCircle } from 'lucide-react';

export default function SheetRowList() {
  const rows = useEditorStore((s) => s.rows || []);
  const selectedRow = useEditorStore((s) => s.selectedRow);
  const openRow = useEditorStore.getState().openRow;

  if (!rows || rows.length === 0) {
    return (
      <div className="text-sm text-slate-500 mt-4 p-4 border border-dashed border-slate-800 rounded-lg text-center bg-slate-900/50">
        No projects found in this channel
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-6">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <FileText className="w-3.5 h-3.5" />
        Projects
      </h4>

      <div className="space-y-2">
        {rows.map((r) => {
          const isSelected = selectedRow?.row_number === r.row_number;
          return (
            <div
              key={r.row_number}
              onClick={() => openRow(r)}
              className={`
                 group p-3 rounded-lg flex items-center justify-between cursor-pointer border transition-all duration-200
                 ${isSelected
                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-900/20'
                  : 'bg-slate-900 border-white/5 hover:border-slate-700 hover:bg-slate-800'
                }
              `}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className={`font-medium text-sm truncate ${isSelected ? 'text-indigo-200' : 'text-slate-300'}`}>
                  {r.title || r.hook || `Row ${r.row_number}`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {r.status || 'pending'}
                </div>
              </div>

              <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-400 hover:text-indigo-300">
                  <PlayCircle className="w-5 h-5 fill-current/20" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
