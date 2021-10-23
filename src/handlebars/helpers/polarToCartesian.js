// polarToCartesian Helper
// Convert Polar Coordinates to Cartesian

function polarToCartesian(r, theta) {
  return {
    x: +(r * Math.cos(theta)).toFixed(2),
    y: +(r * Math.sin(theta)).toFixed(2),
  }
}

module.exports = polarToCartesian;