// src/store/useEditorStore.js
import React from "react";

/**
 * Simple global store with subscribe/notify and a React hook wrapper.
 * - state is a plain object
 * - useEditorStore(selector) returns selected slice
 * - useEditorStore.getState() returns an API object with methods (for direct usage)
 *
 * IMPORTANT: We intentionally keep overlays as an ARRAY (see user's choice).
 */

let state = {
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
};

const listeners = new Set();

function setState(patchOrFn) {
  if (typeof patchOrFn === "function") {
    state = { ...state, ...patchOrFn(state) };
  } else {
    state = { ...state, ...patchOrFn };
  }
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// helper to generate an id
function makeId(prefix = "ov") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

// helpers operating on state - used by getState() API
function addOverlay(type = "image") {
  const id = makeId(type);
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
  setState((s) => ({ overlays: [...s.overlays, overlay], selectedOverlayId: id }));
  return id;
}

function updateOverlay(id, patch) {
  setState((s) => {
    const overlays = s.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o));
    return { overlays };
  });
}

function removeOverlay(id) {
  setState((s) => {
    const overlays = s.overlays.filter((o) => o.id !== id);
    const selectedOverlayId = s.selectedOverlayId === id ? null : s.selectedOverlayId;
    return { overlays, selectedOverlayId };
  });
}

function selectOverlay(id) {
  setState({ selectedOverlayId: id });
}

function setMeta(metaPatch) {
  setState((s) => ({ meta: { ...s.meta, ...metaPatch } }));
}

function loadMockData() {
  // minimal mock so UI shows something — you can remove/replace with real fetch later
  setState({
    channels: [
      { row_number: 5, channel_name: "BookSummary", sheet_name: "BookSummary" },
      { row_number: 4, channel_name: "TheChampionWays", sheet_name: "TheChampionWays" },
    ],
    selectedChannel: 5,
    rows: [
      { row_number: 4, title: "Atomic Habits Cinematic", status: "pending" },
      { row_number: 5, title: "Second video", status: "pending" },
    ],
    overlays: [],
    selectedOverlayId: null,
    segments: [],
  });

  // add a sample overlay so canvas isn't empty
  setTimeout(() => {
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

// Build API object returned by getState
function buildAPI() {
  return {
    getStateRaw: () => state,
    addOverlay,
    updateOverlay,
    removeOverlay,
    selectOverlay,
    setMeta,
    loadMockData,
    setState,
    subscribe,
  };
}

// The React hook that accepts a selector function.
export default function useEditorStore(selector) {
  // selector defaults to entire state if not function
  const sel = typeof selector === "function" ? selector : (s) => s;

  const snapshot = React.useSyncExternalStore(
    subscribe,
    () => sel(state),
    () => sel(state)
  );

  return snapshot;
}

// Attach helper accessors so old code like useEditorStore.getState() works:
useEditorStore.getState = () => buildAPI();
