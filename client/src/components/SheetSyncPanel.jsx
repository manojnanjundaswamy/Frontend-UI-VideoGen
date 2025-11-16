import React, { useEffect, useState } from 'react';
import { getAllRows, getRow, updateRow } from '../hooks/useSheetsAPI';
import { useEditorStore } from '../store/useEditorStore';
import { buildFilterConfig } from '../utils/ffmpegConfigBuilder';
import { nanoid } from 'nanoid';

export default function SheetSyncPanel() {
  const { rows, setRows, setSelectedRow, setSegments, setOverlays, selectedRow, reset } = useEditorStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllRows();
      // Expect array of rows
      setRows(data || []);
    } catch (e) {
      console.error('sheet fetch', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

async function openRow(row) {
  setSelectedRow(row);
  try {
    const segments = row.prompt_json ? JSON.parse(row.prompt_json) : [];
    setSegments(segments);

    const config = row.filter_config ? JSON.parse(row.filter_config) : null;
    if (config) {
      const overlays = [];

      // helper to convert old scale string to scale_factor (based on resolution)
      const computeScaleFactor = (scaleStr, metaRes) => {
        // if scaleStr is of form "W:H" and metaRes available like "1920:1080"
        try {
          if (!scaleStr) return 1;
          if (typeof scaleStr === 'string' && scaleStr.includes(':')) {
            const [wStr] = scaleStr.split(':');
            const w = parseFloat(wStr);
            const baseW = metaRes ? parseFloat((metaRes || '1920:1080').split(':')[0]) : 1920;
            if (w > 0 && baseW > 0) return (w / baseW);
          }
          // fallback: if it's "iw*0.5:ih*0.5"
          if (scaleStr.includes('iw*')) {
            const m = scaleStr.match(/iw\*([0-9.]+)/);
            if (m) return parseFloat(m[1]);
          }
        } catch (e) {
          // ignore
        }
        return 1;
      };

      const metaRes = config.meta ? config.meta.resolution : undefined;

      if (config.visual_overlays) {
        Object.entries(config.visual_overlays).forEach(([k, v]) => {
          overlays.push({
            ...v,
            type: v.type || 'image',
            id: v.id || nanoid(),
            scale_factor: v.scale_factor ?? computeScaleFactor(v.scale, metaRes)
          });
        });
      }
      if (config.text_overlays) {
        Object.entries(config.text_overlays).forEach(([k, v]) => {
          overlays.push({
            ...v,
            type: 'text',
            id: v.id || nanoid(),
            scale_factor: v.scale_factor ?? computeScaleFactor(v.scale, metaRes)
          });
        });
      }
      setOverlays(overlays);
    } else {
      setOverlays([]);
    }
  } catch (e) {
    console.error('open row parse error', e);
  }
}

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Sheet Projects</h3>
        <button className="text-sm bg-sky-600 px-2 py-1 rounded" onClick={load}>{loading ? '...' : 'Refresh'}</button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {rows && rows.length ? rows.map(r => (
          <div key={r.row_number || r.row_id || r.title} className={`p-2 rounded ${selectedRow && selectedRow === r ? 'bg-slate-700' : 'bg-slate-800'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Row #{r.row_number} — {r.title || r.name}</div>
                <div className="text-xs text-slate-400">{r.status || 'No status'}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm px-2 py-1 bg-indigo-600 rounded" onClick={() => openRow(r)}>Open</button>
              </div>
            </div>
          </div>
        )) : <div className="text-sm text-slate-400">No rows found</div>}
      </div>
    </div>
  );
}
