// src/hooks/useN8NPreview.js
import axios from "axios";

/**
 * Configure these URLs to point to your n8n webhook endpoints.
 * Example env variables:
 *   VITE_N8N_PREVIEW_URL = "https://n8n.example.com/webhook/preview-subflow"
 *   VITE_N8N_RENDER_URL  = "https://n8n.example.com/webhook/render-subflow"
 */
const PREVIEW_URL = (import.meta.env.VITE_N8N_PREVIEW_URL) || "/api/preview";
const RENDER_URL = (import.meta.env.VITE_N8N_RENDER_URL) || "/api/render";

// Create an axios instance for better configuration management if needed
const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function requestPreview(segment, filterConfig, needAudio = true, autoBackground = false, context = {}) {
  const body = {
    segment,
    filter_config: filterConfig,
    needAudio,
    auto_background: autoBackground,
    ...context
  };
  try {
    const res = await api.post(PREVIEW_URL, body);
    console.log("Preview request result:", res.data);
    return res.data;
  } catch (error) {
    console.error("Preview request failed:", error);
    throw new Error(error.response?.data?.message || 'Preview request failed');
  }
}

export async function requestRender(segment, filterConfig) {
  const body = { segment, filter_config: filterConfig };
  try {
    const res = await api.post(RENDER_URL, body);
    console.log("Render request result:", res.data);
    return res.data;
  } catch (error) {
    console.error("Render request failed:", error);
    throw new Error(error.response?.data?.message || 'Render request failed');
  }
}

