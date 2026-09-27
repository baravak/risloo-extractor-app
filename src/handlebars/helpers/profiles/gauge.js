// gauge Helper
// This helper is used to provide the path tag for the gauge chart

const Handlebars = require("handlebars");
const calcGaugeSidePoints = require("./calcGaugeSidePoints");
const normalizeAngle = require("../normalizeAngle");

/**
 * Create path tag for the gauge element used in the profiles
 * @param  {number} R - outer radius
 * @param  {number} r - inner radius
 * @param  {object} brs - border radiuses: {tl: top-left, tr: top-right, bl: bottom-left, br: bottom-right}
 * @param  {object} angles - angles of sides of the gauge: {start, end}
 * @param  {boolean} direction - direction of the gauge (false: clockwise, true: counterclockwise)
 * @param  {object} options
 */
function gauge(R, r, brs, angles, direction, options) {
  // Extract attributes out of options
  const attributes = [];

  Object.keys(options.hash).forEach((key) => {
    const escapedKey = Handlebars.escapeExpression(key);
    const escapedValue = Handlebars.escapeExpression(options.hash[key]);
    attributes.push(escapedKey + '="' + escapedValue + '"');
  });

  // Normalize the angles to be in the range (-PI, PI]
  for (let key in angles) angles[key] = normalizeAngle(angles[key]);

  let isGreater = true;
  if (angles.end < angles.start) isGreater = false;

  const totalAngle =
    direction ^ isGreater ? Math.abs(angles.end - angles.start) : 2 * Math.PI - Math.abs(angles.end - angles.start);

  const sidePoints = {
    start: calcGaugeSidePoints(R, r, { top: brs.tl, bottom: brs.bl }, angles.start, true, direction),
    end: calcGaugeSidePoints(R, r, { top: brs.tr, bottom: brs.br }, angles.end, false, direction),
  };

  // The corner radii trim each edge arc, so the arc actually drawn spans less
  // than totalAngle. Decide each large-arc flag from the arc's own endpoints:
  // a sweep just over PI trimmed below PI must not take the large arc.
  const largeArc = (from, to) => {
    let span = Math.atan2(to.y, to.x) - Math.atan2(from.y, from.x);
    if (direction) span = -span;
    span = ((span % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    // A span near 0 means the trimmed arc still wraps almost a full circle.
    if (span < 1e-6 && totalAngle > Math.PI) return 1;
    return span > Math.PI ? 1 : 0;
  };

  // Calculate "d" Attribute of Path
  let dAttr = `M ${sidePoints.start.P1.toString}`;

  dAttr += `A ${R} ${R} 1 ${largeArc(sidePoints.start.P1, sidePoints.end.P1)} ${direction ? 0 : 1} ${sidePoints.end.P1.toString}`;

  dAttr += brs.tr ? `A ${brs.tr} ${brs.tr} 1 0 ${direction ? 0 : 1} ${sidePoints.end.P1_PRIME.toString}` : "";
  dAttr += `L ${sidePoints.end.P2_PRIME?.toString || sidePoints.end.P2.toString}`;
  dAttr += brs.br ? `A ${brs.br} ${brs.br} 1 0 ${direction ? 0 : 1} ${sidePoints.end.P2.toString}` : "";

  dAttr += `A ${r} ${r} 1 ${largeArc(sidePoints.start.P2, sidePoints.end.P2)} ${direction ? 1 : 0} ${sidePoints.start.P2.toString}`;

  dAttr += brs.bl ? `A ${brs.bl} ${brs.bl} 1 0 ${direction ? 0 : 1} ${sidePoints.start.P2_PRIME.toString}` : "";
  dAttr += `L ${sidePoints.start.P1_PRIME?.toString || sidePoints.start.P1.toString}`;
  dAttr += brs.tl ? `A ${brs.tl} ${brs.tl} 1 0 ${direction ? 0 : 1} ${sidePoints.start.P1.toString}` : "";

  let result = `<path d="${dAttr}" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = gauge;
