import React from "react";
import useEditorStore from "../store/useEditorStore";
import generateFullConfig from "../utils/generateFilterConfig";
import { updateRow } from "../hooks/useSheetsAPI";
import JSONModal from "./JSONModal";
import DiffModal from "./DiffModal";

export default function PresetPanel() {
  const [presetName, setPresetName] = React.useState("");
  const [isJsonOpen, setIsJsonOpen] = React.useState(false);
  const [isDiffOpen, setIsDiffOpen] = React.useState(false);

  const api = useEditorStore.getState();
  const raw = api.getStateRaw();
  const selectedRow = raw.selectedRow;
  const selectedChannel = raw.selectedChannel;

  const handleSaveToSheet = async () => {
    if (!selectedChannel || !selectedRow) {
      alert("Select a channel and row first.");
      return;
    }

    const finalConfig = generateFullConfig(useEditorStore.getState().getStateRaw());

    try {
      await updateRow(selectedChannel, selectedRow.row_number, {
        filter_config: JSON.stringify(finalConfig)
      });
      alert("Saved to Google Sheet!");
    } catch (e) {
      alert("Failed to save: " + e.message);
    }
  };

  return (
    <div className="bg-slate-800 rounded p-3 space-y-2">
      
      {isJsonOpen && (
        <JSONModal
          json={generateFullConfig(useEditorStore.getState().getStateRaw())}
          onClose={() => setIsJsonOpen(false)}
        />
      )}
      {isDiffOpen && (
        <DiffModal
          before={raw.selectedRow ? JSON.parse(raw.selectedRow.filter_config || "{}") : {}}
          after={generateFullConfig(useEditorStore.getState().getStateRaw())}
          onClose={() => setIsDiffOpen(false)}
        />
      )}

      <h3 className="text-lg font-semibold">Presets / Save</h3>

      <input
        className="w-full bg-slate-700 rounded px-2 py-1"
        placeholder="Preset Name"
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
      />

      <button
        className="px-3 py-1 text-sm bg-green-600 rounded w-full"
        onClick={handleSaveToSheet}
      >
        Save to Google Sheet
      </button>

      <button
        className="px-3 py-1 text-sm bg-slate-600 rounded w-full"
        onClick={() => setIsJsonOpen(true)}
      >
        View Generated JSON
      </button>
      <button
        className="px-3 py-1 text-sm bg-purple-600 rounded w-full"
        onClick={() => setIsDiffOpen(true)}
      >
        Compare with Saved Config
      </button>

    </div>
  );
}
