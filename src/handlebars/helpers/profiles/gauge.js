// gauge Helper
// This helper is used to provide the path tag for the gauge chart

const Handlebars = require("handlebars");
const calcGaugeSidePoints = require("./calcGaugeSidePoints");
const normalizeAngle = require("./normalizeAngle");

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

  // Calculate "d" Attribute of Path
  let dAttr = `M ${sidePoints.start.P1.toString}`;

  dAttr += `A ${R} ${R} 1 ${totalAngle > Math.PI ? 1 : 0} ${direction ? 0 : 1} ${sidePoints.end.P1.toString}`;

  dAttr += brs.tr ? `A ${brs.tr} ${brs.tr} 1 0 ${direction ? 0 : 1} ${sidePoints.end.P1_PRIME.toString}` : "";
  dAttr += `L ${sidePoints.end.P2_PRIME?.toString || sidePoints.end.P2.toString}`;
  dAttr += brs.br ? `A ${brs.br} ${brs.br} 1 0 ${direction ? 0 : 1} ${sidePoints.end.P2.toString}` : "";

  dAttr += `A ${r} ${r} 1 ${totalAngle > Math.PI ? 1 : 0} ${direction ? 1 : 0} ${sidePoints.start.P2.toString}`;

  dAttr += brs.bl ? `A ${brs.bl} ${brs.bl} 1 0 ${direction ? 0 : 1} ${sidePoints.start.P2_PRIME.toString}` : "";
  dAttr += `L ${sidePoints.start.P1_PRIME?.toString || sidePoints.start.P1.toString}`;
  dAttr += brs.tl ? `A ${brs.tl} ${brs.tl} 1 0 ${direction ? 0 : 1} ${sidePoints.start.P1.toString}` : "";

  let result = `<path d="${dAttr}" ${attributes.join(" ")}/>`;

  return new Handlebars.SafeString(result);
}

module.exports = gauge;
