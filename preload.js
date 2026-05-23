const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("audioBridge", {
  onLevel(listener) {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("audio-level", wrapped);

    return () => {
      ipcRenderer.removeListener("audio-level", wrapped);
    };
  },
  getStatus() {
    return ipcRenderer.invoke("audio-bridge-status");
  }
});

contextBridge.exposeInMainWorld("visualizerSettings", {
  onChange(listener) {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("visualizer-settings", wrapped);

    return () => {
      ipcRenderer.removeListener("visualizer-settings", wrapped);
    };
  },
  get() {
    return ipcRenderer.invoke("visualizer-settings:get");
  },
  update(patch) {
    ipcRenderer.send("visualizer-settings:update", patch);
  },
  action(action, data) {
    ipcRenderer.send("visualizer-action", { action, data });
  },
  setIgnoreMouseEvents(ignore) {
    ipcRenderer.send("set-ignore-mouse-events", ignore);
  },
  onShowMenu(listener) {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("show-context-menu", wrapped);

    return () => {
      ipcRenderer.removeListener("show-context-menu", wrapped);
    };
    return ipcRenderer.invoke("visualizer-settings:update", patch);
  }
});

contextBridge.exposeInMainWorld("paralineApp", {
  togglePause: () => ipcRenderer.invoke("app:toggle-pause"),
  reloadVisualizer: () => ipcRenderer.invoke("app:reload-visualizer"),
  openExternal: (url) => ipcRenderer.invoke("app:open-external", url)
});
