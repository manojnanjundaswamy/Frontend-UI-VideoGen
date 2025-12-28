// src/store/useEditorStore.js
import { create } from 'zustand';
import { getChannels, getRowsForChannel } from "../hooks/useSheetsAPI.js";

/**
 * Zustand Store
 * Replaces the manual subscription pattern with a robust state management library.
 */

function safeJsonParse(str) {
  if (!str) return null;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    console.warn("JSON parse failed:", str);
    return null;
  }
}

function flattenOverlayGroup(groupObj, defaultType = null) {
  if (!groupObj || typeof groupObj !== "object") return [];

  return Object.entries(groupObj).map(([key, value]) => ({
    id: value.id || key,
    type: value.type || defaultType || "image",
    ...value
  }));
}

function extractOverlays(filterConfig) {
  if (!filterConfig) return [];

  const visuals = flattenOverlayGroup(filterConfig.visual_overlays, "image");
  const texts = flattenOverlayGroup(filterConfig.text_overlays, "text");
  const audios = flattenOverlayGroup(filterConfig.audio_overlays, "music");
  const trans = flattenOverlayGroup(filterConfig.transitions_overlays, "chapter");

  return [...visuals, ...texts, ...audios, ...trans];
}

// helper to generate an id
function makeId(prefix = "ov") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

const useEditorStore = create((set, get) => ({
  // --- STATE ---
  meta: {
    resolution: "1920:1080",
    fps: 30,
    default_scale: "600:-1",
  },
  timing: {},
  channels: [], // loaded channel list
  rows: [], // video rows for selected channel
  segments: [], // parsed segments (from selected row.prompt_json)
  overlays: [], // array of overlay objects
  selectedOverlayId: null,
  selectedChannel: null,
  selectedRow: null,
  presets: [],
  previewSegmentIndex: 0,
  segmentPreviews: {}, // { [segIdx]: { loading: bool, url: string, error: string } }

  // --- ACTIONS ---

  setSegmentPreviewStatus: (index, status) => {
    set(state => ({
      segmentPreviews: {
        ...state.segmentPreviews,
        [index]: { ...state.segmentPreviews[index], ...status }
      }
    }));
  },

  // Helper to get raw state (for compatibility with existing code calling getStateRaw)
  getStateRaw: () => get(),

  setState: (patchOrFn) => set((state) => {
    return typeof patchOrFn === 'function' ? patchOrFn(state) : patchOrFn;
  }),

  loadChannels: async () => {
    try {
      const list = await getChannels();
      set({ channels: list });
    } catch (err) {
      console.error("Failed to load channels", err);
    }
  },

  loadRowsForChannel: async (channelName) => {
    try {
      const rows = await getRowsForChannel(channelName);
      console.log("Loaded rows for channel", channelName, rows);
      set({
        rows,
        selectedChannel: channelName,
      });
    } catch (err) {
      console.error("Failed to load rows", err);
    }
  },

  openRow: (row) => {
    const segments = safeJsonParse(row.prompt_json) || [];
    const cfg = safeJsonParse(row.filter_config);
    // const state = get(); // needed for meta

    // Logical Check for Shorts
    const isShort = row.type && row.type.toString().toUpperCase().includes('SHORT');
    const resolution = isShort ? "1080:1920" : "1920:1080";
    const default_scale = isShort ? "1080:-1" : "600:-1"; // Adjust default scale for fit

    const newMeta = {
      resolution,
      fps: 30, // Default fps
      default_scale
    };

    const overlays = extractOverlays(cfg).map(o => ({
      ...o,
      id: o.id || `ov_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      opacity: o.opacity ?? 100,
      x_offset_percent: o.x_offset_percent ?? 0,
      y_offset_percent: o.y_offset_percent ?? 0,
      layer: o.layer ?? 0,
      scale: o.scale ?? default_scale,
    }));

    set({
      selectedRow: row,
      segments,
      overlays,
      selectedOverlayId: null,
      meta: newMeta
    });
  },

  addOverlay: (type = "image") => {
    const id = makeId(type);
    const state = get();
    // reasonable defaults
    const overlay = {
      id,
      type,
      url: "",
      scale: state.meta.default_scale || "600:-1",
      opacity: 100,
      colorkey: "",
      x_offset_percent: 0,
      y_offset_percent: 0,
      layer: 0,
      // additional fields
      loop: false,
      start_time: 0,
      duration: null,
      segment_targets: [],
      scene_types: [],
      chapter_numbers: [],
    };
    set((s) => ({ overlays: [...s.overlays, overlay], selectedOverlayId: id }));
    return id;
  },

  updateOverlay: (id, patch) => {
    set((s) => ({
      overlays: s.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o))
    }));
  },

  removeOverlay: (id) => {
    set((s) => ({
      overlays: s.overlays.filter((o) => o.id !== id),
      selectedOverlayId: s.selectedOverlayId === id ? null : s.selectedOverlayId
    }));
  },

  selectOverlay: (id) => {
    set({ selectedOverlayId: id });
  },

  setMeta: (metaPatch) => {
    set((s) => ({ meta: { ...s.meta, ...metaPatch } }));
  },

  setPreviewSegmentIndex: (index) => {
    set({ previewSegmentIndex: index });
  },

  loadMockData: () => {
    // We can just call internal actions or set state directly
    // This maintains the existing mock behavior
    setTimeout(() => {
      const { addOverlay, updateOverlay } = get();
      const id = addOverlay("image");
      updateOverlay(id, {
        url: "http://localhost:9000/youtube-automation/BookSummary/assets/AtomiCHabitsBG-croped.PNG",
        scale: "500:-1",
        x_offset_percent: 0,
        y_offset_percent: 0,
        opacity: 100,
        layer: 0,
      });
      const id2 = addOverlay("image");
      updateOverlay(id2, {
        url: "http://localhost:9000/youtube-automation/BookSummary/assets/AtomiCHabitsBG-croped.PNG",
        scale: "300:-1",
        x_offset_percent: 20,
        y_offset_percent: -20,
        opacity: 90,
        layer: 1,
      });
    }, 50);
  }
}));

export default useEditorStore;
