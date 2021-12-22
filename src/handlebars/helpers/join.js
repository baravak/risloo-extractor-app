// join Helper
// Join all elements of array into a string, optionally using a given separator

function join(array, separator) {
  if (typeof array === 'string') return array;
  if (!Array.isArray(array)) return '';
  return array.join(separator);
};

module.exports = join;