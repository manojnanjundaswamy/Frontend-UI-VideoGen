import React from "react";
import useEditorStore from "../store/useEditorStore";

export default function ChannelSelector() {
  const channels = useEditorStore((s) => s.channels);        // SAFE selector
  const selectedChannel = useEditorStore((s) => s.selectedChannel); 
  const setSelectedChannel = useEditorStore((s) => s.setSelectedChannel);
  const loadRowsForChannel = useEditorStore((s) => s.loadRowsForChannel);

  const handleChange = (e) => {
    const channelName = e.target.value;

    setSelectedChannel(channelName);

    if (channelName && channelName !== "-- Select channel --") {
      loadRowsForChannel(channelName);
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
        <option key="none" value="">
          -- Select channel --
        </option>

        {channels.length > 0 &&
          channels.map((c) => (
            <option key={c.row_number} value={c.channel_name}>
              {c.channel_name}
            </option>
          ))}
      </select>
    </div>
  );
}
