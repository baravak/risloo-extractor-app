// prepend Helper
// Prepends the Given String with the Specified Prefix

function prepend(str, prefix) {
  return typeof str === 'string' && typeof prefix === 'string'
    ? (prefix + str)
    : str;
};

module.exports = prepend;