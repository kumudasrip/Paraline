const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen } = require("electron");
const path = require("path");
const { createAudioBridge } = require("./audioBridge");
const { createSettingsStore } = require("./settingsStore");

let overlayWindow;
let audioBridge;
let fakeTimer;
let tray;
let isPaused = false;
let settingsStore;
let visualizerSettings;

const THEME_LABELS = {
  ambientWave: "Ambient Wave",
  reactiveBorder: "Reactive Border",
  flowBorder: "Flow Border"
};

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { bounds, workArea } = primaryDisplay;
  console.log("[debug] primary display", { bounds, workArea });

  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.setBounds(bounds);
  overlayWindow.moveTop();
  overlayWindow.loadFile("index.html");
  console.log("[debug] overlay bounds after create", overlayWindow.getBounds());
  overlayWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      sendVisualizerSettings();
    }, 100);
  });

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

function sendAudioLevel(value, source) {
  if (isPaused) {
    return;
  }

  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.send("audio-level", {
    value,
    source
  });
}

function getRendererSettings() {
  return {
    ...visualizerSettings,
    paused: isPaused
  };
}

function sendVisualizerSettings() {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.send("visualizer-settings", getRendererSettings());
}

function mergeSettingsPatch(currentSettings, patch) {
  const mergedSettings = { ...currentSettings };

  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      mergedSettings[key] = {
        ...(currentSettings[key] || {}),
        ...value
      };
      continue;
    }

    mergedSettings[key] = value;
  }

  return mergedSettings;
}

function updateSettings(nextSettings) {
  visualizerSettings = settingsStore.save(mergeSettingsPatch(visualizerSettings, nextSettings));

  sendVisualizerSettings();
  refreshTrayMenu();
}

function togglePaused() {
  isPaused = !isPaused;
  sendVisualizerSettings();
  refreshTrayMenu();
}

function startSimulatedAudioFallback() {
  stopSimulatedAudioFallback();

  fakeTimer = setInterval(() => {
    const now = Date.now();
    const level = 0.15 + (Math.sin(now * 0.001 * 0.45) + 1) * 0.08;
    sendAudioLevel(level, "simulated");
  }, 33);
}

function stopSimulatedAudioFallback() {
  if (fakeTimer) {
    clearInterval(fakeTimer);
    fakeTimer = null;
  }
}

function resizeOverlayToPrimaryDisplay() {
  if (!overlayWindow) {
    return;
  }

  const { bounds } = screen.getPrimaryDisplay();
  overlayWindow.setBounds(bounds);
  console.log("[debug] overlay bounds after resize", overlayWindow.getBounds());
}

function createTrayIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#0e1a24"/>
      <path d="M12 40C18 40 18 24 24 24C30 24 30 48 36 48C42 48 42 18 52 18" fill="none" stroke="#8ee2ff" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 46C18 46 18 34 24 34C30 34 30 54 36 54C42 54 42 28 52 28" fill="none" stroke="#ffd2eb" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
    </svg>
  `;

  return nativeImage
    .createFromDataURL(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`)
    .resize({ width: 16, height: 16 });
}

function buildMainThemeMenuItems() {
  const themeOptions = [
    { value: "ambientWave", label: "Ambient Wave" },
    { value: "reactiveBorder", label: "Reactive Border" },
    { value: "flowBorder", label: "Flow Border" }
  ];

  return themeOptions.map((themeOption) => ({
    label: themeOption.label,
    type: "radio",
    checked: visualizerSettings.selectedTheme === themeOption.value,
    click: () => updateSettings({ selectedTheme: themeOption.value })
  }));
}

function buildAmbientWaveMenuItems() {
  const ambientSettings = visualizerSettings.ambientWave;

  return [
    {
      label: "Ambient Wave Settings",
      enabled: false
    },
    {
      label: "Tone",
      submenu: [
        { label: "Blue", value: "blue" },
        { label: "Purple", value: "purple" },
        { label: "Warm", value: "warm" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: ambientSettings.tone === option.value,
        click: () => updateSettings({ ambientWave: { tone: option.value } })
      }))
    },
    {
      label: "Sensitivity",
      submenu: ["low", "medium", "high"].map((level) => ({
        label: level[0].toUpperCase() + level.slice(1),
        type: "radio",
        checked: ambientSettings.sensitivity === level,
        click: () => updateSettings({ ambientWave: { sensitivity: level } })
      }))
    },
    {
      label: "Edge Mode",
      submenu: ["top", "bottom", "both"].map((edgeMode) => ({
        label: edgeMode[0].toUpperCase() + edgeMode.slice(1),
        type: "radio",
        checked: ambientSettings.edgeMode === edgeMode,
        click: () => updateSettings({ ambientWave: { edgeMode } })
      }))
    },
    {
      label: "Glow Strength",
      submenu: ["soft", "medium", "strong"].map((strength) => ({
        label: strength[0].toUpperCase() + strength.slice(1),
        type: "radio",
        checked: ambientSettings.glowStrength === strength,
        click: () => updateSettings({ ambientWave: { glowStrength: strength } })
      }))
    }
  ];

