import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { getChannels, getRowsForChannel, updateRow } from '../hooks/useSheetsAPI';

export default function SheetSyncPanel() {
  const {
    channels, setChannels,
    selectedChannel, setSelectedChannel,
    rows, setRows,
    selectedRow, setSelectedRow,
    setMeta, setOverlays, setTextOverlays, setAudioOverlays, setTransitions
  } = useEditorStore();

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    // load channels once
    (async () => {
      try {
        setLoading(true);
        const ch = await getChannels();
        setChannels(ch || []);
        setLoading(false);
      } catch (e) {
        setErr(e.message);
        setLoading(false);
      }
    })();
  }, [setChannels]);

  React.useEffect(() => {
    // when selectedChannel changes, load rows
    if (!selectedChannel) return;
    (async () => {
      setLoading(true);
      try {
        const rows = await getRowsForChannel(selectedChannel.sheet_name || selectedChannel.sheetName || selectedChannel.sheet_name);
        setRows(rows || []);
        setLoading(false);
      } catch (e) {
        setErr(e.message);
        setLoading(false);
      }
    })();
  }, [selectedChannel, setRows]);

  const handleChannelSelect = (ev) => {
    const idx = ev.target.value;
    const ch = channels[idx];
    if (ch) setSelectedChannel(ch);
  };

  const handleRowOpen = (row) => {
    // set selected row in store; store.setSelectedRow will parse filter_config
    setSelectedRow(row);
  };

  const handleSaveRow = async () => {
    if (!selectedChannel || !selectedRow) return alert('Pick channel and row first');
    try {
      setLoading(true);
      // gather filter_config from store (meta & overlays etc)
      // here we directly read store; alternatively call a store helper
      // We'll reconstruct filter_config from selected row in store
      const s = useEditorStore.getState();
      const filter_config = {
        meta: s.meta,
        timing: s.timing,
        visual_overlays: s.overlays,
        text_overlays: s.textOverlays,
        audio_overlays: s.audioOverlays,
        transitions_overlays: s.transitions
      };
      const payload = { filter_config: JSON.stringify(filter_config) };
      const sheetName = selectedChannel.sheet_name;
      const rowIndex = selectedRow.row_number ?? selectedRow.rowIndex ?? selectedRow.index; // depends on your server response
      const res = await updateRow(sheetName, rowIndex, payload);
      // update local rows with new filter_config
      const updatedRows = rows.map(r => (r === selectedRow ? { ...selectedRow, filter_config: JSON.stringify(filter_config) } : r));
      setRows(updatedRows);
      setLoading(false);
      alert('Saved to sheet');
    } catch (e) {
      setLoading(false);
      alert('Save failed: ' + e.message);
    }
  };

  return (
    <div className="p-3">
      <h4 className="font-semibold">Sheet Projects</h4>
      {err && <div className="text-red-400">{err}</div>}
      <div className="mt-2">
        <label className="text-xs text-slate-300">Select Channel</label>
        <select className="w-full my-2 p-2 bg-slate-800 rounded" onChange={handleChannelSelect}>
          <option value="">-- choose channel --</option>
          {channels.map((c, idx) => (
            <option key={c.channel_name + idx} value={idx}>
              {c.channel_name} — {c.sheet_name}
            </option>
          ))}
        </select>
        <div className="space-y-2 mt-3">
          {loading && <div className="text-sm text-slate-400">Loading...</div>}
          {!loading && (!rows || rows.length === 0) && <div className="text-sm text-slate-400">No rows found</div>}
          {!loading && rows && rows.map((r, i) => (
            <div key={r._rowIndex ?? i} className="p-2 bg-slate-900 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{r.title || r.name || `Row #${r._rowIndex ?? i}`}</div>
                <div className="text-xs text-slate-400">{r.status || ''}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-indigo-600 rounded text-sm" onClick={() => handleRowOpen(r)}>Open</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button className="px-3 py-2 bg-emerald-600 rounded" onClick={handleSaveRow}>Save filter_config to Sheet</button>
        </div>
      </div>
    </div>
  );
}
