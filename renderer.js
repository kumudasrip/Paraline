const canvas = document.getElementById("visualizer");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let deviceScale = 1;
let time = 0;
let smoothedLevel = 0.24;
let incomingLevel = 0.24;

const THEMES = {
  blue: {
    topLine: "rgba(145, 220, 255, 0.34)",
    topGlow: "rgba(120, 205, 255, 0.12)",
    bottomLine: "rgba(168, 232, 255, 0.22)",
    bottomGlow: "rgba(120, 205, 255, 0.08)",
    hazeTop: "rgba(115, 200, 255, 0.10)",
    hazeBottom: "rgba(115, 200, 255, 0.06)"
  },
  purple: {
    topLine: "rgba(202, 168, 255, 0.32)",
    topGlow: "rgba(180, 140, 255, 0.12)",
    bottomLine: "rgba(232, 196, 255, 0.20)",
    bottomGlow: "rgba(180, 140, 255, 0.08)",
    hazeTop: "rgba(186, 146, 255, 0.10)",
    hazeBottom: "rgba(186, 146, 255, 0.06)"
  },
  warm: {
    topLine: "rgba(255, 208, 156, 0.32)",
    topGlow: "rgba(255, 188, 128, 0.12)",
    bottomLine: "rgba(255, 224, 196, 0.20)",
    bottomGlow: "rgba(255, 188, 128, 0.08)",
    hazeTop: "rgba(255, 190, 124, 0.10)",
    hazeBottom: "rgba(255, 190, 124, 0.06)"
  }
};

const params = new URLSearchParams(window.location.search);
const themeName = params.get("theme") || "blue";
const theme = THEMES[themeName] || THEMES.blue;

function resizeCanvas() {
  deviceScale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * deviceScale);
  canvas.height = Math.floor(height * deviceScale);
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

