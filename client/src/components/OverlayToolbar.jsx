// components/OverlayToolbar.jsx
import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import AddOverlayModal from './AddOverlayModal';

export default function OverlayToolbar() {
  const addOverlay = useEditorStore(state => state.addOverlay);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState('image');

  const onAdd = (payload) => {
    addOverlay(payload);
    setOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={() => { setType('image'); setOpen(true); }}>
          Add Image
        </button>
        <button className="btn btn-primary" onClick={() => { setType('video'); setOpen(true); }}>
          Add Video
        </button>
        <button className="btn btn-primary" onClick={() => { setType('text'); setOpen(true); }}>
          Add Text
        </button>
        <button className="btn btn-primary" onClick={() => { setType('audio'); setOpen(true); }}>
          Add Music
        </button>
        <button className="btn btn-outline" onClick={() => {
          // add a default chapter animation overlay template
          addOverlay({
            id: `chapter_anim_${Date.now()}`,
            type: 'chapter_anim',
            enable: true,
            font: '/app/fonts/ComicNeue-BoldItalic.ttf',
            fontcolor: 'white',
            fontsize: 72,
            x_offset_percent: 0,
            y_offset_percent: 0,
            layer: 100
          });
        }}>
          Add Chapter Anim
        </button>
      </div>

      {open && <AddOverlayModal type={type} onClose={() => setOpen(false)} onAdd={onAdd} />}
    </>
  );
}
