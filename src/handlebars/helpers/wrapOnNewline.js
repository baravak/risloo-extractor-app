// wrapOnNewline Helper
// Used to split a string by \n to create lines

const Handlebars = require("handlebars");

function wrapOnNewline(string) {
  string = string.replace(/\\n/gm, '\n');
  return string.split(/\n/gm);
}

module.exports = wrapOnNewline;