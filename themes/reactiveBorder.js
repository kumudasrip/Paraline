(() => {
  const {
    getGlowMultiplier,
    resolveAnimatedColor,
    hexToHsl,
    applyOptimizedShadow,
    getPerformanceMultiplier
  } = window.ParalineShared;

  const RAINBOW_BORDER_INSET = 0;
  const RAINBOW_SEGMENT_LENGTH = 72;

  const REACTIVE_BORDER_STYLES = {
    rainbow: { mode: "rainbow", saturation: 92, lightness: 64 },
    neonBlue: { mode: "range", hueA: 192, hueB: 220, saturation: 98, lightness: 66 },
    neonPurple: { mode: "range", hueA: 270, hueB: 304, saturation: 98, lightness: 70 },
    warmGlow: { mode: "range", hueA: 22, hueB: 48, saturation: 96, lightness: 68 }
  };

  function getReactiveColorStyle(settings) {
    if (settings.colorStyle === "custom" && settings.customColors && settings.customColors.length >= 2) {
      const hsl1 = hexToHsl(settings.customColors[0]);
      const hsl2 = hexToHsl(settings.customColors[1]);
      return { mode: "range", hueA: hsl1.h, hueB: hsl2.h, saturation: hsl1.s, lightness: hsl1.l };
    }
    return REACTIVE_BORDER_STYLES[settings.colorStyle] || REACTIVE_BORDER_STYLES.rainbow;
  }

  function getReactiveIntensityMultiplier(settings) {
    if (settings.intensity === "low") {
      return 0.82;
    }

    if (settings.intensity === "high") {
      return 1.26;
    }

    return 1;
  }

  function getReactiveInputMultiplier(settings = {}) {
    let base = 2.4;
    if (settings.intensity === "low") base = 1.6;
    if (settings.intensity === "high") base = 3.4;

    if (settings.intensity === "custom" && typeof settings.customSensitivity === "number") {
      return base * (settings.customSensitivity / 30);
    }
    return base;
  }

  function drawReactiveBorderEdge(context, options) {
    const {
      x1,
      y1,
      x2,
      y2,
      startDistance,
      perimeter,
      colorStyle,
      hueOffset,
      thickness,
      glowBlur,
      opacity,
      performanceMode = 'balanced'
    } = options;

    const edgeLength = Math.hypot(x2 - x1, y2 - y1);
    const segmentCount = Math.max(1, Math.ceil(edgeLength / RAINBOW_SEGMENT_LENGTH));
    const perfMultiplier = getPerformanceMultiplier(performanceMode);
    const optimizedBlur = glowBlur * perfMultiplier;

    for (let index = 0; index < segmentCount; index++) {
      const startT = index / segmentCount;
      const endT = (index + 1) / segmentCount;
      const sx = x1 + (x2 - x1) * startT;
      const sy = y1 + (y2 - y1) * startT;
      const ex = x1 + (x2 - x1) * endT;
      const ey = y1 + (y2 - y1) * endT;
      const normalizedDistance = (startDistance + edgeLength * ((startT + endT) * 0.5)) / perimeter;
      const color = resolveAnimatedColor(colorStyle, normalizedDistance, hueOffset, opacity);

      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(ex, ey);
      context.strokeStyle = color;
      context.lineWidth = thickness;
      
      applyOptimizedShadow(context, color, optimizedBlur, performanceMode);
      
      context.stroke();
    }
  }

  function drawReactiveBorder(options) {
    const {
      context,
      width,
      height,
      time,
      smoothedLevel,
      settings,
      performanceMode = 'balanced'
    } = options;

    const reactiveStyle = getReactiveColorStyle(settings);
    const intensityMultiplier = getReactiveIntensityMultiplier(settings);
    const glowMultiplier = getGlowMultiplier(settings.glowStrength);
    const thicknessBase = settings.borderThickness === "thick"
      ? 4.25
      : settings.borderThickness === "medium"
        ? 3
        : 2.15;
    const thickness = thicknessBase + smoothedLevel * 1.15 * intensityMultiplier;
    const edgeOffset = Math.max(1, thickness * 0.5) + 1;
    const left = RAINBOW_BORDER_INSET;
    const top = RAINBOW_BORDER_INSET;
    const right = Math.max(left + 1, width - edgeOffset);
    const bottom = Math.max(top + 1, height - edgeOffset);
    const horizontal = right - left;
    const vertical = bottom - top;
    const perimeter = horizontal * 2 + vertical * 2;
    const speed = 32 + smoothedLevel * 180 * intensityMultiplier;
    const hueOffset = time * speed;
    const glowBlur = (7 + smoothedLevel * 10) * glowMultiplier;
    const opacity = 0.54 + smoothedLevel * 0.18 * intensityMultiplier;

    context.globalAlpha = 1;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255, 255, 255, 0.06)";
    context.lineWidth = thickness + 0.8;
    context.strokeRect(left, top, horizontal, vertical);

    drawReactiveBorderEdge(context, { x1: left, y1: top, x2: right, y2: top, startDistance: 0, perimeter, colorStyle: reactiveStyle, hueOffset, thickness, glowBlur, opacity, performanceMode });
    drawReactiveBorderEdge(context, { x1: right, y1: top, x2: right, y2: bottom, startDistance: horizontal, perimeter, colorStyle: reactiveStyle, hueOffset, thickness, glowBlur, opacity, performanceMode });
    drawReactiveBorderEdge(context, { x1: right, y1: bottom, x2: left, y2: bottom, startDistance: horizontal + vertical, perimeter, colorStyle: reactiveStyle, hueOffset, thickness, glowBlur, opacity, performanceMode });
    drawReactiveBorderEdge(context, { x1: left, y1: bottom, x2: left, y2: top, startDistance: horizontal * 2 + vertical, perimeter, colorStyle: reactiveStyle, hueOffset, thickness, glowBlur, opacity, performanceMode });
  }

  window.ParalineReactiveBorder = {
    getReactiveInputMultiplier,
    drawReactiveBorder
  };
})();
