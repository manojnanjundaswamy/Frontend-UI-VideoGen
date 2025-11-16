// src/hooks/useN8NPreview.js
import axios from "axios";

/**
 * Configure these URLs to point to your n8n webhook endpoints.
 * Example env variables:
 *   VITE_N8N_PREVIEW_URL = "https://n8n.example.com/webhook/preview-subflow"
 *   VITE_N8N_RENDER_URL  = "https://n8n.example.com/webhook/render-subflow"
 */
const PREVIEW_URL = (import.meta && import.meta.env && import.meta.env.VITE_N8N_PREVIEW_URL) || "/api/preview";
const RENDER_URL = (import.meta && import.meta.env && import.meta.env.VITE_N8N_RENDER_URL) || "/api/render";

/**
 * requestPreview(segment, filter_config, needAudio)
 * returns the response object (compose job response)
 */
export async function requestPreview(segment, filter_config, needAudio = true) {
  try {
    const payload = { segment, filter_config, need_audio: !!needAudio };
    const res = await axios.post(PREVIEW_URL, payload, { timeout: 120000 });
    return res.data;
  } catch (err) {
    console.error("requestPreview error", err);
    throw err;
  }
}

/**
 * requestRender(segment, filter_config)
 */
export async function requestRender(segment, filter_config) {
  try {
    const payload = { segment, filter_config };
    const res = await axios.post(RENDER_URL, payload, { timeout: 300000 });
    return res.data;
  } catch (err) {
    console.error("requestRender error", err);
    throw err;
  }
}
