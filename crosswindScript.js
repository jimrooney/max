function byId(id) {
  return document.getElementById(id);
}

function normalizeDegrees(value) {
  const n = Number(value) || 0;
  return ((n % 360) + 360) % 360;
}

function calculateWindComponents(runwayDirection, windSpeed, windDirection) {
  const runwayRad = (runwayDirection * Math.PI) / 180;
  const windRad = (windDirection * Math.PI) / 180;
  return {
    head: windSpeed * Math.cos(windRad - runwayRad),
    cross: windSpeed * Math.sin(windRad - runwayRad),
  };
}

function bindInputAndSlider(inputId, sliderId) {
  const input = byId(inputId);
  const slider = byId(sliderId);
  if (!input || !slider) return;

  const opts = getPairOptions(inputId);
  input.addEventListener("input", () => setInputPairValue(inputId, sliderId, input.value, opts));
  slider.addEventListener("input", () => setInputPairValue(inputId, sliderId, slider.value, opts));
}

function setInputPairValue(inputId, sliderId, value, opts = {}) {
  const input = byId(inputId);
  const slider = byId(sliderId);
  if (!input || !slider) return;

  let n = Number(value);
  if (!isFinite(n)) return;

  if (opts.normalizeDegrees) n = normalizeDegrees(n);
  if (isFinite(opts.step) && opts.step > 0) n = Math.round(n / opts.step) * opts.step;
  if (isFinite(opts.min)) n = Math.max(opts.min, n);
  if (isFinite(opts.max)) n = Math.min(opts.max, n);
  if (isFinite(opts.precision)) n = Number(n.toFixed(opts.precision));

  input.value = String(n);
  slider.value = String(n);
  if (opts.skipRender) return;
  updateDisplay();
}

function getPairOptions(inputId) {
  if (inputId === "rwy" || inputId === "windDir") {
    return { normalizeDegrees: true, min: 0, max: 360, step: 10, precision: 0 };
  }
  if (inputId === "windSpd") {
    return { min: 0, max: 40, precision: 0 };
  }
  return {};
}

const WIND_RING = Object.freeze({
  center: 150,
  maxWindKt: 40,
  runwayHeading: 90,
  windTipBearing: 28.8,
  headTipBearing: 296.8,
  crossTipBearing: 299.1,
  windTip: { x: 184.4, y: 87.37 },
  headTip: { x: 59.34, y: 104.15 },
  crossTip: { x: 89.94, y: 116.58 },
  windRadius: 104,
  headRadius: 42,
  crossRadius: 42,
  windLabelOffset: 14,
  headLabelOffset: 30,
  crossLabelOffset: 16,
});

function ringScale(magnitude, basis, minScale = 0.2) {
  if (!isFinite(magnitude) || magnitude <= 0 || !isFinite(basis) || basis <= 0) return minScale;
  return Math.max(minScale, Math.min(1, magnitude / basis));
}

function setWindRingRotate(id, rotationDeg, opacity = 1, scale = 1) {
  const el = byId(id);
  if (!el) return;
  const c = WIND_RING.center;
  el.setAttribute("transform", `translate(${c} ${c}) rotate(${rotationDeg}) scale(${scale}) translate(${-c} ${-c})`);
  el.style.opacity = String(opacity);
}

function setWindRingIdentity(id) {
  const el = byId(id);
  if (!el) return;
  el.setAttribute("transform", "matrix(1 0 0 1 0 0)");
}

function ringPoint(bearingDeg, radius) {
  const theta = (bearingDeg * Math.PI) / 180;
  return {
    x: WIND_RING.center + radius * Math.sin(theta),
    y: WIND_RING.center - radius * Math.cos(theta),
    theta,
  };
}

function setWindRingLabel(id, value, bearingDeg, radius, offset) {
  const el = byId(id);
  if (!el) return;
  const p = ringPoint(bearingDeg, radius + offset);
  const tangent = 8;
  el.setAttribute("x", String(p.x + Math.cos(p.theta) * tangent));
  el.setAttribute("y", String(p.y + Math.sin(p.theta) * tangent));
  el.textContent = `${Math.round(Math.abs(value))} kt`;
}

