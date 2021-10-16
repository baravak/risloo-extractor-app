// ellipsisChars Helper
// Putting Ellipsis onto String if Exceeded Our Limit

function ellipsisChars(string, maxChar, options) {
  if (string.length <= maxChar) return string;
  const output = string.slice(0, maxChar) + " ...";
  return output;
}

module.exports = ellipsisChars;
