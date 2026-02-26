/* GA8 nomograph scaffold.
 * This is a chart-digitized engine skeleton, not yet calibrated.
 * Fill `ga8_nomograph_template.json` with real traced points.
 */

function clamp(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ratio(v, a, b) {
  if (a === b) return 0;
  return (v - a) / (b - a);
}

function axisMapFromTicks(ticks) {
  if (!Array.isArray(ticks) || ticks.length < 2) {
    throw new Error("Axis ticks require at least 2 points");
  }
  const [p0, p1] = ticks;
  const x0 = p0[0], v0 = p0[1];
  const x1 = p1[0], v1 = p1[1];
  const m = (v1 - v0) / (x1 - x0);
  const b = v0 - m * x0;
  return {
    toValue(px) { return m * px + b; },
    toPx(v) { return (v - b) / m; }
  };
}

function yAtX(points, x) {
  if (!points || points.length < 2) return null;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const lo = Math.min(x0, x1), hi = Math.max(x0, x1);
    if (x >= lo && x <= hi) {
      const t = ratio(x, x0, x1);
      return lerp(y0, y1, t);
    }
  }
  return null;
}

function xAtY(points, y) {
  if (!points || points.length < 2) return null;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
    if (y >= lo && y <= hi) {
      const t = ratio(y, y0, y1);
      return lerp(x0, x1, t);
    }
  }
  return null;
}

function blendByKey(families, key) {
  if (!families || !families.length) throw new Error("No family traces");
  const sorted = [...families].sort((a, b) => a.key - b.key);
  if (key <= sorted[0].key) return { lo: sorted[0], hi: sorted[0], t: 0 };
  if (key >= sorted[sorted.length - 1].key) {
    const z = sorted[sorted.length - 1];
    return { lo: z, hi: z, t: 0 };
  }
  for (let i = 1; i < sorted.length; i++) {
    const lo = sorted[i - 1];
    const hi = sorted[i];
    if (key >= lo.key && key <= hi.key) {
      return { lo, hi, t: ratio(key, lo.key, hi.key) };
    }
  }
  return { lo: sorted[0], hi: sorted[0], t: 0 };
}

function interpolateFamilyY(families, familyValue, x) {
  const { lo, hi, t } = blendByKey(families, familyValue);
  const yLo = yAtX(lo.points, x);
  const yHi = yAtX(hi.points, x);
  if (yLo == null || yHi == null) return null;
  return lerp(yLo, yHi, t);
}

function interpolateFamilyX(families, familyValue, y) {
  const { lo, hi, t } = blendByKey(families, familyValue);
  const xLo = xAtY(lo.points, y);
  const xHi = xAtY(hi.points, y);
  if (xLo == null || xHi == null) return null;
  return lerp(xLo, xHi, t);
}

function validateNomographModel(model) {
  if (!model || !Array.isArray(model.panels) || model.panels.length !== 6) {
    throw new Error("Expected 6 nomograph panels");
  }
}

/* Runs the chained GA8 nomograph sections.
 * Inputs are the chart variables; output is distance in metres.
 */
function runGa8Nomograph(model, {
  oatC,
  paFt,
  weightKg,
  windKt,
  slopePct,
  surface,       // 'paved' or 'grass' (grass == short dry grass/gravel)
  obstacleFt     // 0 for ground roll, 50 for over-50
}) {
  validateNomographModel(model);
  const [pOatPa, pWeight, pWind, pSlope, pSurface, pObstacle] = model.panels;

  const oatAxis = axisMapFromTicks(pOatPa.input_axis.ticks);
  const xOat = oatAxis.toPx(oatC);
  let y = interpolateFamilyY(pOatPa.families, paFt, xOat);
  if (y == null) throw new Error("OAT/PA panel intersection failed");

  const wAxis = axisMapFromTicks(pWeight.input_axis.ticks);
  const xW = wAxis.toPx(weightKg);
  y = interpolateFamilyY(pWeight.families, weightKg, xW) ?? y;

  const windAxis = axisMapFromTicks(pWind.input_axis.ticks);
  const xWind = windAxis.toPx(windKt);
  y = interpolateFamilyY(pWind.families, windKt, xWind) ?? y;

  const slopeAxis = axisMapFromTicks(pSlope.input_axis.ticks);
  const xSlope = slopeAxis.toPx(slopePct);
  y = interpolateFamilyY(pSlope.families, slopePct, xSlope) ?? y;

  const surfTrace = pSurface.traces?.[surface];
  if (!surfTrace) throw new Error(`Missing surface trace: ${surface}`);
  const xSurf = xAtY(surfTrace, y);
  if (xSurf == null) throw new Error("Surface panel intersection failed");

  const obsAxis = axisMapFromTicks(pObstacle.input_axis.ticks);
  const xObs = obsAxis.toPx(obstacleFt);
  y = interpolateFamilyY(pObstacle.families, obstacleFt, xObs) ?? y;

  const distAxis = axisMapFromTicks(pObstacle.output_axis.ticks);
  return distAxis.toValue(y);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runGa8Nomograph,
    validateNomographModel
  };
}
