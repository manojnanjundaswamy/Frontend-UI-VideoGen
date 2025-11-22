// src/components/ChannelSelector.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';

export default function ChannelSelector() {
  const channels = useEditorStore(s => s.channels || []);
  const selectedChannel = useEditorStore(s => s.selectedChannel) ?? '';
  const setSelectedChannel = useEditorStore(s => s.setSelectedChannel);

  // ensure value is never null
  const value = selectedChannel || (channels[0]?.channel_id ?? '');

  React.useEffect(() => {
    // if no selected channel but we have channels, set default
    if ((!selectedChannel || selectedChannel === '') && channels.length) {
      setSelectedChannel(channels[0].channel_id);
    }
  }, [channels, selectedChannel, setSelectedChannel]);

  return (
    <div className="mb-4">
      <label className="block text-sm text-slate-300 mb-1">Select Channel</label>
      <select value={value} onChange={(e) => setSelectedChannel(e.target.value)} className="w-full bg-slate-700 text-white p-2 rounded">
        {channels.map(c => (
          <option key={c.channel_id} value={c.channel_id}>{c.display_name}</option>
        ))}
      </select>
    </div>
  );
}
