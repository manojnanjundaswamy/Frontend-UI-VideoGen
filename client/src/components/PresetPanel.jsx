import React, { useState } from 'react';
import useEditorStore from '../store/useEditorStore';

export default function PresetPanel() {
  const [name, setName] = useState('');
  const exportFilterConfig = useEditorStore(s => s.exportFilterConfig);

  const savePreset = () => {
    const cfg = exportFilterConfig();
    // TODO: call n8n to store preset in Google Sheet
    alert('Preset save requested: ' + name + '\n\n' + JSON.stringify(cfg, null, 2));
  };

  return (
    <div className="bg-slate-800 p-3 rounded mt-4">
      <h4 className="text-sm font-semibold mb-3">Presets</h4>
      <div className="text-sm text-slate-400 mb-2">Save Current as Preset</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Preset Name" className="w-full p-2 rounded bg-slate-700 mb-3" />
      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={savePreset}>Save Preset</button>
      <div className="mt-3">
        <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => { const x = exportFilterConfig(); window.open().document.write(`<pre>${JSON.stringify(x, null, 2)}</pre>`); }}>View Generated JSON</button>
      </div>
    </div>
  );
}
