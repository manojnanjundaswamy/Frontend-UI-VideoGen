import create from 'zustand';

// central editor store
export const useEditorStore = create((set, get) => ({
  // channels & sheets
  channels: [],
  setChannels: (channels) => set({ channels }),

  selectedChannel: null,
  setSelectedChannel: (channel) => {
    // when channel changes, clear rows/selectedRow
    set({ selectedChannel: channel, rows: [], selectedRow: null });
  },

  // rows in the selected channel sheet
  rows: [],
  setRows: (rows) => set({ rows }),

  selectedRow: null,
  setSelectedRow: (row) => {
    // when selecting row, load its filter_config into overlays
    const filter_config = row?.filter_config ? JSON.parse(row.filter_config) : null;
    set({
      selectedRow: row,
      filterConfigRaw: filter_config,
      overlays: (filter_config && filter_config.visual_overlays) || {},
      textOverlays: (filter_config && filter_config.text_overlays) || {},
      audioOverlays: (filter_config && filter_config.audio_overlays) || {},
      transitions: (filter_config && filter_config.transitions_overlays) || {},
      meta: (filter_config && filter_config.meta) || {},
      timing: (filter_config && filter_config.timing) || {},
      selectedOverlayId: null
    });
  },

  // raw filter config parts
  filterConfigRaw: null,
  meta: { resolution: '1920:1080', fps: 30, default_scale: '600:-1' },
  setMeta: (m) => set((s) => ({ meta: { ...s.meta, ...m } })),

  timing: {},
  setTiming: (t) => set({ timing: t }),

  // overlays
  overlays: {}, // visual_overlays combined (images/videos)
  setOverlays: (o) => set({ overlays: o }),
  textOverlays: {},
  setTextOverlays: (t) => set({ textOverlays: t }),
  audioOverlays: {},
  setAudioOverlays: (a) => set({ audioOverlays: a }),
  transitions: {},
  setTransitions: (t) => set({ transitions: t }),

  // selected overlay id
  selectedOverlayId: null,
  setSelectedOverlayId: (id) => set({ selectedOverlayId: id }),

  // overlay helpers
  addOverlay: (key, overlay) =>
    set((s) => ({ overlays: { ...s.overlays, [key]: overlay } })),
  updateOverlay: (key, patch) =>
    set((s) => ({ overlays: { ...s.overlays, [key]: { ...s.overlays[key], ...patch } } })),
  removeOverlay: (key) =>
    set((s) => {
      const copy = { ...s.overlays };
      delete copy[key];
      return { overlays: copy, selectedOverlayId: null };
    }),

  // UI state
  needAudio: true,
  setNeedAudio: (v) => set({ needAudio: v }),

  // convenience: build final filter_config object
  buildFilterConfig: () => {
    const s = get();
    return {
      meta: s.meta,
      timing: s.timing,
      visual_overlays: s.overlays,
      text_overlays: s.textOverlays,
      audio_overlays: s.audioOverlays,
      transitions_overlays: s.transitions
    };
  }
}));
