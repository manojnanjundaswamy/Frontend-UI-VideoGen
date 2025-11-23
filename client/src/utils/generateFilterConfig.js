// src/utils/generateFilterConfig.js

export default function generateFilterConfig(state) {
  // Ensure overlays is always an array
  const overlays = Array.isArray(state.overlays) ? state.overlays : [];

  return {
    meta: state.meta || {},
    timing: state.timing || {},

    visual_overlays: overlays.filter(
      (o) => o.type === "image" || o.type === "video"
    ),

    text_overlays: overlays.filter((o) => o.type === "text"),

    audio_overlays: overlays.filter((o) => o.type === "music"),

    transitions_overlays: overlays.filter((o) => o.type === "chapter"),
  };
}
