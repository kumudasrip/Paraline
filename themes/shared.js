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

  window.ParalineShared = {
    TRANSPARENT_HAZE,
    clamp01,
    getGlowMultiplier,
    resolveAnimatedColor,
    drawWave,
    drawGlowBand,
    drawSoftFill,
    computeWrappedDistance
  };
})();
