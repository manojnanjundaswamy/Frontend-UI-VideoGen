// src/components/FilterConfigModal.jsx
import React from "react";

export default function FilterConfigModal({ open, onClose, filterConfig }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", left: 0, top: 0, right:0, bottom:0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems:"center", justifyContent:"center", zIndex: 2000 }}>
      <div style={{ width: "80%", height: "80%", background: "#fff", padding: 16, overflow: "auto", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <strong>Generated filter_config</strong>
          <div>
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(filterConfig, null, 2)); alert("Copied"); }}>Copy</button>
            <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
          </div>
        </div>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(filterConfig, null, 2)}</pre>
      </div>
    </div>
  );
}
