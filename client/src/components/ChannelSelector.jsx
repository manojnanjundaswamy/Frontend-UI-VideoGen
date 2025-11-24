import React, { useEffect } from "react";
import useEditorStore from "../store/useEditorStore";

export default function ChannelSelector() {
  const channels = useEditorStore((s) => s.channels);
  const selectedChannel = useEditorStore((s) => s.selectedChannel);
  const setSelectedChannel = useEditorStore.getState().setState;

  const loadChannels = useEditorStore.getState().loadChannels;
  const loadRowsForChannel = useEditorStore.getState().loadRowsForChannel;

  useEffect(() => {
    loadChannels();
  }, []);

  const handleChange = (e) => {
    const channel = e.target.value;
    setSelectedChannel({ selectedChannel: channel });

    if (channel) {
      loadRowsForChannel(channel);
    }
  };

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">Select Channel</label>
      <select
        className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white"
        value={selectedChannel ?? ""}
        onChange={handleChange}
      >
        <option value="">-- Select channel --</option>

        {channels.map((c) => (
          <option key={c.row_number} value={c.channel_name}>
            {c.channel_name}
          </option>
        ))}
      </select>
    </div>
  );
}
