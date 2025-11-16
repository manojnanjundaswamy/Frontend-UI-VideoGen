// helpers to convert scale string and compute preview dimensions
export function parseScaleToPercent(scaleStr = "600:-1", baseRes = "1920:1080") {
  const [bw, bh] = baseRes.split(":").map(Number);
  if (!scaleStr) return { width: "auto", height: "auto" };
  const [w, h] = String(scaleStr).split(":");
  // -1 means auto
  const width = w && w !== "-1" ? `${(Number(w) / bw) * 100}%` : "auto";
  const height = h && h !== "-1" ? `${(Number(h) / bh) * 100}%` : "auto";
  return { width, height };
}
