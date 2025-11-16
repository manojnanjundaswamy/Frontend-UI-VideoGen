// src/components/PreviewPanel.jsx
import React, { useEffect, useState } from "react";

/**
 * Preview panel simple component listens window event 'ffmpeg-preview'
 * payload: { url }
 */
export default function PreviewPanel() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const u = e.detail?.url;
      setUrl(u);
    };
    window.addEventListener("ffmpeg-preview", handler);
    return () => window.removeEventListener("ffmpeg-preview", handler);
  }, []);

  if (!url) {
    return <div style={{ padding: 12 }}>No preview yet. Click "Preview" in Timeline.</div>;
  }

  return (
    <div style={{ padding: 12 }}>
      <div>Preview</div>
      <video src={url} controls width={640} />
      <div style={{ marginTop: 8 }}>
        <a href={url} target="_blank" rel="noreferrer">Open raw file</a>
      </div>
    </div>
  );
}