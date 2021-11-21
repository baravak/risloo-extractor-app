// This Function is Used in the Gauge Helper and It's not an Independant Helper Itself.

const polarToCartesian = require("../polarToCartesian");
const P2C = polarToCartesian;

/**
 * This function is used to calculate gauge element side points
 * @param  {number} R - outer radius
 * @param  {number} r - inner radius
 * @param  {object} br - border radiuses: {top, bottom}
 * @param  {number} angle - angle of the end in radians
 * @param  {boolean} start - whether the corresponding side is start or end of the gauge element
 * @param  {boolean} direction - direction of the gauge (false: clockwise, true: counterclockwise)
 */
function calcGaugeSidePoints(R, r, brs, angle, start, direction) {
  const alpha = {}, theta = {};
  for (let key in brs) {
    alpha[key] = Math.asin(brs[key] / (R - brs[key]));
    theta[key] = angle + (start ^ direction ? 1 : -1) * alpha[key];
  }

  let points = {
    P1: P2C(R, theta.top),
    P2: P2C(r, theta.bottom),
  };

  if (brs.top)
    points["P1_PRIME"] = P2C((R - brs.top) * Math.cos(alpha.top), angle);
  if (brs.bottom)
    points["P2_PRIME"] = P2C((r + brs.bottom) * Math.cos(alpha.bottom), angle);

  return points;
}

module.exports = calcGaugeSidePoints;
