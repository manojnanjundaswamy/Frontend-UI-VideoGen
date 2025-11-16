// utils/position.js (new)
export function centerExpr(xPercent = 0, yPercent = 0, isText = false) {
  // xPercent, yPercent are provided as numbers (e.g. 25, -25)
  const xp = (xPercent / 100).toFixed(4);
  // positive yPercent should move down in ffmpeg overlay => add formula without sign flip
  const yp = (yPercent / 100).toFixed(4);

  return {
    x: isText ? `(W-text_w)/2+(W*${xp})` : `(W-w)/2+(W*${xp})`,
    y: isText ? `(H-text_h)/2+(H*${yp})` : `(H-h)/2+(H*${yp})`
  };
}
