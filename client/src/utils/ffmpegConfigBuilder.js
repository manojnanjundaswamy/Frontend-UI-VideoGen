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

export function splitOverlays(overlays = {}) {
  const visual = {};
  const text = {};
  const audio = {};
  const transitions = {};

  Object.entries(overlays).forEach(([id, o]) => {
    if (!o || !o.type) return;

    switch (o.type) {
      case 'image':
      case 'video':
        visual[id] = o;
        break;

      case 'text':
        text[id] = o;
        break;

      case 'music':
        audio[id] = o;
        break;

      case 'chapter_anim':
        transitions[id] = o;
        break;

      default:
        visual[id] = o;
    }
  });

  return { visual, text, audio, transitions };
}


