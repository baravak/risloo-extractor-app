// displacePoint Helper
// This helper is used to displace given point by given vector and distance

function displacePoint(pt, u, d) {
  return {
    x: pt.x + d * u.x,
    y: pt.y + d * u.y,
  };
}

module.exports = displacePoint;