function buildReactiveBorderMenuItems() {
  const reactiveSettings = visualizerSettings.reactiveBorder;

  return [
    {
      label: "Reactive Border Settings",
      enabled: false
    },
    {
      label: "Color Style",
      submenu: [
        { label: "Rainbow", value: "rainbow" },
        { label: "Neon Blue", value: "neonBlue" },
        { label: "Neon Purple", value: "neonPurple" },
        { label: "Warm Glow", value: "warmGlow" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: reactiveSettings.colorStyle === option.value,
        click: () => updateSettings({ reactiveBorder: { colorStyle: option.value } })
      }))
    },
    {
      label: "Intensity",
      submenu: ["low", "medium", "high"].map((level) => ({
        label: level[0].toUpperCase() + level.slice(1),
        type: "radio",
        checked: reactiveSettings.intensity === level,
        click: () => updateSettings({ reactiveBorder: { intensity: level } })
      }))
    },
    {
      label: "Border Thickness",
      submenu: [
        { label: "Thin", value: "thin" },
        { label: "Medium", value: "medium" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: reactiveSettings.borderThickness === option.value,
        click: () => updateSettings({ reactiveBorder: { borderThickness: option.value } })
      }))
    },
    {
      label: "Glow Strength",
      submenu: ["soft", "medium", "strong"].map((strength) => ({
        label: strength[0].toUpperCase() + strength.slice(1),
        type: "radio",
        checked: reactiveSettings.glowStrength === strength,
        click: () => updateSettings({ reactiveBorder: { glowStrength: strength } })
      }))
    }
  ];
}

function buildFlowBorderMenuItems() {
  const flowSettings = visualizerSettings.flowBorder;

  return [
    {
      label: "Flow Border Settings",
      enabled: false
    },
    {
      label: "Direction",
      submenu: [
        { label: "Clockwise", value: "clockwise" },
        { label: "Anticlockwise", value: "anticlockwise" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: flowSettings.direction === option.value,
        click: () => updateSettings({ flowBorder: { direction: option.value } })
      }))
    },
    {
      label: "Speed Mode",
      submenu: [
        { label: "Calm", value: "calm" },
        { label: "Balanced", value: "balanced" },
        { label: "Energetic", value: "energetic" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: flowSettings.speedMode === option.value,
        click: () => updateSettings({ flowBorder: { speedMode: option.value } })
      }))
    },
    {
      label: "Segment Length",
      submenu: [
        { label: "Short", value: "short" },
        { label: "Medium", value: "medium" },
        { label: "Long", value: "long" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: flowSettings.segmentLength === option.value,
        click: () => updateSettings({ flowBorder: { segmentLength: option.value } })
      }))
    },
    {
      label: "Glow Strength",
      submenu: ["soft", "medium", "strong"].map((strength) => ({
        label: strength[0].toUpperCase() + strength.slice(1),
        type: "radio",
        checked: flowSettings.glowStrength === strength,
        click: () => updateSettings({ flowBorder: { glowStrength: strength } })
      }))
    },
    {
      label: "Color Style",
      submenu: [
        { label: "Rainbow", value: "rainbow" },
        { label: "Cool", value: "cool" },
        { label: "Warm", value: "warm" }
      ].map((option) => ({
        label: option.label,
        type: "radio",
        checked: flowSettings.colorStyle === option.value,
        click: () => updateSettings({ flowBorder: { colorStyle: option.value } })
      }))
    }
  ];
}

function buildActiveThemeMenuItems() {
  if (visualizerSettings.selectedTheme === "reactiveBorder") {
    return buildReactiveBorderMenuItems();
  }

  if (visualizerSettings.selectedTheme === "flowBorder") {
    return buildFlowBorderMenuItems();
  }

  return buildAmbientWaveMenuItems();
}

function refreshTrayMenu() {
  if (!tray) {
    return;
  }

  const menu = Menu.buildFromTemplate([
    {
      label: isPaused ? "Resume Visualizer" : "Pause Visualizer",
      click: () => togglePaused()
    },
    {
      label: "Theme",
      submenu: buildThemeMenuItems()
    },
    {
      label: "Sensitivity",
      submenu: buildSensitivityMenuItems()
    },
    {
      label: "Edge Mode",
      submenu: buildEdgeModeMenuItems()
    },
    { type: "separator" },
    {
      label: "Quit App",
      click: () => app.quit()
    }
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip("Paraline Visualizer");
}

function createTray() {
  tray = new Tray(createTrayIcon());
  refreshTrayMenu();
}

app.whenReady().then(() => {
  console.log("[debug] app.whenReady");
  settingsStore = createSettingsStore(app.getPath("userData"));
  visualizerSettings = settingsStore.save(settingsStore.load());
  console.log("[debug] loaded settings", visualizerSettings);

  ipcMain.handle("audio-bridge-status", () => {
    if (!audioBridge) {
      return {
        mode: "simulated",
        reason: "Audio bridge not created yet."
      };
    }

    return audioBridge.getStatus();
  });

  ipcMain.handle("visualizer-settings:get", () => {
    return getRendererSettings();
  });

  createOverlayWindow();
  console.log("[debug] overlay window created");
  createTray();
  sendVisualizerSettings();

  audioBridge = createAudioBridge((value) => {
    stopSimulatedAudioFallback();
    sendAudioLevel(value, "helper");
  });
  audioBridge.start();
  startSimulatedAudioFallback();

  screen.on("display-metrics-changed", resizeOverlayToPrimaryDisplay);
  screen.on("display-added", resizeOverlayToPrimaryDisplay);
  screen.on("display-removed", resizeOverlayToPrimaryDisplay);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow();
    }
  });
});

app.on("web-contents-created", (_event, contents) => {
  contents.on("did-finish-load", () => {
    console.log("[debug] webContents did-finish-load");
  });

  contents.on("did-fail-load", (_loadEvent, errorCode, errorDescription) => {
    console.log("[debug] webContents did-fail-load", errorCode, errorDescription);
  });

  contents.on("render-process-gone", (_goneEvent, details) => {
    console.log("[debug] render-process-gone", details);
  });

  contents.on("console-message", (_consoleEvent, level, message, line, sourceId) => {
    console.log("[renderer]", { level, message, line, sourceId });
  });
});

app.on("window-all-closed", () => {
  if (audioBridge) {
    audioBridge.stop();
  }

  stopSimulatedAudioFallback();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
