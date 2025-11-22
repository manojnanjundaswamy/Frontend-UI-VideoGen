// src/components/CanvasView.jsx
import React from 'react';
import useEditorStore from '../store/useEditorStore';
import { ffScaleToPx, percentToPx } from '../utils/ffmpegHelpers';

export default function CanvasView() {
  const meta = useEditorStore(s => s.meta) || { resolution: '1920:1080', fps: 30 };
  // safe read of overlays - ensure array
  const overlaysRaw = useEditorStore(s => s.overlays);
  const overlays = Array.isArray(overlaysRaw) ? overlaysRaw : (overlaysRaw ? Object.values(overlaysRaw) : []);
  const selectedOverlayId = useEditorStore(s => s.selectedOverlayId);
  const selectOverlay = useEditorStore(s => s.selectOverlay);

  const resolution = meta.resolution || '1920:1080';
  const [resW, resH] = resolution.split(':').map(n => parseInt(n, 10) || 1920);
  // preview container size used for mapping
  const previewMax = 480;

  return (
    <div className="relative bg-black rounded overflow-hidden border border-slate-700" style={{ paddingTop: `${(resH / resW) * 100}%` }}>
      <div className="absolute inset-0">
        {/* faint grid */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div></div><div></div><div></div><div></div>
        </div>

        {overlays.map(o => {
          const computed = ffScaleToPx(o.scale, o.scaleFactor, resW, resH, previewMax);
          const left = percentToPx(o.x_offset_percent, previewMax, 'x');
          const top = percentToPx(o.y_offset_percent, previewMax, 'y');

          // determine position around center
          const style = {
            left: `calc(50% + ${left}px - ${computed.width / 2}px)`,
            top: `calc(50% - ${top}px - ${computed.height / 2}px)`,
            width: `${computed.width}px`,
            height: `${computed.height}px`
          };

          return (
            <div
              key={o.id}
              onClick={() => selectOverlay(o.id)}
              className={`absolute border-2 ${o.id === selectedOverlayId ? 'border-cyan-400' : 'border-white/10'} rounded overflow-hidden bg-slate-900/20`}
              style={style}
            >
              {o.type === 'image' && o.url ? (
                <img src={o.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  {o.type}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
