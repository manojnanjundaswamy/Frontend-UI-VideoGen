export default function generateFullConfig(state) {
  const overlays = Array.isArray(state.overlays) ? state.overlays : [];

  const visual = overlays.filter(o => o.type === "image" || o.type === "video");
  const texts  = overlays.filter(o => o.type === "text");
  const audios = overlays.filter(o => o.type === "music");
  const trans  = overlays.filter(o => o.type === "chapter");

  return {
    meta: state.meta || {},
    timing: state.timing || {},

    visual_overlays: visual,
    text_overlays: texts,
    audio_overlays: audios,
    transitions_overlays: trans,

    caption: state.caption_config || {},
    motion_defaults: state.motion_defaults || {}
  };
}
