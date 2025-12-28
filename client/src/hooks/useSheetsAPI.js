// lightweight Sheets API helper - adapt endpoints to backend
import axios from 'axios';

const API_BASE = '/api'; // update to your server if necessary
const base = import.meta.env.VITE_SHEETS_API_URL || API_BASE;

const api = axios.create({
  headers: { 'Content-Type': 'application/json' }
});

export async function getChannels() {
  // expects the server to read the "Channel config" sheet and return array of rows
  try {
    const res = await api.post(`${base}`, { action: 'getAll', type: 'channels' });
    return res.data;
  } catch (err) {
    throw new Error(`Failed to load channels: ${err.message}`);
  }
}

export async function getRowsForChannel(sheetName) {
  // expects server to return rows array for that sheet
  try {
    const res = await api.post(`${base}`, { action: 'getAll', type: 'videos', channel_name: sheetName });
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch rows: ${err.message}`);
  }
}

export async function updateRow(sheetName, rowIndex, payload) {
  // payload is object { filter_config: JSON-string or other columns to update }
  console.log("Updating row", sheetName, rowIndex, payload);
  try {
    const res = await api.post(`${base}`, {
      action: 'update',
      type: 'videos',
      channel_name: sheetName,
      rowIndex,
      payload
    });
    console.log("Update row response", res.data);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to update row: ${err.message}`);
  }
}
