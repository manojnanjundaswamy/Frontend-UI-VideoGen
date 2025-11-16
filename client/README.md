# FFmpeg Visual Editor (Client)

## Quick start

1. Copy the `client/` folder to your machine.
2. Create `.env` from `.env.example` and set:
   - `VITE_SHEETS_API_URL` → Google Apps Script web app URL (getAll/getRow/updateRow)
   - `VITE_N8N_PREVIEW_URL` → Preview endpoint (e.g. your Node proxy or n8n webhook)
   - `VITE_N8N_RENDER_URL` → Render webhook (optional)

3. Install & run:
```bash
cd client
npm install
npm run dev
