class ThemeAgent {
  constructor(settingsStore, applyThemeCallback) {
    this.settingsStore = settingsStore;
    this.applyThemeCallback = applyThemeCallback;
    this.intervalId = null;
  }

  start() {
    this.stop(); 
    const config = this.settingsStore.load().themeAutomation;
    
    if (!config || !config.enabled) return;

    // Convert minutes to milliseconds for the background timer
    const intervalMs = (config.checkIntervalMinutes || 30) * 60 * 1000;
    this.evaluateAndApplyTheme(config);
    
    this.intervalId = setInterval(() => {
      // FIXED: Swapped .get() for .load()
      const currentConfig = this.settingsStore.load().themeAutomation;
      this.evaluateAndApplyTheme(currentConfig);
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  evaluateAndApplyTheme(config) {
    if (!config.enabled) return;

    try {
      const currentHour = new Date().getHours();
      const isDaytime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM
      const targetTheme = isDaytime ? config.dayTheme : config.nightTheme;

      // FIXED: Swapped .get() for .load().selectedTheme
      if (targetTheme && this.settingsStore.load().selectedTheme !== targetTheme) {
        console.log(`[ThemeAgent] Switching theme to: ${targetTheme}`); 
        this.applyThemeCallback(targetTheme);
      }
    } catch (error) {
      console.error("ThemeAgent failed to evaluate time-based theme.", error);
    }
  }
}

module.exports = ThemeAgent;