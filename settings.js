document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // TAB SWITCHING
    // ----------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.getAttribute('data-target')).classList.add('active');
        });
    });

    // ----------------------------------------
    // THEME SCHEMA & DYNAMIC UI GENERATION
    // ----------------------------------------
    const THEMES_SCHEMA = {
        ambientWave: {
            tone: { label: "Tone", options: ["blue", "purple", "warm", "custom"] },
            sensitivity: { label: "Sensitivity", options: ["low", "medium", "high", "custom"] },
            edgeMode: { label: "Edge Mode", options: ["top", "bottom", "both"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] }
        },
        reactiveBorder: {
            colorStyle: { label: "Color Style", options: ["rainbow", "neonBlue", "neonPurple", "warmGlow", "custom"] },
            intensity: { label: "Intensity", options: ["low", "medium", "high", "custom"] },
            borderThickness: { label: "Border Thickness", options: ["thin", "medium", "thick", "custom"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] }
        },
        flowBorder: {
            colorStyle: { label: "Color Style", options: ["rainbow", "cool", "warm", "custom"] },
            direction: { label: "Direction", options: ["clockwise", "anticlockwise"] },
            speedMode: { label: "Speed Mode", options: ["calm", "balanced", "energetic", "custom"] },
            segmentLength: { label: "Segment Length", options: ["short", "medium", "long", "custom"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] }
        },
        sideBars: {
            colorStyle: { label: "Color Style", options: ["white", "yellow", "aqua", "multicolor", "custom"] },
            barThickness: { label: "Bar Thickness", options: ["thin", "medium", "thick", "custom"] },
            sensitivity: { label: "Sensitivity", options: ["low", "medium", "high", "custom"] },
            barDensity: { label: "Bar Density", options: ["low", "medium", "high", "custom"] }
        },
        flatRipples: {
            mode: { label: "Mode", options: ["sideRipples", "flatRipples"] },
            intensity: { label: "Intensity", options: ["low", "medium", "high", "custom"] },
            colorStyle: { label: "Color Style", options: ["red", "blue", "white", "multicolor", "custom"] },
            speed: { label: "Speed", options: ["calm", "balanced", "energetic", "custom"] }
        },
        dotParticles: {
            density: { label: "Density", options: ["low", "medium", "high", "custom"] },
            motionStyle: { label: "Motion Style", options: ["calm", "balanced", "energetic", "custom"] },
            directionBehavior: { label: "Direction Behavior", options: ["mostlyClockwise", "mostlyAnticlockwise", "beatReactive"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] }
        },
        rippleFlow: {
            mode: { label: "Mode", options: ["sideRipples", "flatRipples"] },
            intensity: { label: "Intensity", options: ["low", "medium", "high", "custom"] },
            sensitivity: { label: "Sensitivity", options: ["low", "medium", "high", "custom"] },
            colorStyle: { label: "Color Style", options: ["red", "blue", "white", "custom"] }
        },
        snowBubbleParticles: {
            fallArea: { label: "Fall Area", options: ["middle", "fullWidth"] },
            density: { label: "Density", options: ["low", "medium", "high", "custom"] },
            motionStyle: { label: "Motion Style", options: ["calm", "balanced", "energetic", "custom"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] },
            particleSize: { label: "Particle Size", options: ["small", "medium", "large", "custom"] }
        },
        edgeCrystals: {
            colorStyle: { label: "Color Style", options: ["blue", "purple", "red", "white", "custom"] },
            flutterStyle: { label: "Flutter Style", options: ["soft", "balanced", "energetic", "custom"] },
            density: { label: "Density", options: ["low", "medium", "high", "custom"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] },
            edgeMode: { label: "Edge Mode", options: ["left", "right", "both"] }
        },
        sideBraids: {
            colorStyle: { label: "Color Style", options: ["cyanPink", "bluePurple", "redBlue", "white", "custom"] },
            braidDensity: { label: "Braid Density", options: ["sparse", "medium", "dense", "custom"] },
            motionStyle: { label: "Motion Style", options: ["calm", "balanced", "energetic", "custom"] },
            glowStrength: { label: "Glow Strength", options: ["soft", "medium", "strong", "custom"] },
            braidWidth: { label: "Braid Width", options: ["thin", "medium", "thick", "custom"] },
            flowDirection: { label: "Flow Direction", options: ["topDown", "bottomUp"] }
        }
    };

    let cachedSettings = {};

    function renderThemeSettings(themeId) {
        const container = document.getElementById('dynamic-theme-settings');
        container.innerHTML = '';
        const schema = THEMES_SCHEMA[themeId];
        if (!schema) return;
        
        const currentThemeObj = cachedSettings[themeId] || {};

        for (const [key, prop] of Object.entries(schema)) {
            const div = document.createElement('div');
            div.className = 'input-group';
            div.style.marginBottom = '16px';
            
            const label = document.createElement('label');
            label.textContent = prop.label;
            div.appendChild(label);
            
            const select = document.createElement('select');
            select.className = 'styled-select theme-trigger';
            select.dataset.key = key;
            
            for (const opt of prop.options) {
                const option = document.createElement('option');
                option.value = opt;
                // capitalize first letter and format camelCase
                let humanStr = opt.replace(/([A-Z])/g, ' $1');
                humanStr = humanStr.charAt(0).toUpperCase() + humanStr.slice(1);
                option.textContent = humanStr;
                select.appendChild(option);
            }
            
            if (currentThemeObj[key]) {
                select.value = currentThemeObj[key];
            }
            
            select.addEventListener('change', dispatchThemeUpdate);
            
            div.appendChild(select);
            container.appendChild(div);
        }
        
        updateAdvancedSliders(themeId);
    }

    function updateAdvancedSliders(theme) {
        const customThickness = document.getElementById('container-customThickness');
        const customGap = document.getElementById('container-customGap');
        const customSensitivity = document.getElementById('container-customSensitivity');
        const customSpeed = document.getElementById('container-customSpeed');
        
        const schema = THEMES_SCHEMA[theme];
        let showThick = false, showGap = false, showSens = false, showSpeed = false;
        
        if (schema) {
            if ('barThickness' in schema || 'borderThickness' in schema || 'segmentLength' in schema || 'particleSize' in schema || 'braidWidth' in schema) {
                showThick = true;
                document.getElementById('label-customThickness').textContent = 
                    'barThickness' in schema ? "Bar Thickness" :
                    'borderThickness' in schema ? "Border Thickness" :
                    'segmentLength' in schema ? "Segment Length" :
                    'braidWidth' in schema ? "Braid Thickness" : "Particle Size";
            }
            
            if ('barDensity' in schema || 'density' in schema || 'braidDensity' in schema) {
                showGap = true;
                document.getElementById('label-customGap').textContent = 
                    'barDensity' in schema ? "Bar Gap" :
                    'braidDensity' in schema ? "Braid Density" : "Density Gap";
            }
            
            if ('sensitivity' in schema || 'intensity' in schema || 'speed' in schema || 'speedMode' in schema || 'motionStyle' in schema || 'flutterStyle' in schema) {
                showSens = true;
                document.getElementById('label-customSensitivity').textContent = 
                    'sensitivity' in schema ? "Sensitivity" :
                    'intensity' in schema ? "Intensity" :
                    'flutterStyle' in schema ? "Flutter Energy" : "Speed / Motion";
            }

            if ('speed' in schema || 'speedMode' in schema || 'motionStyle' in schema || 'flutterStyle' in schema) {
                showSpeed = true;
                document.getElementById('label-customSpeed').textContent = 
                    'flutterStyle' in schema ? "Flutter Speed" : "Movement Speed";
            }
        }
        
        customThickness.style.display = showThick ? 'block' : 'none';
        customGap.style.display = showGap ? 'block' : 'none';
        customSensitivity.style.display = showSens ? 'block' : 'none';
        customSpeed.style.display = showSpeed ? 'block' : 'none';
    }

    const themeSelector = document.getElementById('theme-selector');
    themeSelector.addEventListener('change', (e) => {
        renderThemeSettings(e.target.value);
        
        // Also trigger an update to actually switch the active visualizer theme
        if (window.visualizerSettings) {
            window.visualizerSettings.update({
                selectedTheme: e.target.value
            });
        }
    });

    // ----------------------------------------
    // PRESET LOGIC (ADVANCED TAB)
    // ----------------------------------------
    const color1 = document.getElementById('color1');
    const color2 = document.getElementById('color2');
    const color3 = document.getElementById('color3');
    const presetSelector = document.getElementById('preset-selector');
    const savePresetBtn = document.getElementById('btn-save-preset');
    const presetNameInput = document.getElementById('preset-name-input');

    let presets = {
        "Ocean Blue": ["#00f2fe", "#4facfe", "#8ee2ff"],
        "Sunset": ["#ff512f", "#f09819", "#ffb347"],
        "Cyberpunk": ["#ff003c", "#bf00ff", "#00e5ff"]
    };

    // Load from local storage if available
    try {
        const savedPresets = localStorage.getItem('paraline_presets');
        if (savedPresets) presets = JSON.parse(savedPresets);
    } catch(e) {}

    function updatePresetDropdown() {
        presetSelector.innerHTML = '<option value="" disabled selected>Select Preset...</option>';
        Object.keys(presets).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            presetSelector.appendChild(option);
        });
    }

    function loadPreset(name) {
        if (presets[name]) {
            color1.value = presets[name][0];
            color2.value = presets[name][1];
            color3.value = presets[name][2];
            dispatchCustomUpdate(); // trigger auto-save
        }
    }

    presetSelector.addEventListener('change', (e) => {
        loadPreset(e.target.value);
    });

    savePresetBtn.addEventListener('click', () => {
        const presetName = presetNameInput.value.trim();
        if (presetName !== "") {
            presets[presetName] = [color1.value, color2.value, color3.value];
            updatePresetDropdown();
            presetSelector.value = presetName;
            presetNameInput.value = '';
            
            try {
                localStorage.setItem('paraline_presets', JSON.stringify(presets));
            } catch(e) {}
        }
    });

    updatePresetDropdown();

    // ----------------------------------------
    // SLIDER UPDATES
    // ----------------------------------------
    const thicknessSlider = document.getElementById('customThickness');
    const gapSlider = document.getElementById('customGap');
    const sensitivitySlider = document.getElementById('customSensitivity');
    const speedSlider = document.getElementById('customSpeed');
    
    thicknessSlider.addEventListener('input', (e) => {
        document.getElementById('val-customThickness').textContent = `${e.target.value}`;
        dispatchCustomUpdate();
    });
    gapSlider.addEventListener('input', (e) => {
        document.getElementById('val-customGap').textContent = `${e.target.value}`;
        dispatchCustomUpdate();
    });
    sensitivitySlider.addEventListener('input', (e) => {
        document.getElementById('val-customSensitivity').textContent = `${(e.target.value / 10).toFixed(1)}`;
        dispatchCustomUpdate();
    });
    speedSlider.addEventListener('input', (e) => {
        document.getElementById('val-customSpeed').textContent = `${(e.target.value / 10).toFixed(1)}`;
        dispatchCustomUpdate();
    });

    // ----------------------------------------
    // AUTO-SAVE / IPC INTEGRATION
    // ----------------------------------------

    function dispatchThemeUpdate() {
        if (!window.visualizerSettings) return;
        const selectedTheme = themeSelector.value;
        const dropdowns = document.querySelectorAll('#dynamic-theme-settings .theme-trigger');
        
        const themePatch = {};
        dropdowns.forEach(dd => {
            themePatch[dd.dataset.key] = dd.value;
        });

        if (!cachedSettings[selectedTheme]) cachedSettings[selectedTheme] = {};
        Object.assign(cachedSettings[selectedTheme], themePatch);

        window.visualizerSettings.update({
            selectedTheme: selectedTheme,
            [selectedTheme]: themePatch
        });
    }

    function dispatchCustomUpdate() {
        if (!window.visualizerSettings) return;
        const activeTheme = themeSelector.value;
        
        // Let's ensure the dropdown in the UI switches to "custom" if there's a colorStyle equivalent
        const themePatch = {};
        const schema = THEMES_SCHEMA[activeTheme];
        
        const colorKeys = ['tone', 'colorStyle'];
        const thickKeys = ['barThickness', 'borderThickness', 'segmentLength', 'particleSize', 'braidWidth'];
        const gapKeys = ['barDensity', 'density', 'braidDensity'];
        const sensKeys = ['sensitivity', 'intensity', 'speed', 'speedMode', 'motionStyle', 'flutterStyle'];

        colorKeys.forEach(k => { if (schema[k]) themePatch[k] = "custom"; });
        thickKeys.forEach(k => { if (schema[k]) themePatch[k] = "custom"; });
        gapKeys.forEach(k => { if (schema[k]) themePatch[k] = "custom"; });
        sensKeys.forEach(k => { if (schema[k]) themePatch[k] = "custom"; });

        themePatch.customColors = [ color1.value, color2.value, color3.value ];
        themePatch.customThickness = parseInt(thicknessSlider.value, 10);
        themePatch.customGap = parseInt(gapSlider.value, 10);
        themePatch.customSensitivity = parseInt(sensitivitySlider.value, 10);
        themePatch.customSpeed = parseInt(speedSlider.value, 10);

        // Update the cached settings so the UI dropdowns immediately reflect "Custom"
        if (schema.colorStyle) cachedSettings[activeTheme].colorStyle = "custom";
        if (schema.tone) cachedSettings[activeTheme].tone = "custom";
        renderThemeSettings(activeTheme); // Refresh UI dropdowns to show 'Custom' selected

        window.visualizerSettings.update({
            selectedTheme: activeTheme,
            [activeTheme]: themePatch,
            customColors: themePatch.customColors
        });
    }

    document.querySelectorAll('.custom-trigger').forEach(el => {
        if (el.type === 'color') {
            el.addEventListener('input', dispatchCustomUpdate); 
        }
    });

    // ----------------------------------------
    // ACTIONS & EXTERNAL LINKS
    // ----------------------------------------
    if (window.paralineApp) {
        const btnPause = document.getElementById('btn-pause');
        const btnReload = document.getElementById('btn-reload');
        const btnGithub = document.getElementById('btn-github');
        const btnLanding = document.getElementById('btn-landing');

        btnPause.addEventListener('click', async () => {
            const isPaused = await window.paralineApp.togglePause();
            if (isPaused) {
                btnPause.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Resume Visualizer
                `;
            } else {
                btnPause.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    Pause Visualizer
                `;
            }
        });

        btnReload.addEventListener('click', () => {
            window.paralineApp.reloadVisualizer();
        });

        btnGithub.addEventListener('click', () => {
            window.paralineApp.openExternal("https://github.com/SamXop123/Paraline");
        });
        btnLanding.addEventListener('click', () => {
            window.paralineApp.openExternal("https://paraline.vercel.app");
        });
    }

    // Load Initial State
    if (window.visualizerSettings) {
        window.visualizerSettings.get().then(settings => {
            cachedSettings = settings || {};
            
            if (settings.paused) {
                const btnPause = document.getElementById('btn-pause');
                btnPause.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Resume Visualizer
                `;
            }
            if (settings.selectedTheme) {
                themeSelector.value = settings.selectedTheme;
                renderThemeSettings(settings.selectedTheme);
            } else {
                renderThemeSettings("ambientWave");
            }
            
            // set custom variables into UI if they exist globally or on the active theme
            if (settings.customColors && settings.customColors.length === 3) {
                color1.value = settings.customColors[0];
                color2.value = settings.customColors[1];
                color3.value = settings.customColors[2];
            }
            
            const activeData = settings[settings.selectedTheme] || {};
            if (activeData.customThickness) thicknessSlider.value = activeData.customThickness;
            if (activeData.customGap) gapSlider.value = activeData.customGap;
            if (activeData.customSensitivity) sensitivitySlider.value = activeData.customSensitivity;
            if (activeData.customSpeed) speedSlider.value = activeData.customSpeed;
            
            document.getElementById('val-customThickness').textContent = thicknessSlider.value;
            document.getElementById('val-customGap').textContent = gapSlider.value;
            document.getElementById('val-customSensitivity').textContent = (sensitivitySlider.value / 10).toFixed(1);
            document.getElementById('val-customSpeed').textContent = (speedSlider.value / 10).toFixed(1);
        });
    } else {
        renderThemeSettings("ambientWave");
    }
});
