// assignGlobal Helper
// Globally assign a variable that can be accessed via root in handlebars

function assignGlobal(name, val, options) {
  if (!options.data.root) options.data.root = {};
  options.data.root[name] = val;
}

module.exports = assignGlobal;
