// withGroup Helper
// Block Helper that Groups Array Elements by Given Group Size

function withGroup(array, size, options) {
  var result = '';
  if (Array.isArray(array) && array.length > 0) {
    var subcontext = [];
    for (var i = 0; i < array.length; i++) {
      if (i > 0 && (i % size) === 0) {
        result += options.fn(subcontext);
        subcontext = [];
      }
      subcontext.push(array[i]);
    }
    result += options.fn(subcontext);
  }
  return result;
};

module.exports = withGroup;