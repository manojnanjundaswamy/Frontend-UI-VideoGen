// src/components/PresetPanel.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function PresetPanel() {
  const buildFilterConfig = useEditorStore((s) => s.buildFilterConfig);
  const saveFilterConfigToSheet = useEditorStore((s) => s.saveFilterConfigToSheet);
  const [presetName, setPresetName] = React.useState('');

  const handleSavePreset = async () => {
    const fc = buildFilterConfig();
    // stub save preset — in your architecture this should POST to Presets sheet or API
    console.log('Save preset', presetName, fc);
    alert('Preset saved locally (stub). Replace with backend API.');
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm text-slate-300 mb-2">Presets</h4>
      <div className="text-sm text-slate-400 mb-2">No presets</div>

      <div className="mb-2 text-sm text-slate-300">Save Current as Preset</div>
      <input className="w-full p-2 rounded bg-slate-700 mb-2" placeholder="Preset Name" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-green-600 rounded" onClick={handleSavePreset}>Save Preset</button>
        <button className="px-3 py-2 bg-slate-600 rounded" onClick={() => {
          const fc = buildFilterConfig();
          // show JSON in a new window for quick debug
          const w = window.open();
          w.document.body.innerHTML = `<pre style="white-space:pre-wrap">${JSON.stringify(fc, null, 2)}</pre>`;
        }}>View Generated JSON</button>
      </div>
    </div>
  );
}
