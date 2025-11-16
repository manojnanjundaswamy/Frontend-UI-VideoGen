// src/components/OverlayInspector.jsx
import React from "react";
import { useEditorStore } from "../store/useEditorStore";

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: "#333", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export default function OverlayInspector() {
  const selectedKey = useEditorStore((s) => s.selectedKey);
  const overlays = useEditorStore((s) => s.overlays);
  const texts = useEditorStore((s) => s.texts);
  const audioOverlays = useEditorStore((s) => s.audioOverlays);
  const upsertOverlay = useEditorStore((s) => s.upsertOverlay);
  const upsertText = useEditorStore((s) => s.upsertText);
  const upsertAudio = useEditorStore((s) => s.upsertAudioOverlay);
  const removeOverlay = useEditorStore((s) => s.removeOverlay);
  const removeText = useEditorStore((s) => s.removeText);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const overlay = selectedKey ? (overlays[selectedKey] || texts[selectedKey] || audioOverlays[selectedKey]) : null;
  const type = overlay?.type || "image";

  if (!overlay) return <div style={{ padding: 12 }}>Select an overlay to edit.</div>;

  const set = (field, value) => {
    if (overlay.type === "text" || field === "text" || field === "font") {
      upsertText(selectedKey, { ...(texts[selectedKey] || overlay), ...{ [field]: value } });
    } else if (overlay.type === "audio" || (overlay.audio)) {
      upsertAudio(selectedKey, { ...(audioOverlays[selectedKey] || overlay), ...{ [field]: value } });
    } else {
      upsertOverlay(selectedKey, { ...(overlays[selectedKey] || overlay), ...{ [field]: value } });
    }
  };

  const handleDelete = () => {
    if (overlay.type === "text") removeText(selectedKey);
    else if (overlay.type === "audio") upsertAudio(selectedKey, null); // implement deletion as needed
    else removeOverlay(selectedKey);
    clearSelection();
  };

  return (
    <div style={{ padding: 12, maxWidth: 480 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>{selectedKey}</strong>
        <div>
          <button onClick={handleDelete} style={{ marginRight: 8 }}>Delete</button>
          <button onClick={() => clearSelection()}>Close</button>
        </div>
      </div>

      <Field label="Type">
        <select value={overlay.type || "image"} onChange={(e) => set("type", e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="audio">Audio (bgm)</option>
        </select>
      </Field>

      {(overlay.type !== "text") && (
        <Field label="URL / Asset">
          <input style={{ width: "100%" }} value={overlay.url || ""} onChange={(e) => set("url", e.target.value)} placeholder="http://..." />
        </Field>
      )}

      <Field label='Scale (FFmpeg string)'>
        <input style={{ width: "100%" }} value={overlay.scale || ""} onChange={(e) => set("scale", e.target.value)} placeholder='e.g. "1920:1080" or "600:-1" or "iw*0.25:ih*0.25"' />
      </Field>

      <Field label="Opacity (0-100)">
        <input type="number" min="0" max="100" value={overlay.opacity ?? 100} onChange={(e) => set("opacity", Number(e.target.value))} />
      </Field>

      <Field label="Color key (optional)">
        <input style={{ width: "100%" }} value={overlay.colorkey || ""} onChange={(e) => set("colorkey", e.target.value)} placeholder="black:0.08:0.1" />
      </Field>

      <Field label="X offset percent (positive = right)">
        <input type="number" value={overlay.x_offset_percent ?? 0} onChange={(e) => set("x_offset_percent", Number(e.target.value))} />
      </Field>

      <Field label="Y offset percent (positive = up)">
        <input type="number" value={overlay.y_offset_percent ?? 0} onChange={(e) => set("y_offset_percent", Number(e.target.value))} />
      </Field>

      <Field label="Layer (z-order)">
        <input type="number" value={overlay.layer ?? 0} onChange={(e) => set("layer", Number(e.target.value))} />
      </Field>

      <Field label="Loop (video/image)">
        <input type="checkbox" checked={!!overlay.loop} onChange={(e) => set("loop", !!e.target.checked)} />
      </Field>

      <Field label="Start time (sec)">
        <input type="number" min="0" value={overlay.start_time ?? 0} onChange={(e) => set("start_time", Number(e.target.value))} />
      </Field>

      <Field label="Duration (sec)">
        <input type="number" min="0" value={overlay.duration || ""} onChange={(e) => set("duration", Number(e.target.value))} />
      </Field>

      <Field label="Segment targets (comma separated)">
        <input value={(overlay.segment_targets || []).join(",")} onChange={(e) => set("segment_targets", e.target.value.split(",").map(v=>v.trim()).filter(Boolean).map(Number))} placeholder="e.g. 1,2,3" />
      </Field>

      <Field label="Scene types (comma separated)">
        <input value={(overlay.scene_types || []).join(",")} onChange={(e) => set("scene_types", e.target.value.split(",").map(v=>v.trim()).filter(Boolean))} placeholder="e.g. chapter,intro" />
      </Field>

      {/* Text specific */}
      {overlay.type === "text" && (
        <>
          <Field label="Text">
            <textarea rows={4} value={overlay.text || ""} onChange={(e) => set("text", e.target.value)} />
          </Field>

          <Field label="Font path">
            <input value={overlay.font || "/app/fonts/ComicNeue-BoldItalic.ttf"} onChange={(e) => set("font", e.target.value)} />
          </Field>

          <Field label="Font color">
            <input value={overlay.fontcolor || "white"} onChange={(e) => set("fontcolor", e.target.value)} />
          </Field>

          <Field label="Font size">
            <input type="number" min="6" value={overlay.fontsize || 48} onChange={(e) => set("fontsize", Number(e.target.value))} />
          </Field>

          <Field label="Box">
            <input type="checkbox" checked={!!overlay.box} onChange={(e) => set("box", !!e.target.checked)} />
          </Field>

          <Field label="Box color">
            <input value={overlay.boxcolor || ""} onChange={(e) => set("boxcolor", e.target.value)} />
          </Field>

          <Field label="Box border width">
            <input type="number" min="0" value={overlay.boxborderw || 0} onChange={(e) => set("boxborderw", Number(e.target.value))} />
          </Field>
        </>
      )}

      {/* Audio/BGM specific */}
      {overlay.type === "audio" && (
        <>
          <Field label="Volume (0-1)">
            <input type="number" step="0.01" min="0" max="1" value={overlay.volume ?? 1} onChange={(e) => set("volume", Number(e.target.value))} />
          </Field>
          <Field label="Fade In (sec)">
            <input type="number" min="0" value={overlay.fade_in || 0} onChange={(e) => set("fade_in", Number(e.target.value))} />
          </Field>
          <Field label="Fade Out (sec)">
            <input type="number" min="0" value={overlay.fade_out || 0} onChange={(e) => set("fade_out", Number(e.target.value))} />
          </Field>
        </>
      )}
    </div>
  );
}
