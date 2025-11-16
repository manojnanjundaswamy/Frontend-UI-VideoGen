export const overlayPresets = {
  cinematicSpectrum: {
    type: "video",
    url: "http://localhost:9000/youtube-automation/assets/spectrum_mic.mp4",
    scale: "500:-1",
    opacity: 90,
    x_offset_percent: 20,
    y_offset_percent: -25,
    layer: 1
  },
  logoWatermark: {
    type: "image",
    url: "http://localhost:9000/youtube-automation/assets/logo.png",
    scale: "150:-1",
    opacity: 40,
    x_offset_percent: 45,
    y_offset_percent: 40,
    layer: 2
  },
  bgFull: {
    type: "image",
    url: "http://localhost:9000/youtube-automation/assets/bg_1920x1080.png",
    scale: "1920:1080",
    opacity: 100,
    x_offset_percent: 0,
    y_offset_percent: 0,
    layer: 0
  }
};
