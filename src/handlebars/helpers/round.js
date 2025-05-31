// ceil Helper
// Get the `Math.round()` of the given value.

function round(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

module.exports = round;