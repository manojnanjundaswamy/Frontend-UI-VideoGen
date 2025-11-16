import axios from 'axios';

const base = import.meta.env.VITE_SHEETS_API_URL || '/sheet';

export async function getAllRows() {
  // your n8n sheet endpoint should respond to /sheet?action=getAll or /sheet/getAll
  const url = `${base}?action=getAll`;
  const res = await axios.post(url,{ action:"getAll", payload: {} });
  return res.data;
}

export async function getRow(id) {
  const url = `${base}?action=get?id=${encodeURIComponent(id)}`;
  const res = await axios.post(url);
  return res.data;
}

export async function updateRow(id, payload) {
  const url = `${base}?action=update`;
  const res = await axios.post(url, { id, payload });
  return res.data;
}
