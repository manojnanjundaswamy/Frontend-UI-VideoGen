// Helper to convert ffmpeg scale strings or scaleFactor to preview width/height in px
export function ffScaleToPx(scaleStr, scaleFactor = 1, resW = 1920, resH = 1080, previewMax = 360) {
  let width = previewMax * 0.5;
  let height = previewMax * 0.25;
  if (scaleStr && typeof scaleStr === 'string' && scaleStr.includes(':')) {
    const [sw, sh] = scaleStr.split(':');
    // accept numeric or "iw*0.25" style
    if (!isNaN(Number(sw)) && !isNaN(Number(sh))) {
      // absolute px in ffmpeg space -> map to preview scale
      const pxW = Number(sw);
      const pxH = Number(sh);
      const scale = Math.min(previewMax / Math.max(pxW, pxH), 1);
      width = pxW * scale;
      height = pxH * scale;
    } else if (sw.includes('iw') || sh.includes('ih')) {
      // parse factors
      // fallback: use scaleFactor
      const f = scaleFactor || 0.25;
      width = previewMax * f * 4;
      height = previewMax * f * 2;
    }
  } else {
    // fallback to scaleFactor mapping
    const f = (scaleFactor && scaleFactor > 0) ? scaleFactor : 0.25;
    width = previewMax * f * 4;
    height = previewMax * f * 2;
  }
  // clamp
  width = Math.max(24, Math.min(previewMax, width));
  height = Math.max(24, Math.min(previewMax, height));
  return { width, height };
}

export function percentToPx(percent = 0, previewMax = 360, axis = 'x') {
  // percent expected in -100..100 range; map to px relative to previewMax
  const p = Number(percent) || 0;
  const max = previewMax / 2;
  // user input: positive x->right, positive y->up
  return (p / 100) * max;
}
