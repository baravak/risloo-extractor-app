// array Helper
// This helper is used to defined array literals in handlebars

function array() {
  return Array.from(arguments).slice(0, arguments.length - 1);
}

module.exports = array;