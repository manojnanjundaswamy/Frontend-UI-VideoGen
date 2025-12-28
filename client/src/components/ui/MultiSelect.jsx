import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from 'lucide-react';

export default function MultiSelect({ label, options = [], value, onChange }) {
  const safeValue = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggleValue = (item) => {
    if (safeValue.includes(item)) {
      onChange(safeValue.filter((v) => v !== item));
    } else {
      onChange([...safeValue, item]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange([]);
    setOpen(false);
  }

  return (
    <div className="mb-3 relative" ref={ref}>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>

      <div
        onClick={() => setOpen(!open)}
        className={`
           w-full min-h-[38px] bg-slate-900 border rounded px-2 py-1.5 cursor-pointer flex flex-wrap gap-1 items-center
           transition-all duration-200
           ${open ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/10 hover:border-slate-600'}
        `}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 ">
          {safeValue.length === 0 ? (
            <span className="text-slate-500 text-sm px-1">All (No filters)</span>
          ) : (
            safeValue.map((v) => (
              <span key={v} className="pl-2 pr-1 py-0.5 text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded flex items-center gap-1">
                {v}
                <X
                  className="w-3 h-3 hover:text-white cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); toggleValue(v); }}
                />
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 pl-1">
          {safeValue.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-2xl shadow-black p-1 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 italic">No options available</div>
          ) : (
            options.map((opt) => (
              <label
                key={opt}
                className={`
                   flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md text-sm transition-colors
                   ${safeValue.includes(opt) ? 'bg-indigo-600/10 text-indigo-200' : 'hover:bg-slate-800 text-slate-300'}
                `}
              >
                <div className={`
                    w-4 h-4 rounded border flex items-center justify-center transition-all
                    ${safeValue.includes(opt) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 bg-transparent'}
                `}>
                  {safeValue.includes(opt) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>

                {/* Hidden real checkbox for accessibility */}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={safeValue.includes(opt)}
                  onChange={() => toggleValue(opt)}
                />

                <span className="flex-1 truncate">{opt}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
