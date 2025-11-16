// src/store/useEditorStore.js
import create from "zustand";

/**
 * Editor store (Zustand)
 * - meta: project/channel-level defaults
 * - overlays: keyed object for visual overlays
 * - texts: keyed object for text overlays
 * - audioOverlays: keyed object for audio overlays (bgm)
 * - presets: keyed object (local)
 * - selectedRowMeta: info about current sheet row (row_number etc.)
 */

export const useEditorStore = create((set, get) => ({
  meta: {
    project_name: "Untitled Project",
    resolution: "1920:1080",
    fps: 30,
    default_scale: "600:-1",
    preset: "veryfast",
    crf: 20,
    delay_seconds: 0
  },

  // overlays grouped by keys (visual_overlays)
  overlays: {},

  // text overlays
  texts: {},

  // audio overlays (background music)
  audioOverlays: {},

  // transitions (chapter animation etc.)
  transitions: {},

  // presets loaded from backend / sheet
  presets: {},

  // channel config
  channelConfig: {
    channel_id: null,
    default_voice: null,
    default_speed: 1.0,
    caption_position: "bottom",
    default_bgm_url: null
  },

  // row currently loaded (from sheet)
  selectedRow: null, // entire sheet row object
  // unique row id column name (default)
  rowIdColumn: "row_number",

  // selection
  selectedKey: null,

  // preview audio toggle
  needAudio: true,

  // actions
  setMeta: (m) => set((s) => ({ meta: { ...s.meta, ...m } })),
  setOverlays: (ov) => set({ overlays: ov || {} }),
  setTexts: (t) => set({ texts: t || {} }),
  setAudioOverlays: (a) => set({ audioOverlays: a || {} }),
  setTransitions: (t) => set({ transitions: t || {} }),
  setPresets: (p) => set({ presets: p || {} }),
  setChannelConfig: (c) => set((s) => ({ channelConfig: { ...s.channelConfig, ...c } })),

  upsertOverlay: (key, payload) => set((s) => ({
    overlays: { ...s.overlays, [key]: { ...(s.overlays[key] || {}), ...payload } }
  })),

  upsertText: (key, payload) => set((s) => ({
    texts: { ...s.texts, [key]: { ...(s.texts[key] || {}), ...payload } }
  })),

  upsertAudioOverlay: (key, payload) => set((s) => ({
    audioOverlays: { ...s.audioOverlays, [key]: { ...(s.audioOverlays[key] || {}), ...payload } }
  })),

  removeOverlay: (key) => set((s) => {
    const copy = { ...s.overlays }; delete copy[key];
    return { overlays: copy, selectedKey: s.selectedKey === key ? null : s.selectedKey };
  }),

  removeText: (key) => set((s) => {
    const copy = { ...s.texts }; delete copy[key];
    return { texts: copy, selectedKey: s.selectedKey === key ? null : s.selectedKey };
  }),

  selectKey: (key) => set({ selectedKey: key }),
  clearSelection: () => set({ selectedKey: null }),
  setSelectedRow: (row) => set({ selectedRow: row }),

  toggleNeedAudio: () => set((s) => ({ needAudio: !s.needAudio })),
  setNeedAudio: (v) => set({ needAudio: !!v }),

  replaceAll: ({ meta, overlays, texts, audioOverlays, transitions, channelConfig, selectedRow }) =>
    set({
      meta: meta || get().meta,
      overlays: overlays || {},
      texts: texts || {},
      audioOverlays: audioOverlays || {},
      transitions: transitions || {},
      channelConfig: channelConfig || get().channelConfig,
      selectedRow: selectedRow || get().selectedRow
    }),

  resetAll: () => set({
    meta: {
      project_name: "Untitled Project",
      resolution: "1920:1080",
      fps: 30,
      default_scale: "600:-1",
      preset: "veryfast",
      crf: 20,
      delay_seconds: 0
    },
    overlays: {},
    texts: {},
    audioOverlays: {},
    transitions: {},
    presets: {},
    selectedKey: null,
    selectedRow: null
  })
}));
