// src/store/useEditorStore.js
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export const defaultOverlay = (type = 'image') => {
  const id = nanoid();
  return {
    id,
    type, // image | video | text | music | chapter_anim
    url: '',
    text: type === 'text' ? 'Sample Text' : '',
    font: '/app/fonts/ComicNeue-BoldItalic.ttf',
    fontsize: 48,
    fontcolor: 'white',
    scale: '', // ffmpeg style e.g. 1920:1080 or iw*0.5:ih*0.5
    scale_factor: 1,
    opacity: 100,
    colorkey: '',
    x_offset_percent: 0,
    y_offset_percent: 0,
    layer: 0,
    // UI-only preview box (px)
    preview_w: 300,
    preview_h: 150,
    preview_x: 0, // percent relative canvas center (-50..50)
    preview_y: 0,
    // selection scope
    segment_targets: [],
    scene_types: [],
    chapter_numbers: [],
    // loops for video
    loop: false,
  };
};

export const useEditorStore = create(devtools((set, get) => ({
  channels: [], // list of channels
  selectedChannel: null,
  rows: [], // rows loaded from sheet
  selectedRow: null,
  segments: [], // parsed segments for selected row
  overlays: {}, // keyed by overlay id
  overlaysOrder: [], // array of ids in order (z-order)
  selectedOverlayId: null,
  needAudio: true,
  // actions
  setChannels: (channels) => set({ channels }),
  setSelectedChannel: (ch) => set({ selectedChannel: ch }),
  setRows: (rows) => set({ rows }),
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
  setSegments: (segments) => set({ segments }),
  addOverlay: (type = 'image', initial = {}) => {
    const o = { ...defaultOverlay(type), ...initial };
    // center small preview
    o.preview_w = initial.preview_w || 300;
    o.preview_h = initial.preview_h || 150;
    o.preview_x = 0;
    o.preview_y = 0;
    set((s) => {
      return {
        overlays: { ...s.overlays, [o.id]: o },
        overlaysOrder: [...s.overlaysOrder, o.id],
        selectedOverlayId: o.id,
      };
    });
    return o;
  },
  updateOverlay: (id, patch) => {
    set((s) => {
      const o = s.overlays[id];
      if (!o) return {};
      const updated = { ...o, ...patch };
      return { overlays: { ...s.overlays, [id]: updated } };
    });
  },
  removeOverlay: (id) => {
    set((s) => {
      const next = { ...s.overlays };
      delete next[id];
      return {
        overlays: next,
        overlaysOrder: s.overlaysOrder.filter(x => x !== id),
        selectedOverlayId: s.selectedOverlayId === id ? null : s.selectedOverlayId,
      };
    });
  },
  selectOverlay: (id) => set({ selectedOverlayId: id }),
  reorderOverlays: (newOrder) => set({ overlaysOrder: newOrder }),
  setNeedAudio: (v) => set({ needAudio: !!v }),
  reset: () => set({
    channels: [],
    selectedChannel: null,
    rows: [],
    selectedRow: null,
    segments: [],
    overlays: {},
    overlaysOrder: [],
    selectedOverlayId: null,
    needAudio: true
  })
})));
