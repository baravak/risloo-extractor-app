// setVar Helper
// Setting Variable inside Handlebars

function setVar(varName, varValue, options) {
  this[varName] = varValue
}

module.exports = setVar;