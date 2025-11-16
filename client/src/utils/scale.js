// utils/scale.js
export function canonicalScale(o, metaDefault = "600:-1") {
  // Prefer explicit ffmpeg-style scale string
  if (o.scale && typeof o.scale === "string") return o.scale;
  // If numeric scale_factor present
  if (o.scale_factor != null && !isNaN(+o.scale_factor)) {
    const f = +o.scale_factor;
    if (f === 1) return undefined; // no scaling needed
    return `iw*${f}:ih*${f}`;
  }
  // fallback
  return metaDefault;
}

// If you need a UI-friendly preview width/height to compute canvas presentation,
// compute a displayed size from scale when scale is "1920:1080" or "500:-1"
export function computeDisplaySize(scaleStr, sourceW = 1920, sourceH = 1080) {
  if (!scaleStr) return { w: sourceW, h: sourceH };
  if (scaleStr.includes("iw") || scaleStr.includes(":")) {
    // Only support basic numeric or iw*X forms for display
    if (/^(\d+):(\d+)$/.test(scaleStr)) {
      const [w, h] = scaleStr.split(":").map(Number);
      return { w, h };
    }
    if (/^iw\*(\d*\.?\d+):ih\*\1$/.test(scaleStr)) {
      const f = parseFloat(scaleStr.match(/^iw\*(\d*\.?\d+):ih\*\1$/)[1]);
      return { w: Math.round(sourceW * f), h: Math.round(sourceH * f) };
    }
  }
  // fallback
  return { w: sourceW, h: sourceH };
}
