// This Function is Used in the Gauge Helper and It's not an Independant Helper Itself.

const polarToCartesian = require('../polarToCartesian')

function calcGaugeEndpoints(R, r, br, angle, start, direction) {
  let points = {};

  if (br) {
    const alpha = Math.asin(br / (R - br));
    let theta = angle + (start ^ direction ? 1 : -1) * alpha;

    points = {
      P1: polarToCartesian(R, theta),
      P2: polarToCartesian((R - br) * Math.cos(alpha), angle),
      P3: polarToCartesian((r + br) * Math.cos(alpha), angle),
      P4: polarToCartesian(r, theta)
    };
  } else {
    points = {
      P1: polarToCartesian(R, angle),
      P2: polarToCartesian(r, angle),
    };
  }

  return points;
}

module.exports = calcGaugeEndpoints;