function setWindRingIndicatorPlacement(id, bearingDeg, radius, scale, tip, baseBearing, opacity = 1) {
  const el = byId(id);
  if (!el) return;

  const theta = (bearingDeg * Math.PI) / 180;
  const targetX = WIND_RING.center + radius * Math.sin(theta);
  const targetY = WIND_RING.center - radius * Math.cos(theta);
  const delta = ((bearingDeg - baseBearing) * Math.PI) / 180;
  const cos = Math.cos(delta) * scale;
  const sin = Math.sin(delta) * scale;
  const a = cos;
  const b = sin;
  const c = -sin;
  const d = cos;
  const e = targetX - (a * tip.x + c * tip.y);
  const f = targetY - (b * tip.x + d * tip.y);

  el.setAttribute("transform", `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
  el.style.opacity = String(opacity);
}

function updateWindRing(head, cross) {
  if (!byId("windRingWidget")) return;

  const runwayHeading = normalizeDegrees(byId("rwy")?.value);
  const windDirection = normalizeDegrees(byId("windDir")?.value);
  const windSpeed = Math.max(0, Number(byId("windSpd")?.value) || 0);
  const headAbs = Math.abs(head);
  const crossAbs = Math.abs(cross);

  setWindRingRotate("runwayGroup", runwayHeading - WIND_RING.runwayHeading, 1);
  setWindRingRotate("aircraftGroup", runwayHeading - WIND_RING.runwayHeading + 180, 1, 0.5);
  setWindRingIdentity("windDirChevronScale");
  setWindRingIdentity("headwindChevronScale");
  setWindRingIdentity("crosswindChevronScale");

  setWindRingIndicatorPlacement(
    "windDirChevronRotate",
    windDirection,
    WIND_RING.windRadius,
    ringScale(windSpeed, WIND_RING.maxWindKt, 0.25),
    WIND_RING.windTip,
    WIND_RING.windTipBearing,
    windSpeed > 0 ? 1 : 0.2
  );
  setWindRingLabel("windDirLabel", windSpeed, windDirection, WIND_RING.windRadius, WIND_RING.windLabelOffset);

  const headBearing = runwayHeading + (head >= 0 ? 0 : 180);
  const crossBearing = runwayHeading + (cross >= 0 ? 90 : -90);

  setWindRingIndicatorPlacement(
    "headwindChevronRotate",
    headBearing,
    WIND_RING.headRadius,
    ringScale(headAbs, Math.max(windSpeed, 1), 0.2),
    WIND_RING.headTip,
    WIND_RING.headTipBearing + 180,
    headAbs > 0 ? 1 : 0.2
  );
  setWindRingIndicatorPlacement(
    "crosswindChevronRotate",
    crossBearing,
    WIND_RING.crossRadius,
    ringScale(crossAbs, Math.max(windSpeed, 1), 0.2),
    WIND_RING.crossTip,
    WIND_RING.crossTipBearing,
    crossAbs > 0 ? 1 : 0.2
  );

  setWindRingLabel("headwindLabel", headAbs, headBearing, WIND_RING.headRadius, WIND_RING.headLabelOffset);
  setWindRingLabel("crosswindLabel", crossAbs, crossBearing, WIND_RING.crossRadius, WIND_RING.crossLabelOffset);
}

function updateDisplay() {
  const runwayDirection = normalizeDegrees(byId("rwy")?.value);
  const windSpeed = Math.max(0, Number(byId("windSpd")?.value) || 0);
  const windDirection = normalizeDegrees(byId("windDir")?.value);

  const components = calculateWindComponents(runwayDirection, windSpeed, windDirection);
  byId("headComp").textContent = String(Math.round(Math.abs(components.head)));
  byId("crossComp").textContent = String(Math.round(Math.abs(components.cross)));
  byId("headLabel").textContent = components.head >= 0 ? "headwind" : "tailwind";
  updateWindRing(components.head, components.cross);
  renderVerticalWindSlider(windSpeed);
}

bindInputAndSlider("rwy", "rwySlider");
bindInputAndSlider("windDir", "windDirSlider");
bindInputAndSlider("windSpd", "windSpdSlider");

function getSvgPointerPoint(evt) {
  const svg = byId("windRingWidget");
  if (!svg) return null;
  const client = getEventClientPoint(evt);
  if (!client) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const x = (client.clientX - ctm.e) / ctm.a;
  const y = (client.clientY - ctm.f) / ctm.d;
  return { x, y };
}

function getEventClientPoint(evt) {
  if (!evt) return null;
  if (isFinite(evt.clientX) && isFinite(evt.clientY)) return { clientX: evt.clientX, clientY: evt.clientY };
  const t = evt.touches?.[0] || evt.changedTouches?.[0];
  if (t && isFinite(t.clientX) && isFinite(t.clientY)) return { clientX: t.clientX, clientY: t.clientY };
  return null;
}

function getTouchById(list, id) {
  if (!list || id == null) return null;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].identifier === id) return list[i];
  }
  return null;
}

function pointToBearingDeg(point) {
  const dx = point.x - WIND_RING.center;
  const dy = point.y - WIND_RING.center;
  return normalizeDegrees((Math.atan2(dx, -dy) * 180) / Math.PI);
}

function setupWindRingDragging() {
  const svg = byId("windRingWidget");
  const runwayGroup = byId("runwayGroup");
  const windChevron = byId("windDirChevronRotate");
  if (!svg || !runwayGroup || !windChevron) return;

  let dragMode = null;
  let activePointerId = null;
  let activeTouchId = null;

  const updateFromEvent = (evt) => {
    if (!dragMode) return;
    const point = getSvgPointerPoint(evt);
    if (!point) return;
    const bearing = pointToBearingDeg(point);
    if (dragMode === "runway") {
      setInputPairValue("rwy", "rwySlider", bearing, getPairOptions("rwy"));
    } else if (dragMode === "wind") {
      setInputPairValue("windDir", "windDirSlider", bearing, getPairOptions("windDir"));
    }
    evt.preventDefault?.();
  };

  const stopDrag = () => {
    if (!dragMode) return;
    dragMode = null;
    activeTouchId = null;
    svg.classList.remove("dragging");
    const pointerId = activePointerId;
    activePointerId = null;
    try {
      if (pointerId != null) svg.releasePointerCapture?.(pointerId);
    } catch (_) {}
  };

  const startDrag = (mode, evt) => {
    dragMode = mode;
    activePointerId = evt.pointerId ?? null;
    svg.classList.add("dragging");
    if (evt.pointerId != null) svg.setPointerCapture?.(evt.pointerId);
    updateFromEvent(evt);
    evt.preventDefault?.();
  };

  if ("PointerEvent" in window) {
    runwayGroup.addEventListener("pointerdown", (evt) => startDrag("runway", evt));
    windChevron.addEventListener("pointerdown", (evt) => startDrag("wind", evt));
    svg.addEventListener("pointermove", (evt) => {
      if (activePointerId !== evt.pointerId) return;
      updateFromEvent(evt);
    });
    svg.addEventListener("pointerup", stopDrag);
    svg.addEventListener("pointercancel", stopDrag);
    svg.addEventListener("pointerleave", stopDrag);
    return;
  }

  const startMouseDrag = (mode, evt) => startDrag(mode, evt);
  runwayGroup.addEventListener("mousedown", (evt) => startMouseDrag("runway", evt));
  windChevron.addEventListener("mousedown", (evt) => startMouseDrag("wind", evt));
  document.addEventListener("mousemove", (evt) => {
    if (!dragMode) return;
    updateFromEvent(evt);
  });
  document.addEventListener("mouseup", stopDrag);

  const startTouchDrag = (mode, evt) => {
    const t = evt.changedTouches?.[0];
    if (!t) return;
    activeTouchId = t.identifier;
    startDrag(mode, t);
    evt.preventDefault();
  };
  runwayGroup.addEventListener("touchstart", (evt) => startTouchDrag("runway", evt), { passive: false });
  windChevron.addEventListener("touchstart", (evt) => startTouchDrag("wind", evt), { passive: false });
  document.addEventListener("touchmove", (evt) => {
    if (!dragMode || activeTouchId == null) return;
    const touch = getTouchById(evt.touches, activeTouchId) || getTouchById(evt.changedTouches, activeTouchId);
    if (!touch) return;
    updateFromEvent(touch);
    evt.preventDefault();
  }, { passive: false });
  document.addEventListener("touchend", (evt) => {
    const touch = getTouchById(evt.changedTouches, activeTouchId);
    if (!touch) return;
    stopDrag();
  });
  document.addEventListener("touchcancel", stopDrag);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getWindSpeedMax() {
  return Number(byId("windSpdSlider")?.max) || 40;
}

function buildVerticalWindSliderMarks() {
  const labels = byId("windSpdVLabels");
  const ticks = byId("windSpdVTicks");
  const max = getWindSpeedMax();
  if (!labels || !ticks || !isFinite(max) || max <= 0) return;

  labels.textContent = "";
  ticks.textContent = "";

  for (let value = max; value >= 0; value -= 10) {
    const lbl = document.createElement("span");
    lbl.textContent = String(value);
    labels.appendChild(lbl);
  }

  for (let value = 0; value <= max; value += 10) {
    const tick = document.createElement("span");
    const pct = (value / max) * 100;
    tick.style.bottom = `${pct}%`;
    ticks.appendChild(tick);
  }
}

function renderVerticalWindSlider(speedValue) {
  const rail = byId("windSpdVRail");
  const fill = byId("windSpdVFill");
  const thumb = byId("windSpdVThumb");
  const slider = byId("windSpdV");
  const max = getWindSpeedMax();
  if (!rail || !fill || !thumb || !slider || !isFinite(max) || max <= 0) return;

  const value = clamp(Number(speedValue) || 0, 0, max);
  const pct = (value / max) * 100;
  fill.style.height = `${pct}%`;
  thumb.style.bottom = `${pct}%`;
  thumb.textContent = String(Math.round(value));
  slider.setAttribute("aria-valuemax", String(max));
  slider.setAttribute("aria-valuenow", String(Math.round(value)));
}

function setupVerticalWindSliderDragging() {
  const slider = byId("windSpdV");
  const rail = byId("windSpdVRail");
  const thumb = byId("windSpdVThumb");
  if (!slider || !rail) return;

  let activePointerId = null;
  let activeTouchId = null;

  const setFromPointer = (evt) => {
    const client = getEventClientPoint(evt);
    if (!client) return;
    const rect = rail.getBoundingClientRect();
    if (!rect.height) return;
    const ratio = clamp((rect.bottom - client.clientY) / rect.height, 0, 1);
    const value = ratio * getWindSpeedMax();
    setInputPairValue("windSpd", "windSpdSlider", value, getPairOptions("windSpd"));
  };

  const startDrag = (evt) => {
    activePointerId = evt.pointerId ?? -1;
    slider.classList.add("dragging");
    if (evt.pointerId != null) slider.setPointerCapture?.(evt.pointerId);
    setFromPointer(evt);
    evt.preventDefault();
  };

  const endDrag = (evt) => {
    if (evt?.pointerId != null && activePointerId !== evt.pointerId) return;
    try {
      if (evt?.pointerId != null) slider.releasePointerCapture?.(evt.pointerId);
    } catch (_) {}
    activePointerId = null;
    activeTouchId = null;
    slider.classList.remove("dragging");
  };

  if ("PointerEvent" in window) {
    slider.addEventListener("pointerdown", startDrag);
    slider.addEventListener("pointermove", (evt) => {
      if (activePointerId !== evt.pointerId) return;
      setFromPointer(evt);
      evt.preventDefault();
    });
    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
    slider.addEventListener("pointerleave", () => {
      if (activePointerId == null) slider.classList.remove("dragging");
    });
    thumb?.addEventListener("pointerdown", (evt) => evt.preventDefault());
    return;
  }

  slider.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", (evt) => {
    if (activePointerId == null && activeTouchId == null) return;
    setFromPointer(evt);
  });
  document.addEventListener("mouseup", endDrag);

  slider.addEventListener("touchstart", (evt) => {
    const t = evt.changedTouches?.[0];
    if (!t) return;
    activeTouchId = t.identifier;
    slider.classList.add("dragging");
    setFromPointer(t);
    evt.preventDefault();
  }, { passive: false });
  document.addEventListener("touchmove", (evt) => {
    if (activeTouchId == null) return;
    const touch = getTouchById(evt.touches, activeTouchId) || getTouchById(evt.changedTouches, activeTouchId);
    if (!touch) return;
    setFromPointer(touch);
    evt.preventDefault();
  }, { passive: false });
  document.addEventListener("touchend", (evt) => {
    const touch = getTouchById(evt.changedTouches, activeTouchId);
    if (!touch) return;
    endDrag();
  });
  document.addEventListener("touchcancel", endDrag);
  thumb?.addEventListener("touchstart", (evt) => evt.preventDefault(), { passive: false });
}

buildVerticalWindSliderMarks();
setupVerticalWindSliderDragging();
setupWindRingDragging();
updateDisplay();
