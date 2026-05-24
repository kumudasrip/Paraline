(() => {
  const TRANSPARENT_HAZE = {
    hazeTop: "rgba(0, 0, 0, 0)",
    hazeBottom: "rgba(0, 0, 0, 0)"
  };

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function getGlowMultiplier(strength) {
    if (strength === "soft") {
      return 0.75;
    }

    if (strength === "strong") {
      return 2.0;
    }

    return 1;
  }

  function resolveAnimatedColor(style, normalizedDistance, animationOffset, opacity, lightnessBoost = 0) {
    if (style.mode === "rainbow") {
      return `hsla(${normalizedDistance * 360 + animationOffset}, ${style.saturation}%, ${style.lightness + lightnessBoost}%, ${opacity})`;
    }

    const hueBlend = Math.sin(normalizedDistance * Math.PI * 2 + animationOffset * 0.025) * 0.5 + 0.5;
    const hue = style.hueA + (style.hueB - style.hueA) * hueBlend;
    return `hsla(${hue}, ${style.saturation}%, ${style.lightness + lightnessBoost}%, ${opacity})`;
  }

  function drawWave(context, options) {
    const {
      width,
      time,
      yBase,
      amplitude,
      frequency,
      speed,
      color,
      lineWidth,
      opacity,
      glowScale = 1,
      invert = false
    } = options;

    const step = 20;
    const phaseA = time * speed;
    const phaseB = time * speed * 0.52;

    context.beginPath();

    for (let x = 0; x <= width; x += step) {
      const waveA = Math.sin(x * frequency + phaseA);
      const waveB = Math.sin(x * frequency * 0.42 - phaseB);
      const lift = (waveA + waveB) * amplitude;
      const y = yBase + (invert ? -lift : lift);

      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.globalAlpha = opacity * glowScale;
    context.shadowBlur = opacity > 0.5 ? (12 + amplitude * 0.22) * glowScale : 0;
    context.shadowColor = color;
    context.stroke();
  }

  function drawGlowBand(context, width, height, edgeGradient, glowScale = 1) {
    context.globalAlpha = glowScale;
    context.shadowBlur = 0;
    context.fillStyle = edgeGradient;
    context.fillRect(0, 0, width, height);
  }

  function drawSoftFill(context, options) {
    const {
      width,
      time,
      yBase,
      amplitude,
      frequency,
      speed,
      color,
      thickness,
      alphaScale = 1,
      invert = false
    } = options;

    const step = 24;
    const phaseA = time * speed;
    const phaseB = time * speed * 0.45;

    context.beginPath();
    context.moveTo(0, yBase);

    for (let x = 0; x <= width; x += step) {
      const waveA = Math.sin(x * frequency + phaseA);
      const waveB = Math.sin(x * frequency * 0.35 - phaseB);
      const lift = (waveA + waveB) * amplitude;
      context.lineTo(x, yBase + (invert ? -lift : lift));
    }

    context.lineTo(width, yBase + (invert ? -thickness : thickness));
    context.lineTo(0, yBase + (invert ? -thickness : thickness));
    context.closePath();

    context.globalAlpha = alphaScale;
    context.shadowBlur = 0;
    context.fillStyle = color;
    context.fill();
  }

  function computeWrappedDistance(fromDistance, toDistance, perimeter, direction) {
    if (direction >= 0) {
      return (toDistance - fromDistance + perimeter) % perimeter;
    }

    return (fromDistance - toDistance + perimeter) % perimeter;
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace(/^#/, ''), 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ];
  }

  function hexToHsl(hex) {
    let [ r, g, b ] = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function applyOptimizedShadow(context, color, blurRadius, performanceMode = 'balanced') {
    if (performanceMode === 'performance') {
      // Disable shadows in performance mode
      context.shadowBlur = 0;
      context.shadowColor = 'transparent';
      return;
    }

    if (performanceMode === 'balanced') {
      // Reduce shadow blur by 40% in balanced mode
      blurRadius *= 0.6;
    }

    // Apply shadow directly for high quality mode
    context.shadowBlur = blurRadius;
    context.shadowColor = color;
  }

  function getPerformanceMultiplier(performanceMode) {
    switch (performanceMode) {
      case 'performance': return 0.4;
      case 'balanced': return 0.7;
      case 'quality': return 1.0;
      default: return 1.0;
    }
  }

  window.ParalineShared = {
    TRANSPARENT_HAZE,
    clamp01,
    getGlowMultiplier,
    resolveAnimatedColor,
    drawWave,
    drawGlowBand,
    drawSoftFill,
    computeWrappedDistance,
    hexToRgb,
    hexToHsl,
    applyOptimizedShadow,
    getPerformanceMultiplier
  };
})();
