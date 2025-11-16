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
  const filter_config = row?.filter_config ? JSON.parse(row.filter_config) : null;
  const segments = row?.prompt_json ? JSON.parse(row.prompt_json) : [];

  set({
    selectedRow: row,

    // segments (IMPORTANT)
    segments,

    // filter config parts
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
  addOverlay: (overlay) => {
    const id = overlay.id || `${overlay.type}_${Date.now()}`;
    set(state => {
      const overlays = { ...(state.overlays || {}) };
      overlays[id] = { ...overlay, id };
      return { overlays };
    });
  },
  updateOverlay: (key, patch) =>
    set((s) => ({ overlays: { ...s.overlays, [key]: { ...s.overlays[key], ...patch } } })),
  removeOverlay: (key) =>
    set((s) => {
      const copy = { ...s.overlays };
      delete copy[key];
      return { overlays: copy, selectedOverlayId: null };
    }),
  selectOverlay: (id) => set(() => ({ selectedOverlayId: id })),  
  // UI state
  needAudio: true,
  setNeedAudio: (v) => set(() => ({ needAudio: !!v })),

  // overlay presets (global)
  overlayPresets: {},
  addPreset: (name, overlay) => set((s) => ({ overlayPresets: { ...s.overlayPresets, [name]: overlay } })),
  applyPreset: (name) => {
    const p = get().overlayPresets[name];
    if (!p) return;
    const id = `${p.type}_${Date.now()}`;
    set((s) => ({ overlays: { ...s.overlays, [id]: { ...p, id } }, selectedOverlayId: id }));
  },

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
