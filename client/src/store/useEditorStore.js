// src/store/useEditorStore.js
import create from 'zustand';

/**
 * Simple id generator (avoids adding uuid dependency)
 */
function makeId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * Sample row used by loadMockData
 */
const sampleRow = {
  row_number: 1,
  title: 'Atomic Habits Cinematic',
  status: 'pending',
  prompt_parsed: [
    { segment_number: 1, chapter_number: 0, chapter_name: 'Intro — The Power of Small Beginnings', scene_type: 'intro', narration_text: 'Intro text' },
    { segment_number: 2, chapter_number: 0, chapter_name: 'Seg 2', scene_type: 'intro', narration_text: 'Segment 2 text' }
  ],
  filter_config: {
    meta: {
      resolution: '1920:1080',
      fps: 30,
      default_scale: '600:-1'
    },
    timing: { chapter_transition_duration: 3 },
    visual_overlays: {},
    text_overlays: {},
    audio_overlays: {},
    transitions_overlays: {}
  }
};

function makeOverlay(type = 'image', meta = {}) {
  return {
    id: makeId('ov'),
    type,
    url: '',
    scale: meta.default_scale || '',
    scaleFactor: 1,
    opacity: 100,
    colorkey: '',
    x_offset_percent: 0,
    y_offset_percent: 0,
    layer: 0,
    loop: false,
    segment_targets: [],
    scene_types: [],
    chapter_numbers: []
  };
}

/**
 * Zustand store
 */
const useEditorStore = create((set, get) => ({
  channels: [
    { channel_id: 'BookSummary', display_name: 'BookSummary — BookSummary', sheet_name: 'BookSummary' }
  ],
  selectedChannel: 'BookSummary',
  rows: [],
  selectedRow: null,
  segments: [],
  overlays: [], // always keep as array
  selectedOverlayId: null,
  meta: { resolution: '1920:1080', fps: 30, default_scale: '600:-1' },

  // actions
  setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),

  loadMockData: () => {
    set({
      rows: [sampleRow],
      selectedRow: sampleRow,
      segments: sampleRow.prompt_parsed,
      overlays: [], // start empty
      meta: sampleRow.filter_config.meta || { resolution: '1920:1080', fps: 30, default_scale: '600:-1' }
    });
  },

  selectRow: (row) => {
    const cfg = row.filter_config || {};
    // normalize visual_overlays to array
    const visuals = cfg.visual_overlays || {};
    let overlaysArr = [];
    if (Array.isArray(visuals)) {
      overlaysArr = visuals;
    } else if (visuals && typeof visuals === 'object') {
      // convert object keyed overlays to array
      overlaysArr = Object.entries(visuals).map(([k, v], idx) => {
        return {
          id: v.id || v.key || makeId('ov'),
          key: k,
          ...v
        };
      });
    }
    // If any text overlays existed, we could convert them as well (for inspector)
    set({
      selectedRow: row,
      segments: row.prompt_parsed || [],
      overlays: overlaysArr,
      selectedOverlayId: overlaysArr.length ? overlaysArr[0].id : null,
      meta: cfg.meta || get().meta
    });
  },

  addOverlay: (type) => {
    const o = makeOverlay(type, get().meta);
    o.x_offset_percent = 0;
    o.y_offset_percent = 0;
    set(state => ({ overlays: [...state.overlays, o], selectedOverlayId: o.id }));
  },

  updateOverlay: (id, patch) => {
    set(state => ({
      overlays: state.overlays.map(o => (o.id === id ? { ...o, ...patch } : o))
    }));
  },

  removeOverlay: (id) => {
    set(state => {
      const next = state.overlays.filter(o => o.id !== id);
      return { overlays: next, selectedOverlayId: next.length ? next[0].id : null };
    });
  },

  selectOverlay: (id) => set({ selectedOverlayId: id }),

  applyPresetToOverlays: (preset) => {
    // stub: merging is domain-specific; keep simple replace for now
    if (!preset || !preset.visual_overlays) return;
    const visuals = preset.visual_overlays;
    const overlaysArr = Object.entries(visuals).map(([k, v]) => ({ id: v.id || makeId('ov'), key: k, ...v }));
    set({ overlays: overlaysArr, selectedOverlayId: overlaysArr.length ? overlaysArr[0].id : null });
  },

  exportFilterConfig: () => {
    const s = get();
    const filter = {
      meta: s.meta,
      timing: s.selectedRow?.filter_config?.timing || {},
      visual_overlays: {},
      text_overlays: {},
      audio_overlays: {},
      transitions_overlays: s.selectedRow?.filter_config?.transitions_overlays || {}
    };
    s.overlays.forEach((o, i) => {
      const key = o.key || `visual_${i}`;
      // copy overlay fields; keep id as key too
      const copy = { ...o };
      delete copy.id;
      filter.visual_overlays[key] = copy;
    });
    return filter;
  }
}));

export default useEditorStore;
