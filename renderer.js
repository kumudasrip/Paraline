const canvas = document.getElementById("visualizer");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let deviceScale = 1;
let time = 0;
let smoothedLevel = 0.24;
let incomingLevel = 0.24;
let latestSource = "waiting";
let bridgeMode = "unknown";
let bridgeReason = "Waiting for bridge status...";
let lastPayloadValue = 0.24;
let debugPanel;
let lastDebugPaintAt = 0;

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

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function createDebugPanel() {
  debugPanel = document.createElement("div");
  debugPanel.id = "debug-panel";
  debugPanel.style.position = "fixed";
  debugPanel.style.top = "16px";
  debugPanel.style.left = "16px";
  debugPanel.style.padding = "10px 12px";
  debugPanel.style.border = "1px solid rgba(255, 255, 255, 0.16)";
  debugPanel.style.borderRadius = "10px";
  debugPanel.style.background = "rgba(8, 12, 20, 0.42)";
  debugPanel.style.color = "rgba(225, 240, 255, 0.92)";
  debugPanel.style.font = "12px/1.45 Consolas, monospace";
  debugPanel.style.whiteSpace = "pre-line";
  debugPanel.style.pointerEvents = "none";
  debugPanel.style.zIndex = "9999";
  debugPanel.style.backdropFilter = "blur(10px)";
  debugPanel.textContent = "TEMP DEBUG\nWaiting for audio bridge...";
  document.body.appendChild(debugPanel);
}

function paintDebugPanel(now) {
  if (!debugPanel || now - lastDebugPaintAt < 120) {
    return;
  }

  lastDebugPaintAt = now;
  debugPanel.textContent =
    "TEMP DEBUG\n" +
    `bridge: ${bridgeMode}\n` +
    `source: ${latestSource}\n` +
    `incoming: ${lastPayloadValue.toFixed(4)}\n` +
    `smoothed: ${smoothedLevel.toFixed(4)}\n` +
    `reason: ${bridgeReason}`;
}

async function refreshBridgeStatus() {
  if (!window.audioBridge || typeof window.audioBridge.getStatus !== "function") {
    bridgeMode = "unavailable";
    bridgeReason = "window.audioBridge.getStatus is unavailable.";
    return;
  }

  try {
    const status = await window.audioBridge.getStatus();
    bridgeMode = status?.mode || "unknown";
    bridgeReason = status?.reason || "No bridge reason provided.";
  } catch (error) {
    bridgeMode = "status-error";
    bridgeReason = error?.message || "Failed to read bridge status.";
  }
}

function resizeCanvas() {
  deviceScale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * deviceScale);
  canvas.height = Math.floor(height * deviceScale);
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

function updateAudioLevel(now) {
  const helperDriven = latestSource === "helper";
  const breathing = helperDriven ? 0.003 : 0.028 * (Math.sin(now * 0.00023) + 1);
  const response = helperDriven ? 0.2 : 0.018;
  smoothedLevel += ((incomingLevel + breathing) - smoothedLevel) * response;
}

function drawWave(yBase, amplitude, frequency, speed, color, lineWidth, opacity) {
  context.beginPath();

  for (let x = 0; x <= width; x += 14) {
    const waveA = Math.sin(x * frequency + time * speed);
    const waveB = Math.sin(x * frequency * 0.42 - time * speed * 0.52);
    const lift = (waveA + waveB) * amplitude;
    const y = yBase + lift;

    if (x === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.globalAlpha = opacity;
  context.shadowBlur = 22 + amplitude * 0.45;
  context.shadowColor = color;
  context.stroke();
}

function drawGlowBand() {
  const edgeFade = context.createLinearGradient(0, 0, 0, height);
  edgeFade.addColorStop(0, theme.hazeTop);
  edgeFade.addColorStop(0.16, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(0.5, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(0.84, "rgba(0, 0, 0, 0)");
  edgeFade.addColorStop(1, theme.hazeBottom);

  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.fillStyle = edgeFade;
  context.fillRect(0, 0, width, height);
}

function drawSoftFill(yBase, amplitude, frequency, speed, color, thickness) {
  const gradient = context.createLinearGradient(0, yBase - thickness, 0, yBase + thickness);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.beginPath();
  context.moveTo(0, yBase);

  for (let x = 0; x <= width; x += 18) {
    const waveA = Math.sin(x * frequency + time * speed);
    const waveB = Math.sin(x * frequency * 0.35 - time * speed * 0.45);
    context.lineTo(x, yBase + (waveA + waveB) * amplitude);
  }

  context.lineTo(width, yBase + thickness);
  context.lineTo(0, yBase + thickness);
  context.closePath();

  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.fillStyle = gradient;
  context.fill();
}

function renderFrame(now) {
  time += 0.016;
  updateAudioLevel(now);

  context.clearRect(0, 0, width, height);
  drawGlowBand();

  const helperDriven = latestSource === "helper";
  const topBase = 62 + smoothedLevel * 18;
  const bottomBase = height - 62 - smoothedLevel * 18;
  const primaryAmplitude = helperDriven ? 8 + smoothedLevel * 38 : 5 + smoothedLevel * 12;
  const secondaryAmplitude = helperDriven ? 3 + smoothedLevel * 16 : 2 + smoothedLevel * 6;

  drawSoftFill(topBase, primaryAmplitude * 1.1, 0.0075, 0.38, theme.topGlow, 44);
  drawSoftFill(bottomBase, primaryAmplitude * 0.9, 0.007, 0.32, theme.bottomGlow, 40);

  drawWave(topBase, primaryAmplitude, 0.0105, 0.44, theme.topLine, 1.4, 0.8);
  drawWave(topBase + 8, secondaryAmplitude, 0.014, 0.58, theme.topGlow, 1, 0.34);

  drawWave(bottomBase, primaryAmplitude * 0.9, 0.0102, 0.34, theme.bottomLine, 1.25, 0.68);
  drawWave(bottomBase - 8, secondaryAmplitude, 0.013, 0.48, theme.bottomGlow, 0.9, 0.28);

  context.globalAlpha = 1;
  context.shadowBlur = 0;
  paintDebugPanel(now);

  requestAnimationFrame(renderFrame);
}

window.addEventListener("resize", resizeCanvas);

if (window.audioBridge) {
  window.audioBridge.onLevel((payload) => {
    if (payload && typeof payload.value === "number") {
      latestSource = payload.source || "unknown";
      lastPayloadValue = payload.value;
      incomingLevel = latestSource === "helper"
        ? clamp01(payload.value * 3.2)
        : clamp01(payload.value);
    }
  });
}

createDebugPanel();
refreshBridgeStatus();
setInterval(refreshBridgeStatus, 1000);

resizeCanvas();
requestAnimationFrame(renderFrame);
