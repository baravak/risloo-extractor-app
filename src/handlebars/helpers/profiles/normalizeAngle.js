// This function is for normalizing given angles in the range (-PI, PI]

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

module.exports = normalizeAngle;