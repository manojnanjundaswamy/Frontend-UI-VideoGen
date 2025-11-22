// small helper to normalize a filter_config before sending to n8n
export default function normalizeFilterConfig(filter, channelDefaults = {}) {
  const out = { ...filter };
  out.meta = { ...channelDefaults.meta, ...filter.meta };
  // ensure sub-objects exist
  out.visual_overlays = out.visual_overlays || {};
  out.text_overlays = out.text_overlays || {};
  out.audio_overlays = out.audio_overlays || {};
  out.transitions_overlays = out.transitions_overlays || {};
  return out;
}
