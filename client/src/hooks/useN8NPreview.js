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

// small helper to call your n8n review/compose endpoints
// Change WEBHOOK_PREVIEW and WEBHOOK_RENDER to your webhook URLs or server proxy

const WEBHOOK_PREVIEW = PREVIEW_URL; // adapt
const WEBHOOK_RENDER = RENDER_URL; // adapt

export async function requestPreview(segment, filterConfig, needAudio = true) {
  const body = { segment, filter_config: filterConfig, needAudio };
  const res = await fetch(WEBHOOK_PREVIEW, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Preview request failed');
  return res.json();
}

export async function requestRender(segment, filterConfig) {
  const body = { segment, filter_config: filterConfig };
  const res = await fetch(WEBHOOK_RENDER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Render request failed');
  return res.json();
}

