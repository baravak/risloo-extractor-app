// last Helper
// Returns the last item, or last `n` items of an array or string.

function last(value, n) {
  if (typeof n !== 'number') {
    return value[value.length - 1];
  }
  return value.slice(-Math.abs(n));
};

module.exports = last;