import React from "react";
import useEditorStore from "../store/useEditorStore";
import generateFullConfig from "../utils/generateFilterConfig";
import { updateRow } from "../hooks/useSheetsAPI";
import JSONModal from "./JSONModal";
import DiffModal from "./DiffModal";
import Button from "./ui/Button";
import { Save, FileJson, GitCompare } from 'lucide-react';

export default function PresetPanel() {
  const [presetName, setPresetName] = React.useState("");
  const [isJsonOpen, setIsJsonOpen] = React.useState(false);
  const [isDiffOpen, setIsDiffOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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
    setLoading(true);

    try {
      await updateRow(selectedChannel, selectedRow.row_number, {
        filter_config: JSON.stringify(finalConfig)
      });
      alert("Saved to Google Sheet!");
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

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

      {/* <div className="p-3 rounded bg-slate-900 border border-white/5 space-y-2">
         <label className="text-xs text-slate-400 block">Quick Preset Name</label>
          <input
            className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1.5 text-sm focus:border-indigo-500 outline-none"
            placeholder="e.g. My Custom Edit"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
      </div> */}

      <div className="space-y-2">
        <Button
          variant="primary"
          className="w-full justify-start"
          icon={Save}
          onClick={handleSaveToSheet}
          loading={loading}
          disabled={!selectedRow}
        >
          Save to Sheet
        </Button>

        <Button
          variant="secondary"
          className="w-full justify-start"
          icon={FileJson}
          onClick={() => setIsJsonOpen(true)}
        >
          View Generated JSON
        </Button>

        <Button
          variant="secondary"
          className="w-full justify-start"
          icon={GitCompare}
          onClick={() => setIsDiffOpen(true)}
        >
          Compare Updates
        </Button>
      </div>

    </div>
  );
}
