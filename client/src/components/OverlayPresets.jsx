import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export default function OverlayPresets() {
  const presets = useEditorStore(s => s.overlayPresets);
  const addPreset = useEditorStore(s => s.addPreset);
  const applyPreset = useEditorStore(s => s.applyPreset);
  const [name, setName] = useState("");

  return (
    <div className="p-2">
      <div className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="preset name" />
        <button onClick={() => {
          // snapshot currently selected overlay into preset
          const { overlays, selectedOverlayId } = useEditorStore.getState();
          const sel = overlays[selectedOverlayId];
          if (!sel) return alert("Select overlay first");
          addPreset(name || `preset_${Date.now()}`, { ...sel, id: undefined });
          setName("");
        }}>Save Preset</button>
      </div>

      <div className="mt-2 space-y-1">
        {Object.keys(presets).map(k => (
          <div key={k} className="flex items-center justify-between">
            <div>{k}</div>
            <div>
              <button onClick={() => applyPreset(k)}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
