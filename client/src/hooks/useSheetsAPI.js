// lightweight Sheets API helper - adapt endpoints to backend
const API_BASE = '/api'; // update to your server if necessary
const base = import.meta.env.VITE_SHEETS_API_URL || API_BASE;
export async function getChannels() {
  // expects the server to read the "Channel config" sheet and return array of rows
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getAll', type: 'channels' })
  });
  if (!res.ok) throw new Error('Failed to load channels');
  return res.json();
}

export async function getRowsForChannel(sheetName) {
  // expects server to return rows array for that sheet
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getAll', type: 'videos', channel_name: sheetName })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to fetch rows: ${txt}`);
  }
  return res.json();
}

export async function updateRow(sheetName, rowIndex, payload) {
  // payload is object { filter_config: JSON-string or other columns to update }
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', type: 'videos', channel_name: sheetName, rowIndex, payload })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to update row: ${txt}`);
  }
  return res.json();
}



// import axios from 'axios';

// const base = import.meta.env.VITE_SHEETS_API_URL || '/sheet';

// export async function getAllRows() {
//   // your n8n sheet endpoint should respond to /sheet?action=getAll or /sheet/getAll
//   const url = `${base}?action=getAll`;
//   const res = await axios.post(url,{ action:"getAll", payload: {} });
//   return res.data;
// }

// export async function getRow(id) {
//   const url = `${base}?action=get?id=${encodeURIComponent(id)}`;
//   const res = await axios.post(url);
//   return res.data;
// }

// export async function updateRow(id, payload) {
//   const url = `${base}?action=update`;
//   const res = await axios.post(url, { id, payload });
//   return res.data;
// }
