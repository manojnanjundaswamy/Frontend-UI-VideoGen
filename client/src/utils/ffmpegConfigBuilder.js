// src/utils/ffmpegConfigBuilder.js
/**
 * buildFilterConfig(meta, timing, overlays, texts, audioOverlays, transitions)
 * returns a canonical filter_config object (same shape used by n8n normalize/create nodes)
 */

export function buildFilterConfig(meta = {}, timing = {}, overlays = {}, texts = {}, audioOverlays = {}, transitions = {}) {
  // deep-clone to avoid referencing store objects
  const clone = (v) => JSON.parse(JSON.stringify(v || {}));

  return {
    meta: { ...clone(meta) },
    timing: { ...clone(timing) },
    visual_overlays: clone(overlays),
    text_overlays: clone(texts),
    audio_overlays: clone(audioOverlays),
    transitions_overlays: clone(transitions)
  };
}
