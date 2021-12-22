// first Helper
// Returns the first item, or first `n` items of an array.

function first(array, n) {
  if (typeof n !== 'number') {
    return array[0];
  }
  return array.slice(0, n);
}

module.exports = first;
