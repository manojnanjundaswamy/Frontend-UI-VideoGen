import React, { useEffect } from "react";
import useEditorStore from "../store/useEditorStore";
import { Tv } from 'lucide-react';

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
      <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-2">
        <Tv className="w-3.5 h-3.5" />
        Select Channel
      </label>
      <div className="relative">
        <select
          className={`
             w-full p-2.5 rounded-lg bg-slate-900 
             border border-white/10 text-slate-200 text-sm appearance-none
             focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none
             transition-all cursor-pointer
          `}
          value={selectedChannel ?? ""}
          onChange={handleChange}
        >
          <option value="">-- No channel selected --</option>
          {channels.map((c) => (
            <option key={c.row_number} value={c.channel_name}>
              {c.channel_name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
        </div>
      </div>
    </div>
  );
}
