import React from "react";
import useEditorStore from "../store/useEditorStore";
import generateFilterConfig from "../utils/generateFilterConfig";

export default function PresetPanel() {
  const [presetName, setPresetName] = React.useState("");

  const handleViewJson = () => {
    const state = useEditorStore.getState();
    const json = generateFilterConfig(state);
    alert(JSON.stringify(json, null, 2));
  };

  const handleSavePreset = () => {
    // You can implement later
    alert("Preset saved (not implemented yet)");
  };

  return (
    <div className="bg-slate-800 rounded p-3 space-y-2">
      <h3 className="text-lg font-semibold">Presets</h3>

      <input
        className="w-full bg-slate-700 rounded px-2 py-1"
        placeholder="Preset Name"
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
      />

      <button
        className="px-3 py-1 text-sm bg-green-600 rounded w-full"
        onClick={handleSavePreset}
      >
        Save Preset
      </button>

      <button
        className="px-3 py-1 text-sm bg-slate-600 rounded w-full"
        onClick={handleViewJson}
      >
        View Generated JSON
      </button>
    </div>
  );
}
