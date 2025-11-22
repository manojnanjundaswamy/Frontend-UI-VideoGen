export function buildFilterConfig(meta = {}, timing = {}, visual = {}, text = {}, audio = {}, transitions = {}) {
  return {
    meta: { resolution: meta.resolution || '1920:1080', fps: meta.fps || 30, default_scale: meta.default_scale || '600:-1', ...meta },
    timing: timing || {},
    visual_overlays: visual || {},
    text_overlays: text || {},
    audio_overlays: audio || {},
    transitions_overlays: transitions || {}
  };
}
